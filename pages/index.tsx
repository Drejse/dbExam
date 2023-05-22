import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { fetchSupabase } from './mappers/fetchAllSupabase';
import { fetchAllComments } from './mappers/fetchAllComments';
import { fetchNeo4j } from '../lib/neo4jConnector'

type Props = {
  posts: [Post]
}

type Post = {
  _id: String;
  product_name: String;
  price: String;
}

export async function getServerSideProps() {

  console.log("der er hul igennem fra index.tsx - getserversideprops")
  try {

    console.log("useeffekt er god")
    const supabaseFetch = async () => {
      const result = await fetchSupabase();
      console.log(result);
    };
    
    const fetchAllCommentsFetch = async () => {
      const result = await fetchAllComments();
      console.log(result);
    };

    const neo4jFetch = async () => {
      const result = await fetchNeo4j();
      console.log(result);
    };
    let response = await fetch('http://localhost:3000/api/getPosts');
    let posts = await response.json();
    neo4jFetch();
      supabaseFetch();
      fetchAllCommentsFetch();
    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
    };
    
   
  } catch (e) {
    console.error(e);
    return {
      props: { posts: [] },
    };
  }
}



export default function Posts(props: Props) {

  

  const [posts, setPosts] = useState<[Post]>(props.posts);

  const handleDeletePost = async (postId: string) => {
    try {
      let response = await fetch('http://localhost:3000/api/deletePost?id=' + postId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      });
      response = await response.json();
      window.location.reload();
    } catch (error) {
      console.log('An error occurred while deleting ', error);
    }
  }

  return (
    <Layout>
      <div className="posts-body">
        <h1 className="posts-body-heading">Top 20 Added Posts</h1>
        {
          posts.length > 0 ? (
            <ul className="posts-list">
              {posts.map((post, index) => {
                return (
                  <li key={index} className="post-item">
                    <div className="post-item-details">
                      <h3>{post.product_name}</h3>
                      <p>{post.price}</p>
                    </div>
                    <div className="post-item-actions">
                      <a href={`/posts/${post._id} `}>Edit</a>
                      <button onClick={() => handleDeletePost(post._id as string)}>Delete</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <h2 className="posts-body-heading">Ooops! No posts added so far</h2>
          )
        }
      </div>
      <style jsx>
        {
          `
        .posts-body{
            width:400px;
            margin:10px auto;
        }
        .posts-body-heading{
            font-family:sans-serif;
        }
        .posts-list{
            list-style-type:none;
            display:block;
        }
        .post-item{
            width:100%;
            padding:10px;
            border: 1px solid #d5d5d5;
        }
        .post-item-actions{
            display:flex;
            justify-content:space-between;
        }
        .post-item-actions a{
            text-decoration:none;
        }
        `
        }
      </style>
    </Layout>
  );
}