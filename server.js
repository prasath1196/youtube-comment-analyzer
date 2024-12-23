const { google } = require('googleapis');
const { connectDB, getDB } = require('./db');

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDyIdtshUQhy4U2Ppu6gB_MFlv61wHD7HI',
});

const storeCommentsInDB = async (comments) => {
  const db = getDB();
  const collection = db.collection('comments'); // Replace with your collection name
  await collection.insertMany(comments);
  console.log('Comments stored in MongoDB');
};

const fetchComments = async () => {
  try {
    const response = await youtube.commentThreads.list({
      part: ['snippet'],
      videoId: 'dQw4w9WgXcQ',
      maxResults: 100,
    });
    
    const comments = response.data.items.map(item => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));

    await storeCommentsInDB(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};

const startApp = async () => {
  await connectDB();
  await fetchComments();
};

startApp();