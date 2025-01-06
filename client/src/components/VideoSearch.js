import React, { useState } from "react";

const VideoSearch = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [sentimentData, setSentimentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeSentiment = async () => {
        if (!videoUrl) {
            setError("Please enter a YouTube video URL");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoUrl })
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message || data.error);
            }
            setSentimentData(data);
        } catch (err) {
            setError(err.message || "Failed to analyze video comments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    YouTube Comment Sentiment Analyzer
                </h1>
                
                <div className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=RDoVLHaYfgM)"
                        />
                        <button
                            onClick={analyzeSentiment}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                        >
                            {loading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                    {error && (
                        <p className="mt-2 text-red-600 text-sm">{error}</p>
                    )}
                </div>

                {sentimentData && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-center text-gray-700">
                            Sentiment Analysis Results
                        </h2>
                        <p className="text-center text-gray-600 mb-4">
                            Based on analysis of {sentimentData.totalComments} most recent comments
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-green-100 p-4 rounded-lg">
                                <p className="text-green-800 font-semibold">Positive</p>
                                <p className="text-2xl font-bold text-green-600">{sentimentData.positive}%</p>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg">
                                <p className="text-red-800 font-semibold">Negative</p>
                                <p className="text-2xl font-bold text-red-600">{sentimentData.negative}%</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <p className="text-blue-800 font-semibold">Neutral</p>
                                <p className="text-2xl font-bold text-blue-600">{sentimentData.neutral}%</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoSearch;