import neo4j from 'neo4j-driver';
import { supabase } from '../../lib/supabaseConnector';


//todo implement user current session
//todo check if the found category is dynamic or not

supabase.auth.getSession().then((session) => {
    const user = session.data.session?.access_token;
});

export async function getLatestRowByUser() {
    const { data, error } = await supabase
        .from('transaction_items')
        .select('product_id')
        .eq('user_token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjg0Nzg4MjM1LCJzdWIiOiIwZmY1OWQ1My04NTNkLTRlYmItYTNmYi02NGQ5YzhmNDE0NmIiLCJlbWFpbCI6InJvYmVydC5wYWxsZXNlbjEzQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNjg0NzgwOTU3fV0sInNlc3Npb25faWQiOiIwYzQ0N2YwNy1jM2UzLTQ0ZTktOTZhZC1jMDEwN2M2YWVkMjcifQ.irOG2i4yUvEX8IYlVsSZd0WMVnLtBT_o6QGaw45OPNg")
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error(error);
        return null;
    }

    if (data && data.length > 0) {
        const latestRow = data[0];
        //returns the latest product_id of a given user
        return latestRow.product_id;
    }
    return null;
}

export async function fetchDataFromNeo4j(product_id: any) {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
    const session = driver.session();

    try {
        const result = await session.run(`MATCH (n)
        WHERE n.uniq_id = '${product_id}'
        RETURN n.categories
        `);
        const data = result.records.map(record => record.get('n.categories'));
        return data;
    } catch (error) {
        console.error(error);
    } finally {
        session.close();
        driver.close();
    }
}

// Usage
getLatestRowByUser()
    .then(product_id => {
        if (product_id) {
            return fetchDataFromNeo4j(product_id);
        } else {
            throw new Error('Unable to get the latest product ID');
        }
    })
    .then(data => {
        //returns the cateogry based on the product_id from earlier
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
