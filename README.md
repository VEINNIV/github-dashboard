<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

<h1 align="center">Developer Analytics</h1>

<p align="center">
  A premium lens into any developer's public GitHub footprint.<br/>
  Search a username to visualize their code, languages, and core projects.
</p>

<p align="center">
  <a href="https://github-dashboard-hazel.vercel.app/"><strong>Live Demo &rarr;</strong></a>
</p>

---

## Overview

**Developer Analytics** is a highly-aesthetic React / Next.js application that turns any GitHub username into a rich visual profile. It features a custom glassmorphism design system, live autocomplete search powered by the GitHub API, interactive language charts, and buttery-smooth Framer Motion animations — all wrapped in a fully responsive layout that looks great on every device.

### What You Can Do

| Capability | Description |
|---|---|
| **Language Breakdown** | Instantly view a doughnut chart of the primary languages used across a developer's recent repositories. |
| **Repository Explorer** | Browse the user's most active public projects with star counts, fork counts, and language badges. |
| **Developer Metrics** | See follower / following counts, total public repos, join date, location, and bio at a glance. |
| **Live Autocomplete** | Start typing a username and get debounced suggestions with avatars from the GitHub Search API. |

## Features

- **Live Search Autocomplete** — Queries the GitHub Search API as you type (debounced at 1.5 s) and previews developer avatars and names in a floating dropdown.
- **Glassmorphism UI** — Built entirely with Tailwind CSS: `backdrop-blur`, mesh-gradient backgrounds, and soft layered shadows.
- **Motion & Fluidity** — Framer Motion powers smooth layout entrances, staggered micro-animations, and spring-based interactions.
- **Language Charting** — Aggregates language data from recent repositories and renders an interactive doughnut chart via Chart.js.
- **Bento-Grid Layout** — Developer stats, bio, and repositories are arranged in a modern, digestible bento layout.
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile viewports.
- **Accessibility** — Respects `prefers-reduced-motion` and uses semantic HTML with proper alt-text.
- **Easter Egg** — A hidden "HR Chaos Panel" with a toy blaster and fake database overrides for fun.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (native utilities + custom theme tokens) |
| Animation | Framer Motion 12 |
| Data Visualization | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Data Source | GitHub REST API (unauthenticated) |
| Deployment | Vercel |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/VEINNIV/github-dashboard.git

# 2. Install
cd github-dashboard
npm install

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
github-dashboard/
├── app/
│   ├── globals.css        # Tailwind theme + glassmorphism utilities
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx           # Home page (client component)
├── components/
│   ├── SearchBar.tsx      # Debounced search with autocomplete dropdown
│   ├── ProfileCard.tsx    # User avatar, stats, bio, join date
│   ├── RepoCard.tsx       # Individual repository card
│   ├── LanguageChart.tsx  # Doughnut chart for language breakdown
│   ├── LoadingSpinner.tsx # Loading state indicator
│   ├── ErrorMessage.tsx   # Error display component
│   └── EasterEggMenu.tsx  # Hidden chaos panel & toy blaster
├── lib/
│   └── github.ts          # GitHub API fetch helpers
├── types/
│   └── github.ts          # TypeScript interfaces for API responses
├── public/                # Static assets
└── package.json
```

## Architectural Decisions

- **UX Debouncing** — A custom `useDebounce` hook (1.5 s buffer) prevents excessive API calls on the unauthenticated tier while keeping the search feel snappy.
- **Tailwind-First Styling** — The entire glassmorphism aesthetic is built with compound Tailwind classes rather than external CSS, making it easy to iterate and scale.
- **Graceful Degradation** — The autocomplete dropdown swallows rate-limit errors silently so that the primary "Search" button flow always works, even when the search-suggestions endpoint is throttled.
- **Next.js Image Optimization** — GitHub avatars are served through `next/image` with configured `remotePatterns` for automatic format and size optimization.

## License

This project is open-source and available under the [MIT License](LICENSE).
