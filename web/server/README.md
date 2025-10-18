# EduEcho Server

Backend API server for the EduEcho AI-Powered Adaptive Peer Learning Platform.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **AI Services:** OpenAI (GPT-4, Whisper, Embeddings, TTS)
- **Vector Database:** Pinecone
- **File Storage:** Cloudinary
- **Real-time:** Socket.IO
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- OpenAI API key
- Pinecone account
- Cloudinary account

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory (copy from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduecho

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=eduecho-embeddings

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Set Up MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Set up database user credentials
4. Whitelist your IP address (or allow all: 0.0.0.0/0)
5. Get your connection string and add to `.env`

### 4. Set Up OpenAI

1. Create an account at https://platform.openai.com
2. Generate an API key from the API keys section
3. Add to `.env` as `OPENAI_API_KEY`
4. Ensure you have credits/billing set up

### 5. Set Up Pinecone

1. Create account at https://www.pinecone.io
2. Create a new index:
   - Name: `eduecho-embeddings`
   - Dimensions: `1536`
   - Metric: `cosine`
3. Get your API key and environment
4. Add to `.env`

### 6. Set Up Cloudinary

1. Create account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from dashboard
3. Add to `.env`

## Running the Server

### Development Mode

```bash
npm run dev
```

Server will run on http://localhost:5000 with hot reload.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API documentation.

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts
│   │   ├── openai.ts
│   │   ├── cloudinary.ts
│   │   └── pinecone.ts
│   ├── models/          # MongoDB schemas
│   │   ├── User.ts
│   │   ├── Thread.ts
│   │   ├── Reply.ts
│   │   ├── Notebook.ts
│   │   └── Embedding.ts
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── aiService.ts
│   │   ├── vectorService.ts
│   │   └── cloudinaryService.ts
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── upload.ts
│   └── index.ts         # Server entry point
├── package.json
├── tsconfig.json
└── .env
```

## Features

- ✅ RESTful API with Express
- ✅ MongoDB integration with Mongoose
- ✅ OpenAI Whisper for voice transcription
- ✅ GPT-4 for content evaluation and summarization
- ✅ Semantic search with Pinecone
- ✅ Real-time updates with Socket.IO
- ✅ File uploads with Cloudinary
- ✅ Request validation with Joi
- ✅ Error handling and logging
- ✅ Rate limiting and security
- ✅ TypeScript for type safety

## Health Check

Once running, check server health:

```bash
curl http://localhost:5000/health
```

## WebSocket Events

### Client → Server
- `join-thread` - Join a thread room for real-time updates
- `leave-thread` - Leave a thread room

### Server → Client
- `new-reply` - New reply added to thread
- `thread-updated` - Thread metadata updated
- `leaderboard-updated` - Leaderboard changed

## Deployment

### Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables in Railway dashboard
5. Deploy: `railway up`

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables in dashboard

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### OpenAI API Errors
- Verify API key is correct
- Check billing status
- Ensure sufficient credits

### Pinecone Issues
- Verify index exists with correct dimensions
- Check API key and environment
- Ensure index is ready (not initializing)

### Cloudinary Upload Failures
- Verify credentials
- Check file size limits
- Ensure proper file format

## Support

For issues and questions, see [IMPLEMENTATION.md](./IMPLEMENTATION.md) for architecture details.

## License

MIT

