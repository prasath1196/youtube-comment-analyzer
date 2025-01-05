# YouTube Comment Analyzer

A powerful web application that analyzes YouTube video comments using AI to determine sentiment and provide insights. The application uses OpenAI's GPT model to analyze comments and categorize them into different sentiment categories.

## Features

- 🎥 Fetch comments from YouTube videos
- 🤖 AI-powered sentiment analysis using GPT-4
- 📊 Categorizes comments into: positive, negative, neutral, or curious
- 💾 Caches results in MongoDB for future reference
- ⚡ Real-time analysis of comments
- 🎨 Modern React-based UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

You'll also need:
- YouTube Data API key
- OpenAI API key
- MongoDB URI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/prasath1196/youtube-comment-analyzer.git
cd youtube-comment-analyzer
```

2. Install dependencies for both server and client:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Create a `.env` file in the root directory with the following variables:
```env
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_uri
MONGO_DB=your_database_name
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. In a separate terminal, start the client:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
youtube-comment-analyzer/
├── client/                 # Frontend React application
│   ├── src/               # React source files
│   ├── dist/              # Built files
│   └── package.json       # Client dependencies
├── server.js              # Express server setup
├── db.js                  # MongoDB connection and operations
├── openAIService.js       # OpenAI integration
├── ytService.js           # YouTube API integration
└── package.json           # Server dependencies
```

## API Endpoints

- `GET /`: Serves the frontend application
- `GET /api/analyze`: Analyzes comments for a given video

## Technology Stack

- **Backend:**
  - Node.js
  - Express
  - MongoDB (with Mongoose)
  - OpenAI API
  - YouTube Data API

- **Frontend:**
  - React
  - Tailwind CSS
  - Parcel (bundler)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- YouTube Data API for comment access
- MongoDB for database services

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
