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

export default function Posts(props: Props) {
  const [user, setUser] = useState<String | any>();
  const [posts,] = useState<[Post]>(props.posts);
  const [recommendations, setRecommendations] = useState<any>();

  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setUser(session.data.session?.access_token);
      fetchLatestRow(); // Call the function to retrieve the latest row
    });
  }, []);

  const buyOnClick = (id: string, name: string) => {
    purchaseItem(id, name, user);
  }

  const fetchLatestRow = async () => {
    getLatestRowByUser(user)
      .then(product_id => {
        if (product_id) {
          return fetchDataFromNeo4j(product_id);
        } else {
          throw new Error('Unable to get the latest product ID');
        }
      })
      .then(data => {
        //returns the cateogry based on the product_id from earlier
        console.log(fetchRecommendationsFromNeo4j(data));
      })
      .catch(error => {
        console.error(error);
      });
  }


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

        {/* Render the recommendations */}
        <div>
          <h2>Recommendations</h2>
          {recommendations && recommendations.map((recommendation: any, index: number) => (
            <div key={index}>
              {/* Render recommendation data */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
