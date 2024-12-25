import dotenv from "dotenv";
import { fetchCommentsFromYT } from "./ytService.js";
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

const connectDB = async () => {
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  console.log('Connected to MongoDB');
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const storeCommentsInDB = async (comments) => {
  await connectDB();
  const db = getDB();
  const collection = db.collection('comments'); // Replace with your collection name
  await collection.insertMany(comments);
  console.log('Comments stored in MongoDB');
};

const fetchCommentsFromDB = async (videoId) => {
  await connectDB();
  const db = getDB();
  const collection = db.collection('comments');
  const comments = await collection.find({ videoId: videoId }).toArray();
  if (comments.length === 0) {
    const comments = await fetchCommentsFromYT(videoId);
    await storeCommentsInDB(comments);
    return comments;
  }
  return comments;
};

const updateCommentSentiment = async (commentId, sentiment) => {
  await connectDB();
  const db = getDB();
  const collection = db.collection('comments');
  await collection.updateOne({ commentId: commentId }, { $set: { sentiment: sentiment } });
};


export { storeCommentsInDB, fetchCommentsFromDB, updateCommentSentiment };