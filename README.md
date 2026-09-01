# NIT KKR PYQs

Live site: **[nitkkrpyqs.in](https://nitkkrpyqs.in)** — also served under the brand name "NexSphere" in metadata.

A React web app for students of **NIT Kurukshetra (NIT KKR)** to browse and download previous year question papers (PYQs), and to look up the full B.Tech syllabus (branch → semester → course) for every branch offered. Students can also contribute their own papers, which go through a verification step before being published. This repository is the **frontend only** (React + Vite); it talks to a separate Node/Express + MongoDB backend over HTTP.

Repo (frontend): `git@github.com:RohithReddy-1402/q_paper.git` (package name: `q_paper`).

Repo (backend): `git@github.com:RohithReddy-1402/back.git` (package name: `back`).

---

## Table of contents

- [What this app does](#what-this-app-does)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Routes / pages](#routes--pages)
- [Syllabus data model](#syllabus-data-model)
- [Environment variables](#environment-variables)
- [Getting started](#getting-started)
- [Build, prerendering & preview](#build-prerendering--preview)
- [Deployment](#deployment)
- [SEO files](#seo-files)
- [Contributing new papers / syllabus data](#contributing-new-papers--syllabus-data)
- [Known quirks / gotchas](#known-quirks--gotchas)

---

## What this app does

1. **Question papers (PYQs)** — students search/filter previous year question papers by subject, semester, year and exam type, and download the PDF. Papers are uploaded to Cloudflare R2 and served from `https://pdf.nitkkrpyqs.in/<key>`; metadata (title, subject, subject code, semester, year, exam type, uploader) lives in the backend's database.
2. **Contribute a paper** — logged-in users can upload a paper (via `ContributeModal.jsx`), which is stored in R2 and queued for moderator verification (`tobeVerifed.jsx`) before it appears publicly.
3. **Syllabus browser** — a full, offline (bundled JSON) syllabus explorer: pick a branch → pick a semester → see the semester scheme (core/elective/open-elective/co-curricular courses with L-T-P-C) → open any course to see its full syllabus, textbooks, outcomes, etc.
4. **Accounts** — Google Sign-In (via Firebase Auth / `@react-oauth/google`) or manual email+password signup, plus password reset. Auth/session state is checked against the backend (`/auth/check`, cookie-based session).
5. **Donations** — a Razorpay-powered donate page to help cover hosting costs.
6. **Static/info pages** — About Us, Tech Stack (self-documenting page about how the site is built), Privacy Policy, Contact, and a 404 page.

## Tech stack

**Frontend (this repo):**

| Concern | Library |
|---|---|
| UI framework | React 18 + Vite 6 |
| Routing | React Router v7 (`BrowserRouter`, all routes lazy-loaded with `React.lazy`/`Suspense`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), plus MUI (`@mui/material`, `@mui/icons-material`), Emotion, and `styled-components` in places |
| Animation | Framer Motion |
| Icons | `lucide-react` |
| Auth | Firebase Auth (Google popup sign-in, see [`src/components/fireBase.jsx`](src/components/fireBase.jsx)) and `@react-oauth/google`; app-level session cookie checked against the backend |
| File storage client | `@aws-sdk/client-s3`-style flow against Cloudflare R2 via presigned URLs (see [`src/services/r2.service.jsx`](src/services/r2.service.jsx)) |
| Payments | Razorpay Checkout (loaded via script tag in [`src/components/donate.jsx`](src/components/donate.jsx)) |
| Search | `fuse.js` (fuzzy search over papers/courses) |
| SEO/meta | `react-helmet-async` per-page `<title>`/`<meta>`, JSON-LD in `index.html` |
| Analytics | `@vercel/analytics` |
| Data fetching | plain `fetch` against `VITE_BACKEND_ENDPOINT` (no axios/react-query layer, though `axios` is a dependency) |

**Backend (separate repo, not in this codebase):** Node.js + Express API, MongoDB for papers/users/download counts, Resend for transactional email (verification, password reset), Cloudflare R2 for file storage. See the in-app **Tech Stack** page ([`src/components/TechStack.jsx`](src/components/TechStack.jsx)) for the user-facing explanation of the full stack, including hosting on Vercel.

**Build tooling:** ESLint 9, PostCSS/Autoprefixer, and a custom prerendering step using `playwright-core` + `express` (see below).

## Project structure

```
q_paper/
├── index.html                  # HTML shell, SEO meta, JSON-LD, favicon
├── vite.config.js              # Vite + React + Tailwind plugins; aliases react-helmet → react-helmet-async
├── vercel.json                 # SPA rewrites for Vercel hosting
├── scripts/
│   └── prerender.mjs           # Post-build static prerendering (see below)
├── public/
│   ├── robots.txt, sitemap.xml, ads.txt, icon.png, verification files
├── src/
│   ├── main.jsx                 # React root, wraps <App /> in HelmetProvider
│   ├── App.jsx                  # Router, all top-level routes, auth/session bootstrap, global modals
│   ├── App.css / index.css      # Global styles
│   ├── services/
│   │   └── r2.service.jsx       # Cloudflare R2 upload flow + viewPaper() URL helper
│   ├── assets/                  # Images/GIFs used across the site
│   └── components/
│       ├── HomePage.jsx, QuestionPaper.jsx      # Landing page + PYQ browser/downloader
│       ├── ContributeModal.jsx, tobeVerifed.jsx # Upload a paper + moderation queue
│       ├── Login.jsx, LoginTest.jsx, TerminalMode.jsx,
│       │   ForgotPass.jsx, SignupModal.jsx      # Auth flows (Google + manual)
│       ├── fireBase.jsx                          # Firebase app/auth init
│       ├── Syllabus.jsx, BranchList.jsx,
│       │   BranchDetail.jsx, BranchSemester.jsx,
│       │   test.jsx (course page), SemesterGrid.jsx,
│       │   Breadcrumbs.jsx                       # Syllabus browser (branch → semester → course)
│       ├── syllabus-data/                        # All syllabus content, see below
│       ├── Header.jsx, Footer.jsx, hangingBoard.jsx,
│       │   celebration.jsx, DownloadButton.jsx,
│       │   SearchAutocomplete.jsx, Loading.jsx,
│       │   ToastContainer.jsx / ToastContext.jsx # Shared UI/chrome
│       ├── AboutUs.jsx, TechStack.jsx,
│       │   contactPage.jsx, donate.jsx,
│       │   PrivacyPolicy.jsx, NotFound.jsx       # Static/info pages
```

## Routes / pages

Defined in [`src/App.jsx`](src/App.jsx):

| Path | Component | Notes |
|---|---|---|
| `/` | redirects to `/nit-kkr-pyqs` | |
| `/nit-kkr-pyqs` | `HomePage` | Landing page |
| `/nit-kkr/question-papers` | `QuestionPaper` | Browse/search/download PYQs |
| `/nit-kkr-pyqs/contribute` | `ContributeModal` | Upload a paper (auth required) |
| `/nit-kkr-pyqs/verifypaper` | `tobeVerifed` | Moderation queue for uploaded papers |
| `/nit-kkr-pyqs/login` | `TerminalMode` | Login/signup entry point |
| `/nit-kkr/syllabus` | `Syllabus` | Syllabus search/landing |
| `/nit-kkr/syllabus/branch` | `BranchList` | List of branches |
| `/nit-kkr/syllabus/branch/:branchSlug` | `BranchDetail` | Branch overview + available semesters |
| `/nit-kkr/syllabus/branch/:branchSlug/semester/:semNumber` | `BranchSemester` | Semester scheme (courses, L-T-P-C, electives) |
| `/nit-kkr/syllabus/course/:code` | `test.jsx` (course page) | Full course syllabus |
| `/nit-kkr/about` | `AboutUs` | |
| `/nit-kkr/tech-stack` | `TechStack` | Explains the stack behind the site |
| `/nit-kkr/contact` | `contactPage` | |
| `/nit-kkr/donate` | `donate` | Razorpay donation flow |
| `/nit-kkr/privacy-policy` | `PrivacyPolicy` | |
| `*` | `NotFound` | 404 |

`robots.txt` deliberately disallows crawling of `/nit-kkr-pyqs/login`, `/nit-kkr-pyqs/contribute` and `/nit-kkr-pyqs/verifypaper` since they carry no indexable content.

## Syllabus data model

All syllabus content is static JSON checked into the repo under [`src/components/syllabus-data/`](src/components/syllabus-data/) — no backend call is needed to browse it:

- **`branches.js`** — the `BRANCHES` map: `slug -> { code, name, description, semestersAvailable }`. Currently covers Computer Science and Engineering (`CS`), Robotics & Automation (`RA`), Artificial Intelligence & Machine Learning (`AIML`), and Electrical Engineering (`EE`).
- **`semester-schemes/<code>-<sem>.json`** (lowercase branch code, e.g. `ee-5.json`) — one file per branch+semester: `{ branch, branchName, semester, title, totalCredits, rows[] }`. Each row is one of:
  - `core` — `{ type: "core", code, ltpc, label? }`
  - `elective` — `{ label, ltpc, options: [] }`
  - `openElective` — `{ label, ltpc }`
  - `coCurricular` — `{ label, ltpc, note }`
  
  `BranchSemester.jsx` dynamically imports the right scheme file and resolves `core`/`elective` course codes against `courses-info.json`.
- **`course/<route-basename>.json`** — one file per course, the full syllabus page. Key fields: `Course Title`, `Course Code`, `credits`, `prerequisites` (hidden when `"NA"`/`"-"`), `Course Type`, `ltpc`, `contactHours`, `description`, `syllabus: [{ id, title, body, hours? }]`, `experiments[]`, `outcomes[]`, `textbooks[]`, `referenceBooks[]`, plus `Branch` (array — first entry drives the breadcrumb) and `route`.
- **`courses-info.json`** — a flat index of every course: `{ "Course Title", "Course Code", route, "Branches"[], semester?, id: "nitkkr_N" }`. This powers search in `Syllabus.jsx` and lookups in `BranchDetail.jsx` / `BranchSemester.jsx` / the course page.

**Course-code collision caveat:** course lookups are keyed by `Course Code` globally (one code → one course everywhere), but NIT KKR reuses some codes across branches with different content (e.g. `MAIC-203`). The workaround used for Electrical Engineering was to give the colliding course a distinct code/route suffix, e.g. `MAIC-203 (EE)` / route `maic-203-ee`, so it doesn't clobber the AIML version of the same code. Keep this in mind if you add a new branch whose scheme reuses a code that already exists for another branch.

**When adding a new branch or semester**, remember to also update:
- [`scripts/prerender.mjs`](scripts/prerender.mjs) — `branchSemesterRoutes` (and `courseRoutes`, which is generated from `courses-info.json` automatically) so the new pages get prerendered.
- [`public/sitemap.xml`](public/sitemap.xml) — hand-maintained, no generator script exists for it yet.

## Environment variables

Configured via a Vite `.env` file at the project root (not committed — see `.gitignore`). All client-exposed vars must be prefixed `VITE_`:

| Variable | Used for |
|---|---|
| `VITE_BACKEND_ENDPOINT` | Base URL of the Express API (auth, papers, uploads) |
| `VITE_APPWRITE_PROJECT_ID` / `VITE_APPWRITE_BUCKET_ID` | Appwrite project/bucket config (`appwrite` dependency) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay checkout key for the Donate page |
| `VITE_R2_ACCOUNT_ID` / `VITE_R2_ACCESS_KEY_ID` / `VITE_R2_SECRET_ACCESS_KEY` / `VITE_R2_BUCKET_NAME` | Cloudflare R2 (S3-compatible) storage config |

There is no `.env.example` checked in yet — ask a maintainer for real values, or create the file yourself from the list above before running the app locally. Firebase config for Google sign-in is currently hardcoded in [`src/components/fireBase.jsx`](src/components/fireBase.jsx) rather than sourced from env vars.

## Getting started

Requires Node.js (any recent LTS) and npm.

```bash
# 1. Clone
git clone git@github.com:RohithReddy-1402/q_paper.git
cd q_paper

# 2. Install dependencies
npm install

# 3. Add your .env file (see Environment variables above)

# 4. Run the dev server (Vite, with HMR)
npm run dev
```

Other scripts (from [`package.json`](package.json)):

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (`vite build`), then automatically runs `postbuild` (see prerendering below) |
| `npm run lint` | Run ESLint over the project |
| `npm run preview` | Serve the production build locally for a final check |

## Build, prerendering & preview

`npm run build` runs `vite build` and then a `postbuild` step, [`scripts/prerender.mjs`](scripts/prerender.mjs), which:

1. Serves the freshly built `dist/` folder locally with a throwaway Express server.
2. Launches headless Chromium via `playwright-core` (looks for a system Chromium/Chrome first, or `PRERENDER_CHROMIUM_PATH`; falls back to skipping prerendering with a warning if none is found).
3. Visits every static route, every course route (derived from `courses-info.json`), and every branch/semester route (hardcoded per branch — must be kept in sync manually, see [Syllabus data model](#syllabus-data-model)).
4. Waits for the SPA to render, then writes the fully-rendered HTML into `dist/<route>/index.html`, so crawlers and social-media link previews get real content instead of an empty shell.

If you don't have Chromium installed locally, install one via `npx playwright install chromium` or point `PRERENDER_CHROMIUM_PATH` at an existing browser binary; otherwise the build still succeeds, it just skips prerendering.

## Deployment

The site is deployed on **Vercel**. [`vercel.json`](vercel.json) rewrites every request to `index.html` (SPA fallback) except `/sitemap.xml`, which is served as-is so it stays crawlable. Vercel Analytics is wired in via `<Analytics />` in `App.jsx`.

## SEO files

- [`public/robots.txt`](public/robots.txt) — allows all crawling except the login/contribute/verify pages; points to the sitemap.
- [`public/sitemap.xml`](public/sitemap.xml) — hand-maintained list of indexable URLs; update it when adding new branches/semesters/courses.
- [`ads.txt`](ads.txt) — Google AdSense publisher verification.
- `index.html` — page title, meta description/keywords, Open Graph-style JSON-LD (`WebSite` schema, name `NexSphere`), Google site-verification meta tag, and the favicon.

## Contributing new papers / syllabus data

- **Papers:** use the in-app "Contribute" flow (`/nit-kkr-pyqs/contribute`) rather than editing data by hand — it uploads to R2 and records metadata through the backend, then routes the paper through `/nit-kkr-pyqs/verifypaper` for moderation.
- **Syllabus content:** add/edit JSON files directly under `src/components/syllabus-data/` following the shapes documented in [Syllabus data model](#syllabus-data-model) above, and remember to update `courses-info.json`, `scripts/prerender.mjs`, and `public/sitemap.xml` to match.

## Known quirks / gotchas

- `src/components/test.jsx` is the actual **course syllabus page** component (routed at `/nit-kkr/syllabus/course/:code`), despite the generic filename — don't confuse it with a scratch file.
- Firebase config in `fireBase.jsx` is currently hardcoded rather than read from `.env`.
- A couple of components reference `https://localhost:3001` directly (leftover from local backend testing) instead of `VITE_BACKEND_ENDPOINT` — worth cleaning up if you touch that code.
- `data.xlsx` / `data.ods` / `Targets.txt` at the repo root are working notes/spreadsheets used while compiling paper metadata and syllabus content; they're git-ignored and not part of the app itself.
