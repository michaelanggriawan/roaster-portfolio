# 🎯 Roster Technical Assignment – Full Stack Engineer

This repository contains my submission for the Roster Full Stack Engineer technical assignment. The goal was to build a system that allows users (talents) to submit a personal portfolio link and automatically extract structured data from the page — including their name, title, bio, clients/employers, and related YouTube videos — and render it in a user-friendly format.

---

## 🧩 Features

### ✅ Frontend (Next.js)
- Submit a portfolio URL through a clean UI.
- Toggle to enable or disable AI-enhanced scraping.
- View scraped data in a structured detail page.
- Portfolio list page with basic overview and link to details.
- Fully responsive, minimalistic.

### ✅ Backend (NestJS + SQLite)
- Receives and validates incoming URLs.
- Scrapes page content using Playwright.
- Extracts YouTube links using regex and dynamic DOM traversal.
- Maps YouTube `channelTitle` to clients and groups related videos.
- Uses OpenAI GPT-4 to suggest CSS selectors for structured data (optional).
- Fallback to static rules if AI fails.
- Data persisted using TypeORM with SQLite.

---

## 📐 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | Next.js (React + Tailwind) |
| Backend   | NestJS (Node.js)    |
| Database  | SQLite + TypeORM    |
| Scraping  | Playwright + Cheerio |
| AI Assist | OpenAI GPT-4 (optional) |

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/roster-scraper.git
cd roster-scraper
```

### 2. Start backend

```bash
cd backend
cp .env.example .env
# Add your OpenAI API key if needed
pnpm install
pnpm start:dev
```

### 3. Start frontend

```bash
cd ../frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
pnpm install
pnpm dev
```

---

## ⚙️ API Overview

### `POST /portfolio/scrape`
Scrapes a portfolio URL and stores structured data.

```json
{
  "url": "https://example-portfolio.com",
  "useAI": true
}
```

### `GET /portfolio`
Returns all stored portfolios.

### `GET /portfolio/:id`
Returns a specific portfolio and its clients/videos.

---

## 🤖 Use of AI

This app optionally uses **OpenAI GPT-4** to identify the correct CSS selectors for extracting structured information like name, title, and bio. You can toggle this behavior on or off in the UI.

### Key Prompt Example:

```text
You are an HTML structure analyzer. Given the following HTML snippet, return a valid JSON object that maps CSS selectors to relevant portfolio information...
```

### Manual Adjustments Made
- Fallback selectors (`h1`, `.about`, etc.) used when AI fails or returns invalid output.
- Escaped special selectors (e.g., Tailwind classnames like `:hover`).
- Limited HTML passed to AI to avoid exceeding token limits.

---

## 📈 Scalability Notes

If this system were to support **10,000+ portfolios**:

- I'd move scraping to a **background job queue** (e.g., BullMQ or SQS).
- Store videos separately and **normalize channel data** to avoid duplication.
- Add **pagination, indexing, and caching** for fast retrieval.
- Consider rate limiting and retry logic for Playwright and YouTube APIs.

---

## 📦 Deployment

This project is currently running locally. It can be deployed easily using:
- **Frontend:** Vercel (Next.js support)
- **Backend:** Railway / Render / Fly.io (Node.js support)
- **Database:** Railway SQLite or Postgres

---

## 📝 Final Notes

- No authentication is required — this app is 100% public.
- AI is optional and non-blocking — fallback is robust.
- Minimal design inspired by Rove Miles for UX clarity and aesthetics.

---

> If you have any questions or need me to walk through the code in a video, I'm happy to do so. Thanks for the opportunity!
