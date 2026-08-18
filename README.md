# Contact Sheet — a developer portfolio with an admin dashboard

A Next.js portfolio site themed around a darkroom / contact-sheet motif — built for
someone who codes and also shoots photography or does graphic design on the side.
Includes a password-protected `/admin` dashboard to manage everything without
touching code: qualifications, extracurricular activities, projects, and your résumé.

Everything is filled with **sample data** so you can see exactly how it looks and
behaves before you change a single word. Replace the sample content either by
editing `lib/defaultData.ts` directly, or — easier — by logging into `/admin` and
editing it there once the site is running.

## What's inside

- `/` — the public portfolio (hero, about, qualifications timeline, activities
  "contact sheet", projects grid, résumé download, contact links)
- `/admin` — login screen
- `/admin/dashboard` — protected dashboard with tabs for Profile, Qualifications,
  Activities, Projects, and Résumé
- API routes under `/api/*` that the dashboard calls to read/write data

## 1. Run it locally

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set:

```
ADMIN_PASSWORD=pick-a-password
SESSION_SECRET=any-long-random-string   # e.g. output of: openssl rand -hex 32
```

Leave the `KV_*` and `BLOB_READ_WRITE_TOKEN` lines blank — locally the app
automatically stores data in `./data/local-db.json` and résumé uploads in
`./public/uploads`, so there's nothing else to set up.

```bash
npm run dev
```

Visit `http://localhost:3000` for the portfolio, and `http://localhost:3000/admin`
to sign in with the password you set above.

## 2. Make it yours

You have two options, and you can mix both:

**Option A — edit in the browser.** Sign in at `/admin`, and use the Profile,
Qualifications, Activities, Projects, and Résumé tabs to add, edit, and delete
everything. This works immediately, both locally and once deployed.

**Option B — edit the sample data file.** Open `lib/defaultData.ts` and replace the
sample name, bio, qualifications, activities, and projects with your own. This file
is only used to seed a brand-new, empty database — once you've saved anything
through the dashboard, further edits to this file won't show up until you clear
your stored data.

Also worth a look:
- `app/layout.tsx` — page title/description (metadata) and fonts
- `app/globals.css` and `tailwind.config.js` — colors, the film-sprocket motif
- `app/page.tsx` — the public page layout/copy that isn't data-driven (section
  labels like "Roll 01 · Frame 01", "Exposures", "Contact sheet", "Developed")

## 3. Deploy to Vercel

This project needs two small pieces of storage to work in production, because
Vercel's serverless functions don't keep files on disk between requests the way
your own machine does:

- **A Redis store** (via Vercel's Marketplace, e.g. the Upstash integration) —
  stores your qualifications, activities, projects, and profile text (generous
  free tier)
- **Vercel Blob** — stores the uploaded résumé PDF file

Steps:

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Before the first deploy (or right after), open the project's **Storage** tab:
   - Click **Marketplace Database Providers** → choose a **Redis** integration
     (Upstash is the default option) → follow the prompts and connect it to
     this project. Vercel will automatically add the `UPSTASH_REDIS_REST_URL`
     and `UPSTASH_REDIS_REST_TOKEN` environment variables for you.
   - Click **Create Database** → **Blob** → connect it to this project. Vercel
     will automatically add `BLOB_READ_WRITE_TOKEN` for you.
4. Open **Settings → Environment Variables** and add the two you set locally:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
5. Deploy (or redeploy if it already ran). Your site is now live at the Vercel
   URL, and `/admin` works the same way it did locally, this time with data
   stored in Redis and Blob instead of local files.
6. Optional: add a custom domain under **Settings → Domains**.

## 4. Notes

- The admin area is protected by a single shared password (`ADMIN_PASSWORD`), not
  individual user accounts — appropriate for a personal site only you manage.
- Résumé uploads accept PDF files up to 8MB; change the limit in
  `app/api/resume/route.ts` (`MAX_SIZE`) if you need to.
- If you ever want to reset the site back to the sample data, delete the
  `portfolio:data` key in your Redis store (or delete `data/local-db.json`
  locally) and reload — it will be recreated from `lib/defaultData.ts`.
