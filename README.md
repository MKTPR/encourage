# Encourage

A personal journaling web app that helps you reflect on your day and build healthier thought patterns through structured reflection.

## Features

### Current (MVP)
- Create journal entries
- View list of past entries (newest first)
- View entry details
- Generate AI-assisted reflections (mocked for now)
- Reflections persist locally after refresh

### Coming Soon
- Real LLM integration (OpenAI)
- Basic safety guardrails and crisis resources
- Eval harness for reflection quality

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Storage**: localStorage (MVP), Postgres/Supabase planned

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd encourage

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env.local
```

The app runs with defaults (mock AI provider). No API keys required for local development.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Manual Test Checklist

Use this checklist to verify the app works correctly:

- [ ] **Create entry**: Navigate to `/new`, write content, submit
- [ ] **List shows newest-first**: Home page displays entries with most recent at top
- [ ] **Entry detail**: Click an entry to view full content on `/entry/[id]`
- [ ] **Generate reflection**: Click "Generate Reflection" button on entry detail page
- [ ] **Reflection displays**: All 4 fields shown (emotion, core thought, reframe, one action)
- [ ] **Refresh persists entry**: Reload page, entry still appears in list
- [ ] **Refresh persists reflection**: Reload entry detail page, reflection still visible

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/reflect/     # Reflection API endpoint
│   ├── entry/[id]/      # Entry detail page
│   ├── new/             # New entry page
│   └── page.tsx         # Home (entry list)
├── components/          # Reusable UI components
└── lib/                 # Core logic
    ├── env.ts           # Environment config
    ├── hooks.ts         # React hooks
    ├── llm.ts           # LLM provider (mock/real)
    ├── reflectionSchema.ts  # Zod schema for reflections
    ├── store.ts         # localStorage persistence
    └── types.ts         # TypeScript types
```

## License

Private project.
