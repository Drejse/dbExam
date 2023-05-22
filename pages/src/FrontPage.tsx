import { useEffect, useState } from 'react';
import { fetchSupabase } from '../mappers/fetchAllSupabase';
import { fetchAllComments } from '../mappers/fetchAllComments';
import { fetchNeo4j } from '../../lib/neo4jConnector';

import { purchaseItem } from '../mappers/purchaseItem';

import 'bootstrap/dist/css/bootstrap.css';

type Props = {
  posts: [Post]
}

type Post = {
  _id: String;
  product_name: String;
  amazon_category_and_sub_category: String;
  average_review_rating: String;
  description: String;
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

  { console.log(posts) }

  const test = (id: String, name: String) => {
    purchaseItem(id, name)
  }


  return (
    <div className='container'>
      <h1>Top 20 Added Posts</h1>

      <div className='row'>
        {posts.map((post, index) => (
          <div className='col-6 mb-2' key={index}>
            <div className='card p-4' style={{ width: '100%', height: '400px' }}>
              <div className='card-body d-flex flex-column'>
                <h5 className='card-title'>{post.product_name}</h5>
                <p
                  className='card-text mt-auto'
                  style={{
                    maxHeight: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 5, // Adjust the number to control the number of lines
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.description}
                </p>
                <div className="d-flex justify-content-between align-items-end">
                  <p className='card-text'>{post.average_review_rating}</p>
                  <button onClick={() => test(post._id, post.product_name)} className="btn btn-primary">Purchase</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};