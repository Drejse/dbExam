import clientPromise from "../../lib/mongodb";
export async function fetchAllComments() {
    try {
      const db = (await clientPromise).db('amazon');
      const collection = db.collection('products');
      const comments = await collection.find().toArray();
      return comments;
    } catch (err) {
      console.error(err);
    }
  }
  