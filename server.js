import { getSentiment } from './openAIService.js';
import { fetchCommentsFromDB } from './db.js';
const startApp = async () => {
  const comments = await fetchCommentsFromDB('UWvebURU9Kk');
  for (let i = 0; i < 10; i++) {
    const sentiment = await getSentiment(comments[i].text);
    console.log(sentiment);
    console.log(sentiment.sentiment);
  }
};

startApp();