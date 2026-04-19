# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate + next build
npm run lint         # ESLint via Next.js

npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database (tsx prisma/seed.ts)
npm run db:studio    # Open Prisma Studio GUI
```

No test suite is configured.

## Environment Setup

Copy `.env.example` and populate:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — random secret for JWT signing
- `NEXTAUTH_URL` — base URL (e.g. `http://localhost:3000`)
- `ANTHROPIC_API_KEY` — for the playground streaming feature

## Architecture

**Full-stack Next.js 14 App Router** learning platform for Claude/Anthropic API skills.

**Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma (PostgreSQL), NextAuth.js v4, Anthropic SDK, Zustand.

### Route Groups

- `src/app/(auth)/` — Login/register pages (not prefixed in URL)
- `src/app/(dashboard)/` — Protected app pages: courses, quiz, notes, achievements, playground
- `src/app/api/` — REST endpoints; all routes validate session with `getServerSession(authOptions)` and return 401 if unauthenticated

### Content System

Course content is defined in two places:

1. **Metadata** — `src/content/modules.ts` defines the `modules` array with slugs, titles, difficulty, `xpReward`, `quizId`, and `lessons[]`
2. **MDX files** — `src/content/module-**/**.mdx` hold the actual lesson prose, rendered via React Markdown with a custom code block component

Helper functions `getModule()`, `getLesson()`, and navigation helpers live in `src/lib/content.ts` (or similar) and are the canonical way to look up content.

Quiz definitions live in `src/content/quizzes/`.

### Gamification

- **XP**: 10 XP per lesson; variable XP for quizzes (full if passed, 30% if failed)
- **Levels**: computed from total XP via `getLevelFromXP()` using thresholds `[0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]`
- **Achievements**: awarded via `checkAndAwardAchievements(userId, context)` in `src/lib/achievements.ts`; slugs include `first-lesson`, `speed-learner`, `streak-3/7/30`, `perfect-quiz`, `module-complete`, `first-playground`, etc.
- **Streaks**: tracked daily via the `StreakDay` model

### Database Models (Prisma)

`User` → `LessonProgress`, `QuizAttempt`, `Bookmark`, `Note`, `StreakDay`, `UserAchievement`, `Certificate`

All user-related rows cascade-delete on User deletion.

### Key Conventions

- **Authentication**: JWT strategy; extend the session user type via `src/types/` to include `id`
- **Server components** by default; add `'use client'` for forms and streaming responses
- **`cn()` helper** for conditional Tailwind class merging
- **Providers** (`SessionProvider`, `ThemeProvider`, `Toaster`) are wrapped in `src/app/providers.tsx` (or layout)
- **Playground** streams Claude responses via the Anthropic SDK in `/api/playground` using `POST` with `{ model, systemPrompt, messages }`
- **Path alias**: `@/*` maps to `src/*`
