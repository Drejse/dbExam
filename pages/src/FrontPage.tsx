import { useEffect, useState } from 'react';
import { fetchSupabase } from '../mappers/fetchAllSupabase';
import { fetchAllComments } from '../mappers/fetchAllComments';
import { fetchNeo4j } from '../../lib/neo4jConnector';
import { purchaseItem } from '../mappers/purchaseItem';
import { fetchDataFromNeo4j, fetchRecommendationsFromNeo4j, getLatestRowByUser } from '../mappers/showRecommendations'; // Import the function

import { supabase } from '../../lib/supabaseConnector';

import 'bootstrap/dist/css/bootstrap.css';

type Props = {
  posts: [Post];
  recommendedPosts: [Post];
}

type Post = {
  uniq_id: string;
  product_name: string;
  amazon_category_and_sub_category: string;
  average_review_rating: string;
  description: string;
  price: string;
}

export async function getServerSideProps() {
  try {
    let response = await fetch('http://localhost:3000/api/getPosts');
    let posts = await response.json();
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

export async function getRecommendationPosts(arrayOfProducts: any) {

  try {
    const response = await fetch(`http://localhost:3000/api/findPostFromUniqId?idList=${arrayOfProducts}`);
    const recommendedPosts = await response.json();
    return recommendedPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
}



export default function Posts(props: Props) {
  const [user, setUser] = useState<String | any>();
  const [posts,] = useState<[Post]>(props.posts);
  const [recommendedPosts,] = useState<[Post]>(props.recommendedPosts);
  const [recommendations, setRecommendations] = useState<any>();
  const [neo4jRecommendation, setNeo4jRecommendation] = useState<any>([]);


  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setUser(session.data.session?.access_token);
      fetchLatestRow(session.data.session?.access_token); // Call the function to retrieve the latest row
    });
  }, []);

  const buyOnClick = (id: string, name: string) => {
    purchaseItem(id, name, user);
  }

  const fetchLatestRow = async (user: any) => {
    getLatestRowByUser(user)
      .then(product_id => {
        if (product_id) {
          return fetchDataFromNeo4j(product_id);
        } else {
          throw new Error('Unable to get the latest product ID');
        }
      })
      .then(async data => {


        //returns the cateogry based on the product_id from earlier
        console.log(fetchRecommendationsFromNeo4j(data));
        // Assuming you have the parameter value stored in a variable called 'paramValue'
        getRecommendationPosts(data);

        setRecommendations(fetchRecommendationsFromNeo4j(data))
        const pls = await fetchRecommendationsFromNeo4j(data)
        setNeo4jRecommendation(pls)

      })
      .catch(error => {
        console.error(error);
      });

    const fetchData = async () => {
      try {
        // Assuming you have the parameter value stored in a variable called 'paramValue'
        const result = await getRecommendationPosts(recommendations);
        console.log('asda')
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    // Call the fetchData function
    fetchData();
  }

  console.log(neo4jRecommendation)


  return (
    <>
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
                    <button onClick={() => buyOnClick(post.uniq_id, post.product_name)} className="btn btn-primary">Purchase</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr/>

        <div>
          <h2>Recommendations</h2>
          {neo4jRecommendation.map((post: any, index: any) => (
            <p key={index}>{post.name}</p>
          ))}
        </div>


      </div>
    </>
  );
};
