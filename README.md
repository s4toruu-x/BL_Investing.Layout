# BL-Investing — Layout

Layout-only export of BL-Investing. This is a standalone starter that keeps the
visual shell (sidebar + Home page) with **no backend**: there is no Supabase,
no auth, and no live data. The Home page renders from static demo data so you
can use it as a clean foundation for a new build.

## What's included

- Sidebar with collapse/expand, mobile drawer, and dark-mode toggle.
- Responsive `Layout` shell (`src/components/shared/Layout.tsx`).
- **Stock ticker marquee** across the top of every page
  (`src/components/shared/StockTickerMarquee.tsx`) — scrolling ticker / price /
  percent-change strip, driven by the static `STOCKS` demo data.
- `Home`, `Stocks` (list + detail), and `Bets` pages, all fed by static
  placeholder data in `src/types/constants.ts`.

## What was removed

- The remaining pages/tabs (agendas, rankings, reports, U-20, sponsors, help,
  profiles, auth).
- The rest of the top chrome (market status, game bar, promo banner).
- Supabase client, providers, and all data/auth hooks.

## Demo data

Everything renders from `src/types/constants.ts` — no network calls. `STOCKS`
carries eight placeholder tickers (AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA,
NFLX) so the marquee and the stocks grid both have something to show; only
`apple` has an icon in `src/assets/icons/stock_icons/`, the rest fall back to a
coloured monogram. Add a `<id>.png` there and it resolves automatically.

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
- [Recharts](https://recharts.org/) — price and group charts
- [react-fast-marquee](https://www.react-fast-marquee.com/) — top stock ticker
