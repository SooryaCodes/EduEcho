# EduEcho Server Implementation Guide

## Architecture Overview

The EduEcho backend follows a modular, service-oriented architecture designed for scalability and maintainability.

### Architecture Layers

```
┌─────────────────────────────────────┐
│         Client/Frontend             │
└──────────────┬──────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────┐
│      Express Application            │
│  ┌─────────────────────────────┐   │
│  │  Routes (API Endpoints)     │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Controllers (Logic)        │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│  ┌──────────▼──────────────────┐   │
│  │  Services (Business Logic)  │   │
│  └──────────┬──────────────────┘   │
└─────────────┼───────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐      ┌───────▼──────┐
│MongoDB │      │ External APIs │
│ Atlas  │      │ • OpenAI      │
└────────┘      │ • Pinecone    │
                │ • Cloudinary  │
                └───────────────┘
```

## Core Design Patterns

### 1. Service Layer Pattern

All business logic is encapsulated in service classes:

```typescript
// services/aiService.ts
class AIService {
  async transcribeAudio(buffer: Buffer): Promise<string>
  async evaluateReply(text: string): Promise<AIScore>
  async generateSummary(text: string): Promise<string>
}
```

**Benefits:**
- Reusable across controllers
- Easy to test in isolation
- Centralized AI logic
- Consistent error handling

### 2. Controller Pattern

Controllers handle HTTP requests and responses:

```typescript
// controllers/replyController.ts
export const createReply = asyncHandler(async (req, res) => {
  // 1. Validate input
  // 2. Call service methods
  // 3. Return response
});
```

**Responsibilities:**
- Request/response handling
- Input validation
- Calling appropriate services
- HTTP status codes

### 3. Middleware Chain

Request processing pipeline:

```
Request → Rate Limit → CORS → Body Parse → Route Handler → Error Handler
```

### 4. Async Background Processing

Heavy AI operations run asynchronously:

```typescript
// Create reply immediately
const reply = await Reply.create(data);
res.status(201).json({ data: reply });

// Process AI in background (don't await)
processReplyWithAI(reply._id, text);
```

**Why?**
- Fast response times (<200ms)
- Better user experience
- Handles AI API delays gracefully

## Database Design

### Schema Relationships

```
User (1) ─────── (N) Thread
  │                    │
  │                    │
  │              (1) ──┴── (N) Reply
  │                           │
  │                           │
  └─ (1) ─────── (N) Notebook
                       │
                       │
                 (1) ──┴── (N) Note
```

### Indexing Strategy

**User Model:**
```javascript
email: { unique: true, index: true }
points: { index: -1 }  // Leaderboard queries
type: { index: 1 }     // User type filtering
```

**Thread Model:**
```javascript
{ subject: 1, createdAt: -1 }  // Compound index
{ isPinned: -1, createdAt: -1 } // Priority sorting
{ question: 'text', description: 'text' }  // Full-text search
```

**Reply Model:**
```javascript
{ threadId: 1, createdAt: -1 }  // Thread replies
{ 'aiScore.overallScore': -1 }  // Quality ranking
```

### Query Optimization

1. **Populate selectively:**
```typescript
.populate('userId', 'name avatar type')  // Only needed fields
```

2. **Lean queries for read-only:**
```typescript
Thread.find().lean()  // Returns plain JS objects
```

3. **Aggregation for complex queries:**
```typescript
Reply.aggregate([
  { $match: { isVoiceReply: true } },
  { $group: { _id: '$userId', avgScore: { $avg: '$aiScore.overallScore' } } },
  { $sort: { avgScore: -1 } }
])
```

## AI Integration Architecture

### 1. Transcription Pipeline

```
Audio Upload → Cloudinary → Whisper API → Transcript → Database
                                              ↓
                                        Vector Embedding
                                              ↓
                                          Pinecone
```

### 2. Evaluation Pipeline

```
Reply Text → GPT-4 Evaluation → AI Scores → Database
                ↓
          Summary Generation → Short Summary → Database
                                     ↓
                                TTS Audio → Cloudinary
```

### 3. Semantic Search Flow

```
User Query → Generate Embedding → Pinecone Search → Vector IDs
                                        ↓
                                MongoDB Lookup → Full Content
```

## Real-time Architecture

### WebSocket Event Flow

```javascript
// Server emits to specific thread room
io.to(`thread-${threadId}`).emit('new-reply', replyData);

// Client joins thread room
socket.emit('join-thread', threadId);

// Client receives updates
socket.on('new-reply', (data) => {
  // Update UI
});
```

### Room Management

Each thread has its own room:
- Users join when viewing thread
- Updates broadcast only to room members
- Automatic cleanup on disconnect

## Error Handling Strategy

### Error Types

1. **Operational Errors** (expected, handled gracefully)
   - Invalid input
   - Resource not found
   - Rate limit exceeded

2. **Programming Errors** (bugs, logged)
   - Type errors
   - Null references
   - Logic errors

### Error Flow

```typescript
try {
  // Operation
} catch (error) {
  if (isOperational(error)) {
    return next(new AppError(message, statusCode));
  } else {
    console.error('Programming error:', error);
    return next(new AppError('Internal server error', 500));
  }
}
```

### Global Error Handler

```typescript
app.use((err, req, res, next) => {
  // Log error
  // Send appropriate response
  // In dev: include stack trace
  // In prod: generic message
});
```

## Security Implementation

### 1. Input Validation

Using Joi schemas:
```typescript
const threadSchema = Joi.object({
  question: Joi.string().min(10).max(500).required(),
  tags: Joi.array().items(Joi.string()).max(5)
});
```

### 2. Rate Limiting

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
});
```

### 3. Security Headers

Using Helmet:
- XSS Protection
- Content Security Policy
- HSTS
- No Sniff
- Frame Guard

### 4. CORS Configuration

```typescript
cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
})
```

### 5. File Upload Security

- Type validation (audio only)
- Size limits (10MB)
- Secure storage (Cloudinary)
- Unique filenames (UUID)

## Performance Optimizations

### 1. Response Compression

```typescript
app.use(compression());
```

### 2. Database Connection Pooling

Mongoose handles automatically with default settings.

### 3. Async Processing

Heavy operations (AI, uploads) run in background:
```typescript
// Don't await - fire and forget
processReplyWithAI(replyId, text);
```

### 4. Selective Population

Only populate fields you need:
```typescript
.populate('userId', 'name avatar')  // Not entire user object
```

### 5. Caching Strategy (Future)

Recommended for production:
- Redis for session data
- Cache frequent queries (leaderboard)
- Cache AI responses (common questions)

## Testing Strategy

### Unit Tests
Test individual functions:
```typescript
describe('AIService', () => {
  it('should evaluate reply correctly', async () => {
    const score = await aiService.evaluateReply(text, question);
    expect(score.overallScore).toBeGreaterThan(0);
  });
});
```

### Integration Tests
Test API endpoints:
```typescript
describe('POST /api/v1/replies', () => {
  it('should create reply and award points', async () => {
    const res = await request(app)
      .post('/api/v1/replies')
      .send(replyData);
    expect(res.status).toBe(201);
  });
});
```

### Load Testing
Use tools like Artillery or k6:
```yaml
scenarios:
  - duration: 60
    arrivalRate: 10
    target: '/api/v1/threads'
```

## Deployment Considerations

### Environment Variables

Critical settings:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
```

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB indexes
- [ ] Create Pinecone index
- [ ] Configure Cloudinary
- [ ] Set rate limits appropriately
- [ ] Enable logging (Winston/Bunyan)
- [ ] Set up error tracking (Sentry)
- [ ] Configure health checks
- [ ] Set up monitoring (PM2, New Relic)

### Scaling Strategy

**Horizontal Scaling:**
- Multiple server instances
- Load balancer (Nginx, AWS ELB)
- Sticky sessions for Socket.IO

**Database Scaling:**
- MongoDB replica sets
- Read replicas for queries
- Sharding for large datasets

**Caching Layer:**
- Redis for sessions
- CDN for static assets (Cloudinary)
- Cache AI responses

## Monitoring & Logging

### Log Levels

```typescript
console.log('✅ Success operations');
console.warn('⚠️  Warnings');
console.error('❌ Errors');
```

### Metrics to Track

- Request rate
- Response times
- Error rates
- AI API usage
- Database query times
- Memory usage
- CPU usage

### Health Checks

```typescript
GET /health
{
  "success": true,
  "services": {
    "database": "connected",
    "openai": "available",
    "pinecone": "ready"
  }
}
```

## Code Organization

### File Structure

```
src/
├── config/          # External service configs
│   ├── database.ts
│   ├── openai.ts
│   ├── pinecone.ts
│   └── cloudinary.ts
├── models/          # Mongoose schemas
│   ├── User.ts
│   ├── Thread.ts
│   └── Reply.ts
├── controllers/     # Request handlers
│   ├── userController.ts
│   └── threadController.ts
├── routes/          # Route definitions
│   ├── userRoutes.ts
│   └── threadRoutes.ts
├── services/        # Business logic
│   ├── aiService.ts
│   ├── vectorService.ts
│   └── cloudinaryService.ts
├── middleware/      # Express middleware
│   ├── errorHandler.ts
│   ├── validation.ts
│   └── upload.ts
└── index.ts         # App entry point
```

### Naming Conventions

- **Files:** camelCase.ts
- **Classes:** PascalCase
- **Functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Interfaces:** IPascalCase

## Best Practices

### 1. Always Use TypeScript Types

```typescript
interface CreateThreadDTO {
  question: string;
  userId: string;
  tags?: string[];
}
```

### 2. Error Handling

```typescript
// Always wrap async functions
export const handler = asyncHandler(async (req, res) => {
  // Your code
});
```

### 3. Validation

```typescript
// Validate before processing
app.post('/resource', validate(schema), controller);
```

### 4. Consistent Responses

```typescript
// Success
res.json({ success: true, data: result });

// Error
throw new AppError('Message', statusCode);
```

### 5. Background Processing

```typescript
// Don't make users wait for AI
createReply().then(() => {
  processWithAI();  // Fire and forget
});
```

## Troubleshooting

### Common Issues

**1. MongoDB Connection Fails**
- Check MONGODB_URI format
- Verify IP whitelist
- Check network connectivity

**2. OpenAI API Errors**
- Verify API key
- Check billing status
- Implement retry logic

**3. Pinecone Issues**
- Ensure index exists
- Verify dimensions match (1536)
- Check index status

**4. Memory Leaks**
- Close database connections
- Remove event listeners
- Clear timers

## Future Enhancements

1. **Authentication & Authorization**
   - JWT tokens
   - Role-based access
   - OAuth providers

2. **Advanced Features**
   - Notification system
   - Email integration
   - Content moderation
   - Analytics dashboard

3. **Performance**
   - Redis caching
   - GraphQL API
   - Query optimization
   - CDN integration

4. **DevOps**
   - Docker containers
   - CI/CD pipeline
   - Automated testing
   - Blue-green deployment
