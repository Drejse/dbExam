import clientPromise from "../../lib/mongodb";
export async function fetchAllComments() {
    try {
      const db = (await clientPromise).db('firstDataBase');
      const collection = db.collection('users');
      const comments = await collection.find().toArray();
      return comments;
    } catch (err) {
      console.error(err);
    }
  }
  