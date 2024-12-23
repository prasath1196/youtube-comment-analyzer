import { google } from 'googleapis'; 

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDyIdtshUQhy4U2Ppu6gB_MFlv61wHD7HI',
});



const fetchCommentsFromYT = async (videoId) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ['snippet'],
      videoId: videoId,
      maxResults: 100,
    });
    
    const comments = response.data.items.map(item => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      videoId: item.snippet.topLevelComment.snippet.videoId,
      commentId: item.snippet.topLevelComment.id,
    }));
    return comments;
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};

export { fetchCommentsFromYT };