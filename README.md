# Developer Analytics Dashboard

**Live Demo:** [https://github-dashboard-hazel.vercel.app/](https://github-dashboard-hazel.vercel.app/)

A premium, highly-aesthetic React/Next.js application that visualizes any GitHub developer's public footprint. Features a custom glassmorphism design system, live autocomplete search mapping against GitHub's API, and interactive data visualization charts.

## What You Can Do

This dashboard serves as a comprehensive visual analyzer for GitHub profiles. By simply entering a GitHub username, you can:

- Analyze Programming Languages: Instantly view a graphical breakdown of the primary languages used across a developer's recent repositories.
- Discover Key Repositories: Browse through the user's most active and public projects, complete with current star ratings and fork statistics.
- Explore Developer Metrics: Access a summarized view of core stats such as total public repos, follower counts, following lists, and detailed bio information directly from GitHub.
- Experience a Premium UI: Interact with a seamlessly animated, glassmorphism-inspired interface that makes data consumption highly engaging.

This tool is particularly useful for recruiters reviewing potential tech candidates, developers examining their own open-source footprint, or anyone interested in digging into GitHub statistics without navigating through the standard GitHub interface.

## Features

- **Live Search Autocomplete**: Instantly queries the GitHub Search APIs as you type (debounced) and previews developer avatars/names in a sleek floating menu.
- **Glassmorphism UI**: Customized entirely using Tailwind CSS, featuring heavy `backdrop-blur`, mesh-gradient ambient backgrounds, and meticulously crafted soft shadows.
- **Motion & Fluidity**: Integrates `framer-motion` for smooth layout entrances, staggered micro-animations, and a highly responsive user experience.
- **Language Charting**: Extracts and aggregates language data from recent repositories and maps them intricately via `chart.js` and `react-chartjs-2`.
- **Bento-Grid Architecture**: Lays out developer statistics, bios, and codebase activities into a modern, digestable bento layout.

## Tech Stack 

- **Framework**: Next.js (App Router), React 19
- **Styling**: Tailwind CSS (Native utilities + Custom Theme Tokens)
- **Animation**: Framer Motion
- **Data Visualization**: Chart.js & react-chartjs-2
- **Icons**: Lucide React
- **Data Source**: GitHub REST API

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/github-analytics-dashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd github-analytics-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Architectural Decisions

- **UX Debouncing Strategy**: To ensure smooth querying and avoid being strictly rate-limited by the GitHub API unauthenticated tier, a custom `useDebounce` hook (1.5-second buffer) is attached to the search input state.
- **Tailwind Native Integration**: Instead of overloading CSS files, almost the entire custom glassmorphism aesthetic is built utilizing compound Tailwind classes allowing for massive scalability.
- **Error Boundaries & Fallbacks**: Engineered to gracefully handle API limits, meaning even if the dynamic search drop-down hits a rate-limit ceiling, standard query execution remains intact securely falling back to traditional routing logic.

## License
This project is open-source and available under the [MIT License](LICENSE).
