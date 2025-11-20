# EKOS — Enterprise Knowledge OS

A modern, AI-powered enterprise knowledge management system built with React, TypeScript, Vite, and Supabase.

## Features

- 🔍 **Intelligent Search** - Full-text search across all your documents and data
- 📸 **Screenshot Search** - OCR-powered screenshot search and management
- 📅 **Timeline View** - Visual timeline of all your activities
- 🕸️ **Knowledge Graph** - Visualize connections between your data
- 🎥 **Meeting Management** - Store and search meeting transcripts
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📱 **Responsive Design** - Beautiful UI built with shadcn/ui and TailwindCSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query + Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ekos/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   
   Quick steps:
   - Create a new Supabase project
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to `.env`
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, AppLayout)
│   └── ui/             # shadcn/ui components
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication context
├── lib/                # Utility functions and helpers
│   ├── hooks/          # Custom React hooks
│   ├── state/          # State management
│   ├── supabase.ts     # Supabase client
│   ├── supabase-types.ts # TypeScript types for database
│   └── db-helpers.ts   # Database helper functions
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── ScreenshotSearch.tsx
│   ├── Timeline.tsx
│   ├── KnowledgeGraph.tsx
│   ├── Meetings.tsx
│   ├── Admin.tsx
│   └── Login.tsx
├── router/             # React Router configuration
└── styles/             # Global styles

supabase/
└── schema.sql          # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.example` for a template.

## Authentication

The app uses Supabase Authentication with the following features:

- Email/password authentication
- Protected routes
- Automatic session management
- Sign out functionality

## Database

The application uses Supabase (PostgreSQL) with the following tables:

- **profiles** - User profiles
- **documents** - Document storage and metadata
- **screenshots** - Screenshot metadata and OCR text
- **meetings** - Meeting transcripts and recordings
- **timeline_events** - Activity timeline
- **nodes** & **edges** - Knowledge graph data

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Custom Hooks

The app includes several custom React Query hooks for data fetching:

- `useDocuments()` - Fetch user documents
- `useScreenshots()` - Fetch screenshots
- `useMeetings()` - Fetch meetings
- `useTimeline()` - Fetch timeline events
- `useKnowledgeGraph()` - Fetch knowledge graph data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or refer to the [Supabase Setup Guide](./SUPABASE_SETUP.md).

