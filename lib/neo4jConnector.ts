import neo4j from 'neo4j-driver';

const uri = 'neo4j://localhost:7687';
const user = 'neo4j';
const password = '12345678';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
export const session = driver.session();

export const fetchNeo4j = async () => {
  try {
    const result = await session.run('MATCH (n) RETURN n LIMIT 5');
    const data = result.records.map(record => record.get('n').properties);
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    session.close();
    driver.close();
  }
};

