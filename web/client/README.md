# EduEcho Client

Modern, responsive web application for the EduEcho AI-Powered Adaptive Peer Learning Platform.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **API Client:** Axios
- **Real-time:** Socket.IO Client

## Prerequisites

- Node.js 18+ and npm
- Running backend server (see `/server/README.md`)

## Getting Started

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Configuration

Create `.env.local` in the client directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
client/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home dashboard
│   ├── threads/             # Thread pages
│   │   ├── page.tsx         # Thread list
│   │   ├── [id]/            # Thread detail
│   │   └── new/             # Create thread
│   ├── notebooks/           # Notebook pages
│   ├── leaderboard/         # Leaderboard page
│   ├── search/              # Search results
│   └── users/               # User profiles
├── components/
│   ├── ui/                  # shadcn components (35+)
│   ├── thread/              # Thread-specific components
│   │   ├── ThreadCard.tsx
│   │   ├── ReplyCard.tsx
│   │   ├── VoiceRecorder.tsx
│   │   └── AIScoreBadge.tsx
│   ├── notebook/            # Notebook components
│   │   ├── NotebookCard.tsx
│   │   ├── NoteEditor.tsx
│   │   └── FlashcardView.tsx
│   ├── leaderboard/         # Leaderboard components
│   │   └── LeaderboardTable.tsx
│   └── shared/              # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── SearchBar.tsx
│       └── UserAvatar.tsx
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── api.ts               # API client setup
│   ├── socket.ts            # Socket.IO client
│   └── cn.ts                # Class name helper
├── hooks/                   # Custom React hooks
│   ├── use-threads.ts
│   ├── use-replies.ts
│   ├── use-notebooks.ts
│   ├── use-socket.ts
│   └── use-media-recorder.ts
├── stores/                  # Zustand state stores
│   ├── user-store.ts
│   ├── thread-store.ts
│   └── notebook-store.ts
├── types/                   # TypeScript type definitions
│   ├── thread.ts
│   ├── reply.ts
│   ├── user.ts
│   └── notebook.ts
└── public/                  # Static assets
    ├── images/
    └── icons/
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler check
```

## UI Components

### Core Components Used

All 35+ shadcn components are integrated. Key components:

**Navigation:**
- Navigation Menu - Main navbar
- Sidebar - Mobile drawer
- Breadcrumb - Page navigation

**Content:**
- Card - Primary content container
- Avatar - User images
- Badge - Status indicators
- Tabs - View switcher

**Forms:**
- Input, Textarea - Text inputs
- Select - Dropdowns
- Checkbox, Radio - Selections
- Switch, Slider - Controls

**Feedback:**
- Sonner (Toast) - Notifications
- Dialog - Modals
- Alert - Messages
- Skeleton - Loading states

**Advanced:**
- Command - Search palette (⌘K)
- Table - Data display
- Calendar - Date selection
- Carousel - Content showcase

See [COMPONENTS.md](./COMPONENTS.md) for detailed component documentation.

## Features

### 1. Thread System
- Browse threads by subject/tags
- View questions with voice/text replies
- AI score visualization
- Upvote/downvote functionality
- Real-time reply updates

### 2. Voice Integration
- Record voice replies
- Play voice explanations
- AI-generated summaries
- Text-to-speech playback

### 3. Notebooks
- Create personal notebooks
- Save replies to notebooks
- AI flashcard generation
- Import public notebooks
- Study mode with flashcards

### 4. Leaderboard
- Overall rankings
- Top explainers
- Clarity champions
- Voice experts
- Filter by time period

### 5. Search
- Semantic AI-powered search
- Filter by type/subject
- Real-time suggestions
- Search history

### 6. User Profiles
- View user statistics
- Contribution history
- Points and achievements
- Learning preferences

## Styling

### Tailwind Configuration

Custom theme in `tailwind.config.js`:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Dark mode support

### Global Styles

Located in `app/globals.css`:
- CSS variables for theming
- Custom scrollbar styles
- Animation keyframes
- Utility classes

## State Management

### Zustand Stores

**User Store:**
```typescript
- currentUser
- setUser
- updatePreferences
```

**Thread Store:**
```typescript
- threads
- fetchThreads
- createThread
- updateThread
```

**Notebook Store:**
```typescript
- notebooks
- addNote
- generateFlashcards
```

## API Integration

### API Client (`lib/api.ts`)

```typescript
import api from '@/lib/api';

// Threads
await api.get('/threads');
await api.post('/threads', threadData);

// Replies
await api.get(`/replies/thread/${threadId}`);
await api.post('/replies', replyData);

// AI
await api.post('/ai/transcribe', formData);
```

### Error Handling

```typescript
try {
  const response = await api.get('/threads');
} catch (error) {
  // Handle error with toast notification
  toast.error(error.message);
}
```

## WebSocket Integration

### Real-time Updates

```typescript
import { useSocket } from '@/hooks/use-socket';

const { socket, connected } = useSocket();

// Join thread
socket.emit('join-thread', threadId);

// Listen for updates
socket.on('new-reply', (reply) => {
  // Update UI
});
```

## Forms & Validation

### Using React Hook Form + Zod

```typescript
const schema = z.object({
  question: z.string().min(10).max(500),
  subject: z.string().min(1),
  tags: z.array(z.string()).max(5),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## Responsive Design

### Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile-First Approach

```tsx
<div className="flex flex-col md:flex-row lg:gap-6">
  {/* Stacks on mobile, row on tablet+ */}
</div>
```

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance

## Performance Optimization

- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Lazy loading components
- Memoization with React.memo
- Virtual scrolling for long lists
- Debounced search inputs

## Testing

### Unit Tests (Planned)
```bash
npm run test
```

### E2E Tests (Planned)
```bash
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
# Deploy /out directory to hosting
```

## Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Follow existing code style
2. Use TypeScript types
3. Write accessible components
4. Test responsive design
5. Update documentation

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### API Connection Issues
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check CORS configuration in backend

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

## License

MIT
