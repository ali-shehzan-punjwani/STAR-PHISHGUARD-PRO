<<<<<<< HEAD
# STAR PhishGuard Pro

STAR PhishGuard Pro is a simple, clean, AI-powered phishing detection and email security assistant for everyday users. It lets you analyze suspicious emails, links, headers, and attachments to identify potential phishing threats and understand what actions to take.

## Features

- **Dashboard** — overview of scan stats and recent activity
- **Analyze Email** — paste or upload an email to check it for phishing indicators
- **URL Scanner** — check suspicious links for risk signals (lookalike domains, HTTPS status, redirects, blacklist checks, etc.)
- **Email Header Analyzer** — inspect SPF/DKIM/DMARC results and header mismatches
- **Attachment Check** — flag risky file types, macros, double extensions, and more
- **Model Performance** — view confidence scores from the underlying detection models
- **History & Reports** — review past scans and detailed verdict reports
- **Security Tips** — practical guidance on staying safe from phishing
- **Settings** — adjust detection sensitivity and manage a domain whitelist

## Tech Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite 6](https://vitejs.dev/) (build tool / dev server)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/) (`@google/genai`) for AI-powered analysis
- [Lucide React](https://lucide.dev/) icons, [Motion](https://motion.dev/) for animation

## Prerequisites

Before you begin, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- A **Gemini API key** — get one free from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Getting Started in VS Code

### 1. Clone the repository

Open a terminal (or use VS Code's integrated terminal) and run:

```bash
git clone https://github.com/<your-username>/star-phishguard.git
cd star-phishguard
```

### 2. Open the project in VS Code

```bash
code .
```

This opens the project folder in VS Code.

### 3. Install dependencies

In the VS Code integrated terminal (`` Ctrl+` `` or `View → Terminal`), run:

```bash
npm install
```

### 4. Set up your environment variables

Create a `.env.local` file in the project root (this file is git-ignored and won't be committed):

```bash
cp .env.example .env.local
```

Then open `.env.local` in VS Code and add your Gemini API key:

```
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 5. Run the app

```bash
npm run dev
```

The app will start on **http://localhost:3000**. Open that URL in your browser to use it.

### Other useful commands

| Command           | Description                          |
|-------------------|---------------------------------------|
| `npm run dev`     | Start the local development server    |
| `npm run build`   | Build an optimized production bundle  |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Type-check the project with `tsc`     |
| `npm run clean`   | Remove build output (`dist`)          |

## Project Structure

```
star-phishguard/
├── assets/              # Static assets
├── src/
│   ├── components/      # React UI components (Dashboard, Analyzers, Views, etc.)
│   ├── data/            # Static/sample data
│   ├── utils/           # Analysis logic (analyzer, url/header/attachment analyzers, storage)
│   ├── App.tsx          # Main application shell and routing
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles (Tailwind)
│   └── types.ts         # Shared TypeScript types
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── .env.example         # Example environment variables
```

## Notes

- All scan history and settings are stored **locally in your browser** (no external database).
- Never commit your `.env.local` file or expose your Gemini API key publicly — `.gitignore` is already configured to exclude it.

## License

Add a license of your choice (e.g., MIT) before publishing publicly.
=======
# STAR-PHISHGUARD-PRO
AI-powered phishing detection and email security assistant for everyday users
>>>>>>> b2fe041d95551e3b4abdcf58b1e721593aea84d3
