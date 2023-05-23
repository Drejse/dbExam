import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    //const productIds = ['cb34f0a84102c1ebc3ef6892d7444d36', 'c3b2f6ec9cf6250c960c26ee8ad33509']

    const { productIds } = req.query; // Retrieve productIds from request query parameters
    const parsedProductIds = Array.isArray(productIds) ? productIds : [productIds]; // Ensure productIds is an array


    const client = await clientPromise;
    const db = client.db("amazon");

    const posts = await db
      .collection("products")
      .find({ uniq_id: { $in: parsedProductIds } })
      .toArray();

    res.json(posts);
  } catch (e) {
    console.error(e);
    throw new Error(e).message;
  }
};




//const productIds = ['cb34f0a84102c1ebc3ef6892d7444d36', 'c3b2f6ec9cf6250c960c26ee8ad33509']; // Sample hardcoded productIds


/*
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("amazon");

        const posts = await db
            .collection("products")
            .find({})
            .limit(20)
            .toArray();

        res.json(posts);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
};
*/