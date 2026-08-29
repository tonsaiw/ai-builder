# NutriCoach

A personal-trainer nutrition app: snap a photo of your food, get an instant
AI-estimated nutrition breakdown, and track your daily calories and macros.

## Features

- 📷 **Photo food logging** — take or upload a photo of a meal and Claude's
  vision model estimates the food items, portion sizes, calories, and macros
  (protein/carbs/fat).
- ✏️ **Editable estimates** — review and adjust the AI's numbers before saving.
- 🔥 **Daily calorie dashboard** — a progress ring shows calories consumed vs.
  your daily goal, plus macro progress bars.
- 📅 **History** — a 7-day calorie chart and per-day meal breakdown.
- ⚙️ **Custom goals** — set your own daily calorie and macro targets.

All data is stored locally in the browser (`localStorage`) — no account or
database required.

## Getting started

```bash
npm install
cp .env.example .env
# add your Anthropic API key to .env
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable            | Description                                                        |
| ------------------- | -------------------------------------------------------------------|
| `ANTHROPIC_API_KEY`  | API key from https://console.anthropic.com/, used server-side only |

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- `@anthropic-ai/sdk` — food photo analysis via Claude's vision + tool use
- Browser `localStorage` for meal logs and settings
