# EduEcho API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

Currently no authentication required for MVP. All endpoints are publicly accessible.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Endpoints

### Users

#### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "type": "QuickLearner",
  "language": "en"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "QuickLearner",
    "points": 0,
    "contributionCount": 0
  }
}
```

#### Get All Users
```http
GET /users?page=1&limit=20&type=QuickLearner&sortBy=points
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `type` (string): Filter by user type
- `sortBy` (string): Sort field (default: createdAt)

**Response:** `200 OK`

#### Get User
```http
GET /users/:id
```

**Response:** `200 OK`

#### Update User
```http
PUT /users/:id
```

**Request Body:** Same as Create User (all fields optional)

**Response:** `200 OK`

#### Delete User
```http
DELETE /users/:id
```

**Response:** `200 OK`

#### Get User Stats
```http
GET /users/:id/stats
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "points": 150,
    "contributionCount": 25,
    "upvotesReceived": 45,
    "notebooksSaved": 10
  }
}
```

---

### Threads

#### Create Thread
```http
POST /threads
```

**Request Body:**
```json
{
  "question": "How do B+ Trees work?",
  "description": "I need a detailed explanation...",
  "tags": ["database", "data-structures"],
  "subject": "Computer Science",
  "userId": "USER_ID",
  "language": "en"
}
```

**Response:** `201 Created`

#### Get All Threads
```http
GET /threads?page=1&limit=20&subject=Math&tags=algebra&sortBy=upvotes&order=desc
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `subject`: Filter by subject
- `tags`: Filter by tags (can be array)
- `sortBy`: createdAt, upvotes, viewCount, replyCount
- `order`: asc, desc

**Response:** `200 OK` with pagination

#### Get Thread
```http
GET /threads/:id
```

**Response:** `200 OK`
- Automatically increments view count
- Populates user data

#### Search Threads
```http
GET /threads/search?q=binary+trees
```

**Response:** `200 OK`
- Full-text search on question, description, tags

#### Get Trending Threads
```http
GET /threads/trending?limit=10
```

**Response:** `200 OK`

#### Upvote Thread
```http
POST /threads/:id/upvote
```

**Response:** `200 OK`

---

### Replies

#### Create Text Reply
```http
POST /replies
```

**Request Body:**
```json
{
  "threadId": "THREAD_ID",
  "userId": "USER_ID",
  "text": "Here's my explanation...",
  "language": "en"
}
```

**Response:** `201 Created`
- Triggers background AI processing
- Awards 3 points to user

#### Get Replies by Thread
```http
GET /replies/thread/:threadId?sortBy=upvotes&userType=QuickLearner
```

**Query Parameters:**
- `sortBy`: createdAt, upvotes, aiScore.overallScore
- `userType`: QuickLearner, FullMark, Average, Beginner (personalizes ranking)

**Response:** `200 OK`

#### Upvote Reply
```http
POST /replies/:id/upvote
```

**Response:** `200 OK`
- Awards 1 point to reply author

#### Mark Best Answer
```http
POST /replies/:id/best-answer
```

**Response:** `200 OK`
- Unmarks other replies in same thread
- Awards 10 bonus points

---

### AI Services

#### Transcribe Audio
```http
POST /ai/transcribe
Content-Type: multipart/form-data
```

**Form Data:**
- `audio`: Audio file (mp3, wav, ogg, webm, m4a)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transcript": "Transcribed text here..."
  }
}
```

#### Upload Voice Reply
```http
POST /ai/voice-reply
Content-Type: multipart/form-data
```

**Form Data:**
- `audio`: Audio file
- `threadId`: Thread ID
- `userId`: User ID
- `language`: Language code (optional)

**Response:** `201 Created`
- Uploads to Cloudinary
- Transcribes audio
- Creates reply with voice data
- Triggers AI evaluation

#### Generate Summary Audio
```http
POST /ai/summary-audio
```

**Request Body:**
```json
{
  "text": "Text to convert to speech"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "audioUrl": "https://cloudinary.com/..."
  }
}
```

#### Evaluate Text
```http
POST /ai/evaluate
```

**Request Body:**
```json
{
  "text": "Answer text",
  "question": "Original question"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "clarity": 9,
    "relevance": 8,
    "depth": 7,
    "simplicity": 9,
    "confidence": 6,
    "overallScore": 7.8
  }
}
```

#### Generate Summary
```http
POST /ai/summary
```

**Request Body:**
```json
{
  "text": "Long text to summarize",
  "maxLength": 150
}
```

**Response:** `200 OK`

#### Generate Flashcards
```http
POST /ai/flashcards
```

**Request Body:**
```json
{
  "text": "Content to generate flashcards from",
  "count": 5
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "question": "What is X?",
      "answer": "X is..."
    }
  ]
}
```

---

### Notebooks

#### Create Notebook
```http
POST /notebooks
```

**Request Body:**
```json
{
  "userId": "USER_ID",
  "title": "Data Structures Notes",
  "description": "My learning notes",
  "subject": "Computer Science",
  "tags": ["algorithms", "trees"],
  "isPublic": false
}
```

**Response:** `201 Created`

#### Get Public Notebooks
```http
GET /notebooks/public?page=1&subject=Math&sortBy=importCount
```

**Response:** `200 OK`

#### Get User Notebooks
```http
GET /notebooks/user/:userId?page=1&limit=20
```

**Response:** `200 OK`

#### Add Note to Notebook
```http
POST /notebooks/:id/notes
```

**Request Body:**
```json
{
  "content": "Note content here...",
  "sourceType": "reply",
  "sourceId": "REPLY_ID",
  "summary": "Optional summary"
}
```

**Response:** `201 Created`
- Auto-generates summary if not provided
- Stores vector embedding

#### Generate Flashcards for Note
```http
POST /notebooks/:id/notes/:noteId/flashcards
```

**Request Body:**
```json
{
  "count": 5
}
```

**Response:** `200 OK`

#### Import Notebook
```http
POST /notebooks/:id/import
```

**Request Body:**
```json
{
  "userId": "USER_ID"
}
```

**Response:** `201 Created`
- Creates copy for user
- Increments import count
- Awards points

---

### Search

#### Semantic Search
```http
GET /search/semantic?q=how+to+sort+arrays&type=reply&subject=Programming&limit=10
```

**Query Parameters:**
- `q`: Search query (required)
- `type`: thread, reply, notebook, note
- `subject`: Filter by subject
- `limit`: Number of results

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "score": 0.89,
      "type": "reply",
      "content": { ... }
    }
  ]
}
```

#### Search All
```http
GET /search/all?q=binary+search
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "threads": [...],
    "replies": [...],
    "notebooks": [...]
  }
}
```

---

### Leaderboard

#### Get Leaderboard
```http
GET /leaderboard?limit=50&period=week
```

**Query Parameters:**
- `limit`: Number of users (default: 50)
- `period`: all, week, month

**Response:** `200 OK`

#### Get Top Explainers
```http
GET /leaderboard/top-explainers?limit=20
```

**Response:** `200 OK`
- Users with highest average AI scores

#### Get Clarity Champions
```http
GET /leaderboard/clarity-champions?limit=20
```

**Response:** `200 OK`
- Users with highest clarity scores

#### Get Best Voice Explainers
```http
GET /leaderboard/voice-experts?limit=20
```

**Response:** `200 OK`
- Users with best voice explanations

#### Get User Rank
```http
GET /leaderboard/rank/:userId
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "rank": 42,
    "total": 1000,
    "points": 250,
    "percentile": 96
  }
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Client → Server

#### Join Thread
```javascript
socket.emit('join-thread', threadId);
```

#### Leave Thread
```javascript
socket.emit('leave-thread', threadId);
```

### Server → Client

#### New Reply
```javascript
socket.on('new-reply', (data) => {
  // data: { threadId, reply }
});
```

#### Thread Updated
```javascript
socket.on('thread-updated', (data) => {
  // data: { threadId, updates }
});
```

#### Leaderboard Updated
```javascript
socket.on('leaderboard-updated', () => {
  // Refresh leaderboard
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response:** 429 with retry-after header

---

## File Upload Limits

- **Max Size:** 10MB
- **Allowed Formats:** mp3, wav, ogg, webm, m4a
- **Upload Type:** multipart/form-data

---

## Pagination

Default pagination format:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Best Practices

1. **Error Handling:** Always check `success` field
2. **Pagination:** Use pagination for large datasets
3. **Rate Limits:** Implement exponential backoff
4. **File Uploads:** Validate on client before upload
5. **Real-time:** Use Socket.IO for live features
6. **Search:** Use semantic search for better results
