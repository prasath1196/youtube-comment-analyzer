import { getSentiment } from './openAIService.js';
import { fetchCommentsFromDB, updateCommentSentiment, getSentimentFromDB } from './db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Function to extract video ID from YouTube URL
const extractVideoId = (url) => {
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (!videoId) {
            throw new Error('No video ID found in URL');
        }
        return videoId;
    } catch (error) {
        throw new Error('Invalid YouTube URL format');
    }
};

// Handle both the API routes and serve the React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        console.log('Analyzing video:', videoId);

        const comments = await fetchCommentsFromDB(videoId);
        console.log(`Processing ${comments.length} comments`);

        const sentiments = {
            positive: 0,
            negative: 0,
            neutral: 0,
            curious: 0
        };

        // Analyze only the first 20 comments
        const commentsToAnalyze = comments.slice(0, 20);
        let analyzedCount = 0;
        
        // Analyze sentiments for comments
        for (const comment of commentsToAnalyze) {
            try {
                // First check if we already have the sentiment
                let sentiment = await getSentimentFromDB(comment.commentId);
                
                if (!sentiment) {
                    // Only call OpenAI if we don't have the sentiment
                    console.log(`No cached sentiment for ${comment.commentId}, calling OpenAI...`);
                    sentiment = await getSentiment(comment.text);
                    await updateCommentSentiment(comment.commentId, sentiment);
                } else {
                    console.log(`Using cached sentiment for ${comment.commentId}: ${sentiment}`);
                }
                
                // Only count valid sentiments
                if (['positive', 'negative', 'neutral', 'curious'].includes(sentiment)) {
                    sentiments[sentiment]++;
                    analyzedCount++;
                } else {
                    console.warn(`Unexpected sentiment value: ${sentiment}`);
                }
            } catch (error) {
                console.error('Error analyzing comment:', comment.commentId, error);
                // Continue with other comments even if one fails
                continue;
            }
        }

        // Calculate percentages only if we have analyzed comments
        if (analyzedCount === 0) {
            throw new Error('No comments were successfully analyzed');
        }

        const result = {
            positive: ((sentiments.positive / analyzedCount) * 100).toFixed(1),
            negative: ((sentiments.negative / analyzedCount) * 100).toFixed(1),
            neutral: ((sentiments.neutral / analyzedCount) * 100).toFixed(1),
            totalComments: analyzedCount
        };

        console.log('Analysis results:', result);
        res.json(result);
    } catch (error) {
        console.error('Error analyzing comments:', error);
        res.status(500).json({ 
            error: 'Failed to analyze comments',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});