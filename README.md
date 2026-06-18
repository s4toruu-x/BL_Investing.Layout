# BL-Investing — Layout

Layout-only export of BL-Investing. This is a standalone starter that keeps the
visual shell (sidebar + Home page) with **no backend**: there is no Supabase,
no auth, and no live data. The Home page renders from static demo data so you
can use it as a clean foundation for a new build.

## What's included

- Sidebar with a single **Home** nav item, collapse/expand, mobile drawer, and
  dark-mode toggle.
- Responsive `Layout` shell (`src/components/shared/Layout.tsx`).
- `Home` page with full visuals fed by static placeholder data
  (`src/components/home/HomePage.tsx`).

## What was removed

- All other pages/tabs (stocks, bets, agendas, rankings, charts, reports, U-20,
  sponsors, help, profiles, auth).
- The top chrome (stock ticker, market status, game bar, promo banner).
- Supabase client, providers, and all data/auth hooks.

## Getting started

```bash
yarn
yarn dev      # start the dev server
yarn build    # type-check + production build
```

## Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) + [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
- [Tailwind CSS](https://tailwindcss.com/)
