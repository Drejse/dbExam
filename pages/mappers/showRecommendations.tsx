import neo4j from 'neo4j-driver';
import { supabase } from '../../lib/supabaseConnector';
import { useState } from 'react';

//gets the latest database entry from a specific user
//then returns the uniq_id of that entry
export async function getLatestRowByUser(user: String) {

    const { data, error } = await supabase
        .from('transaction_items')
        .select('product_id')
        .eq('user_token', user) // Update the function call
        .order('created_at', { ascending: false })
        .limit(1);
    if (error) {
        console.error(error);
        return null;
    }

    if (data && data.length > 0) {
        const latestRow = data[0];
        //returns the latest product_id of a given user
        console.log('user_Id', user)
        console.log('latest product', latestRow.product_id)
        return latestRow.product_id;
    }
    return null;
}

//returns a category from a specific product_id
export async function fetchDataFromNeo4j(product_id: any) {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
    const session = driver.session();

    try {
        const result = await session.run(`
        MATCH (n)
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



//returns a category from a specific product_id
export async function fetchRecommendationsFromNeo4j(category: any) {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));
    const session = driver.session();

    try {
        const result = await session.run(`
      MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: '${category}'})
      WITH p, rand() AS random
      RETURN p.name AS name, p.uniq_id AS uniq_id
      ORDER BY random, ID(p)
      LIMIT 5
    `);

        const data = result.records.map(record => ({
            name: record.get('name'),
            uniq_id: record.get('uniq_id')
        }));

        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    } finally {
        session.close();
        driver.close();
    }
}