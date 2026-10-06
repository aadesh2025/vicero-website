# Vicero marketing site

Separate Next.js 16 app for the public Vicero website. It lives outside the SaaS repo
(`../own_chatbot`) and never touches its code: auth stays in the app, the site only links to it.

## Run
```powershell
npm install
npm run dev            # http://localhost:3002
npm run build; npm start
```
Copy `.env.example` to `.env.local`. The build downloads Google Fonts once.

## Pages
`/` `/product` `/knowledge` `/automations` `/channels` `/security` `/pricing` `/developers` `/about` `/contact` `/login` `/privacy` `/terms`

## Product screenshots (real app, demo data)
`public/shots/{light,dark}/` are screenshots of the real Vicero app. To regenerate them:
1. Start Docker Desktop, then Postgres and Redis (`infra`), the API (:8000), the web app (:3001) and a Celery worker.
2. `node scripts/demo/setup.mjs`, which creates a demo workspace ("Lumen Home") through the real API.
3. Run `scripts/demo/seed.py` with the SaaS venv python. It loads about 3,800 invented conversations over 30 days into that workspace only.
4. `npx playwright test -c scripts/playwright.config.ts demo/capture.spec.ts`

All people, numbers and documents are invented. `scripts/demo/.state.json` holds the throwaway demo login and is git-ignored.

## Verify
`npm run typecheck; npm run lint; npm run build; npm start`, then `npm run e2e` (13 routes x 2 themes: 200, no console errors, axe A/AA, no horizontal scroll at 390px).

## Before launch
Replace /privacy and /terms; set the `NEXT_PUBLIC_*` vars; the contact form opens a mail client; pricing is copied by hand from `plans.py` (site.ts, pricing page, plan-picker); /login collects only an email and hands off to the app (no password touches this site).
