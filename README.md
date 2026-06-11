# Employee Journey AI Dashboard

A pnpm workspace monorepo prototype for an AI-powered employee journey dashboard inspired by modern HCM workflows.

## Apps

- **apps/frontend** — React + TypeScript + Vite + Tailwind CSS manager dashboard
- **apps/backend** — Express + TypeScript mock API with AI-powered employee journey insights

## Highlights

- Team overview with onboarding, learning, workflow, and risk visibility
- Detailed employee journey page with onboarding, learning, workflow, and performance views
- AI summaries, manager recommendations, and natural language Q&A
- Smart mock AI responses that work without an OpenAI API key

## Getting started

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

To enable OpenAI responses, set `OPENAI_API_KEY` in `apps/backend/.env`.
