# SeaHub — Global Seafood Trading Platform

The Bloomberg + Alibaba + LinkedIn of the seafood world. A B2B marketplace with live price intelligence, AI-powered purchasing tools, group buying, and supplier verification.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Radix UI
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Language:** TypeScript

## Local Development

```bash
npm install   # .npmrc sets legacy-peer-deps automatically
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

### Steps

1. Push this repo to GitHub (`github.com/noam-dotcom/Seafood-one-stop-shop`)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import the repository
3. Vercel auto-detects Next.js — no build settings need changing
4. Click **Deploy**

The `.npmrc` file at the repo root sets `legacy-peer-deps=true`, so Vercel's install step works out of the box with no extra configuration.

### Build settings (auto-detected)

| Setting | Value |
|---|---|
| Framework | Next.js |
| Build command | `npm run build` |
| Output directory | `.next` (default) |
| Install command | `npm install` |

> **Note:** Do **not** override the install command in Vercel. The `.npmrc` handles the peer-dep flag automatically.

### Environment variables

This project currently has no required environment variables. If you add backend integrations (e.g. a database, auth provider, or AI API), add them in the Vercel dashboard under **Settings → Environment Variables** and create a `.env.local` file locally — never commit it (already excluded by `.gitignore`).

Example `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com
DATABASE_URL=postgresql://...
```

All variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`.

### Scripts

```bash
npm run dev      # Start dev server on :3000
npm run build    # Production build
npm run start    # Serve production build locally
npm run lint     # ESLint check
```

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx              # Home / dashboard
  marketplace/
    buy/                # Buyer marketplace
    sell/               # Seller marketplace
    group-buy/          # Group buy marketplace
  prices/               # Live price intelligence
  ai-buyer/             # AI buyer assistant
  ai-packaging/         # AI packaging designer
  platform-guide/       # How-to guide
  knowledge/            # Species knowledge base
  news/                 # Industry news
  recipes/              # Seafood recipes
  register/producer/    # Producer registration
components/             # Shared React components
lib/                    # Data, utilities, i18n
public/                 # Static assets
```
