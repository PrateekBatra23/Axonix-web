# Axonix

**AI intelligence, delivered daily.**

Axonix is a daily AI news platform that aggregates and summarizes the latest developments in AI — models, research, tooling, and industry moves — into a clean, digestible daily briefing. Built for engineers, architects, and AI practitioners who want signal, not noise.

🔗 Live: [axonix.prateekbatra.dev](https://axonix.prateekbatra.dev)

---

## What it does

Axonix publishes a daily digest of the most important AI news, broken down into individual stories that can be browsed by date, topic, or company. Coverage spans model releases, research, tooling, and industry moves from major AI labs and companies — OpenAI, Google, Anthropic, Microsoft, NVIDIA, Meta, Mistral AI, Hugging Face, and Apple.

An AI jobs board is planned as a future addition.

---

## How it works

The project is split across three repositories:

- **Pipeline** — gathers the day's AI news and produces summaries using the Claude API
- **Backend** — a FastAPI service that stores and serves digests and stories
- **Frontend** (this repo) — a Next.js site that renders the digests, stories, topics, and company pages

The frontend is server-rendered throughout, fetching data from the backend API at request time.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), JavaScript |
| Styling | Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| Backend hosting | Railway |
| Frontend hosting | Vercel |
| Summarization | Claude API |

---

## Getting started

### Prerequisites
- Node.js 18+
- The Axonix backend running locally or deployed, with its API URL available

### Setup

```bash
git clone https://github.com/PrateekBatra23/Axonix-web.git
cd Axonix-web
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Point this at your local backend during development, and at your deployed backend URL in production.

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Deployment

- **Frontend**: pushes to `main` auto-deploy via Vercel
- **Backend**: deployed separately on Railway
- Environment variables are set per-environment in each platform's dashboard, not committed to the repo

---

## Author

Built by [Prateek Batra](https://prateekbatra.dev).
