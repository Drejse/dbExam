import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    console.log("Post has been added")
    const client = await clientPromise;
    const db = client.db("firstDataBase");
    const { title, content } = req.body;

    const post = await db.collection("users").insertOne({
      title:title,
      content:content,
    });

    res.json(post);

  } catch (e) {
    console.log("din far")
    console.error(e);
    throw new Error(e).message;
  }
};