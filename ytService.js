import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const fetchCommentsFromYT = async (videoId) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ['snippet'],
      videoId: videoId,
      maxResults: 20,
    });
    
    if (!response.data.items) {
      throw new Error('No comments found');
    }

    const comments = response.data.items.map(item => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      videoId: videoId,
      commentId: item.snippet.topLevelComment.id,
    }));
    
    return comments;
  } catch (err) {
    console.error('Error fetching comments:', err);
    throw new Error(`Failed to fetch comments: ${err.message}`);
  }
};

export { fetchCommentsFromYT };