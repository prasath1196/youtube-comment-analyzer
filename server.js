import { getSentiment } from './openAIService.js';
import { fetchCommentsFromDB, updateCommentSentiment } from './db.js';

import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/analyze', async (req, res) => {
  const comments = await fetchCommentsFromDB('RDoVLHaYfgM');
  for (let i = 0; i < 10; i++) {
    const sentiment = await getSentiment(comments[i].text);
    updateCommentSentiment(comments[i].commentId, sentiment);
  }
  res.send('Comments analyzed');)

const startApp = async () => {
  const comments = await fetchCommentsFromDB('RDoVLHaYfgM');
  for (let i = 0; i < 10; i++) {
    const sentiment = await getSentiment(comments[i].text);
    updateCommentSentiment(comments[i].commentId, sentiment);
  }
};

startApp();