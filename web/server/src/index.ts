import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { connectDatabase } from './config/database';
import { initializePinecone } from './config/pinecone';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import userRoutes from './routes/userRoutes';
import threadRoutes from './routes/threadRoutes';
import replyRoutes from './routes/replyRoutes';
import notebookRoutes from './routes/notebookRoutes';
import searchRoutes from './routes/searchRoutes';
import aiRoutes from './routes/aiRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduEcho API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/replies', replyRoutes);
app.use('/api/v1/notebooks', notebookRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Join thread room
  socket.on('join-thread', (threadId: string) => {
    socket.join(`thread-${threadId}`);
    console.log(`User ${socket.id} joined thread ${threadId}`);
  });

  // Leave thread room
  socket.on('leave-thread', (threadId: string) => {
    socket.leave(`thread-${threadId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Verify environment variables
    console.log('🔍 Checking environment variables...');
    const requiredEnvVars = ['MONGODB_URI'];
    const optionalEnvVars = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'CLOUDINARY_CLOUD_NAME'];
    
    const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingRequired.length > 0) {
      throw new Error(`Missing required environment variables: ${missingRequired.join(', ')}`);
    }
    
    const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);
    if (missingOptional.length > 0) {
      console.warn(`⚠️  Missing optional environment variables: ${missingOptional.join(', ')}`);
      console.warn('   Some features may not work without these variables.\n');
    }

    // Connect to database
    try {
      await connectDatabase();
    } catch (error) {
      console.error('⚠️  Failed to connect to MongoDB. Please check the error above.');
      console.error('   The server will exit now. Fix the database connection and try again.\n');
      process.exit(1);
    }

    // Initialize Pinecone (optional service)
    try {
      await initializePinecone();
    } catch (error) {
      console.warn('⚠️  Pinecone initialization failed. Semantic search will not work.');
      console.warn('   The server will continue to run with limited functionality.\n');
    }

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 ===============================================`);
      console.log(`   Server running successfully on port ${PORT}`);
      console.log(`   ===============================================`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`🌐 CORS: ${process.env.NODE_ENV === 'production' ? 'Restricted to allowed origins' : 'Allowing all origins (dev mode)'}`);
      console.log(`\n✅ Services Status:`);
      console.log(`   - MongoDB: Connected`);
      console.log(`   - OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
      console.log(`   - Pinecone: ${process.env.PINECONE_API_KEY ? 'Configured' : 'Not configured'}`);
      console.log(`   - Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
      console.log(`\n💡 Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:', error);
    console.error('   Please fix the errors above and try again.\n');
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});

export { io };

