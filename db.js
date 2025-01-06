import dotenv from "dotenv";
import { fetchCommentsFromYT } from "./ytService.js";
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

const connectDB = async () => {
  try {
    if (!db) {
      await client.connect();
      db = client.db(process.env.MONGO_DB);
      console.log('Connected to MongoDB');
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDB = async () => {
  if (!db) {
    await connectDB();
  }
  return db;
};

const storeCommentsInDB = async (comments) => {
  try {
    const db = await getDB();
    const collection = db.collection('comments');
    await collection.insertMany(comments);
    console.log('Comments stored in MongoDB');
  } catch (error) {
    console.error('Error storing comments:', error);
    throw error;
  }
};

const fetchCommentsFromDB = async (videoId) => {
  try {
    const db = await getDB();
    const collection = db.collection('comments');
    let comments = await collection.find({ videoId: videoId }).toArray();
    
    if (comments.length === 0) {
      console.log('No comments found in DB, fetching from YouTube...');
      comments = await fetchCommentsFromYT(videoId);
      if (comments && comments.length > 0) {
        await storeCommentsInDB(comments);
      }
    }
    
    if (!comments || comments.length === 0) {
      throw new Error('No comments found for this video');
    }
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const getSentimentFromDB = async (commentId) => {
  try {
    const db = await getDB();
    const comment = await db.collection('comments').findOne(
      { commentId },
      { projection: { sentiment: 1 } }
    );
    return comment?.sentiment || null;
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    throw error;
  }
};

const updateCommentSentiment = async (commentId, sentiment) => {
  try {
    const db = await getDB();
    await db.collection('comments').updateOne(
      { commentId: commentId },
      { $set: { sentiment: sentiment, analyzedAt: new Date() } }
    );
    console.log(`Updated sentiment for comment ${commentId}`);
  } catch (error) {
    console.error('Error updating comment sentiment:', error);
    throw error;
  }
};

export { storeCommentsInDB, fetchCommentsFromDB, updateCommentSentiment, getSentimentFromDB };