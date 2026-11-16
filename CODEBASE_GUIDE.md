# C.R.A.B.S. Web Application — Codebase Architecture & Developer Instruction File

> **Purpose:** This document is a technical reference for manual developers and LLM coding agents. It maps every core file, explains its responsibility, documents all API routes and persistence keys, and traces how components connect across the full-stack application.

---

## 1. High-Level Architecture Overview

The application is a **full-stack React + Express SPA** (no SQL or external database).
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React icons.
- **Backend:** Node.js + Express (`server.ts`) running on port `3000`.
  - In **development** (`npm run dev` / `tsx server.ts`), Express mounts Vite middlewares to serve the React app alongside `/api/*` routes.
  - In **production** (`npm start` / `node server.ts`), Express serves the static bundle compiled into `dist/` (`npm run build`) alongside `/api/*` routes.
- **Data Persistence:** Flat JSON and CSV files stored on disk in `server_data/`. All four primary club datasets (**Meeting Minutes**, **Competition Standings**, **Recipe Vault**, and **Member Roster**, plus **Competition Schedule**) read from and write to `/api/*` endpoints so updates entered from any browser are visible to every visitor. Client-side `localStorage` is kept only as a secondary cache/offline fallback and for intra-tab sync events.

### System Data Flow

```text
┌───────────────────────────┐       HTTP GET/POST        ┌───────────────────────────────┐
│  React Client (Browser)   │ ─────────────────────────► │   Express Server (server.ts)  │
│  src/App.tsx & Components │ ◄───────────────────────── │   REST API: /api/*            │
└─────────────┬─────────────┘     JSON / CSV payloads    └───────────────┬───────────────┘
              │                                                          │ fs.readFileSync /
              │ Fallback cache + CustomEvent sync                        │ fs.writeFileSync
              ▼                                                          ▼
┌───────────────────────────┐                            ┌───────────────────────────────┐
│ Browser Web Storage       │                            │ Persistent Flat Files         │
│ • localStorage (cache/pw) │                            │ /server_data/*.json & *.csv   │
│ • sessionStorage (auth)   │                            │ (Docker Volume Mount Target)  │
└───────────────────────────┘                            └───────────────────────────────┘
```

---

## 2. Root Configuration & Server Files

| File | Role | Connections & Key Details |
| :--- | :--- | :--- |
| **`package.json`** | Manifest, dependencies, and npm scripts | `"type": "module"`. Scripts: `dev` (`tsx server.ts`), `build` (`vite build`), `start` (`node server.ts`), `lint` (`tsc --noEmit`). Node 22+ / 26+ runs `server.ts` directly via native TypeScript type stripping. |
| **`package-lock.json`** | Dependency lockfile | Used by `npm ci` for reproducible local and Docker builds. |
| **`tsconfig.json`** | TypeScript compiler configuration | Targets `ES2022`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `noEmit: true`. Excludes `dist`. |
| **`vite.config.ts`** | Vite bundler configuration | Enables `@vitejs/plugin-react` and `@tailwindcss/vite`, sets `base: './'`, aliases `@` to project root, and configures HMR flag (`DISABLE_HMR`). **Do not mount Express here**—Express runs in `server.ts`. |
| **`index.html`** | HTML shell & metadata | Loads Google Fonts (`Plus Jakarta Sans`, `JetBrains Mono`), sets club favicon (`/assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`), and mounts React via `<script type="module" src="/src/main.tsx">`. |
| **`server.ts`** | Full-stack Express backend & SPA host | Serves REST endpoints (`/api/standings`, `/api/standings/csv`, `/api/schedule`, `/api/minutes`, `/api/roster`, `/api/recipes`), converts standings to CSV on every write, and serves either `vite.middlewares` (dev) or `/dist` (prod). **Constraint:** Must remain self-contained (must NOT import client `.ts` files from `src/` so `node server.ts` works natively in ESM without a bundler). |

---

## 3. Persistent Server Storage (`/server_data/`)

> **Docker Warning:** Mount `/app/server_data` as a persistent Docker volume so club updates survive container rebuilds.

| File | Backing Dataset | Format & Behavior |
| :--- | :--- | :--- |
| **`server_data/standings.json`** | Competition flight results | Array of `MonthArchive` objects. Read/written by `/api/standings`. |
| **`server_data/standings.csv`** | Competition flight CSV export | Auto-regenerated every time `writeStandings()` runs in `server.ts`. Served as downloadable attachment by `GET /api/standings/csv`. |
| **`server_data/minutes.json`** | Monthly meeting minutes | Array of `SimpleMeetingNote` objects. Read/written by `/api/minutes`. |
| **`server_data/recipes.json`** | Recipe Vault archive | Array of `Recipe` objects. Read/written by `/api/recipes`. |
| **`server_data/roster.json`** | Club membership roster | Array of `MemberRegistration` objects. Read/written by `/api/roster`. |
| **`server_data/schedule.json`** | Annual 12-month BJCP schedule | Array of `MonthlyComp` objects. Read/written by `/api/schedule`. |

---

## 4. Public Static Assets (`/public/`)

| Path | Purpose | Where Referenced |
| :--- | :--- | :--- |
| **`public/assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`** | Official C.R.A.B.S. bottle-cap emblem & favicon | Referenced by `index.html`, `Navbar.tsx`, `Hero.tsx`, `Footer.tsx`, `OfficerLoginGate.tsx`, and `OfficerManagement.tsx`. |

*(Note: Any other `.zip`, `.config`, `.txt`, `.jpg`, `.png`, or `.csv` files in `/public` are historical deployment/upload artifacts and are not imported by the running application.)*

---

## 5. Frontend Entry & Core Infrastructure (`/src/`)

### Entry & Styling
- **`src/main.tsx`**: Mounts `<App />` into `#root` and imports `./index.css`.
- **`src/index.css`**: Imports `@import "tailwindcss";`, configures font families (`Plus Jakarta Sans` and `JetBrains Mono`), and defines `@media print` rules hiding navigation/buttons during printing (e.g., Recipe or Minutes print views).

### Root State & Routing
- **`src/App.tsx`**:
  - **Page Routing:** Uses `window.location.hash` (`#officers` / `#management` vs public `#` site) to switch between the public landing page and the Officer Portal (`OfficerLoginGate` -> `OfficerManagement`).
  - **Authentication State:** Reads `sessionStorage.getItem('crabs_officer_authenticated')` so the portal stays unlocked only for the current browser tab session or until logout.
  - **Shared State Hoisted to Root:** Manages `roster`, `competitionResults`, and `competitionSchedule`. On mount, fetches live server data via `fetchStandings()`, `fetchSchedule()`, and `fetchRoster()` from `src/services/api.ts`.
  - **Callbacks Passed Down:**
    - `handleUpdateCompetitionResults` -> updates state, `localStorage`, dispatches `crabs-standings-updated`, and calls `saveStandingsToServer`.
    - `handleUpdateCompetitionSchedule` -> updates state, `localStorage`, dispatches `crabs-schedule-updated`, and calls `saveScheduleToServer`.
    - `handleMemberRegistered` -> fetches latest `/api/roster` first to prevent overwriting concurrent registrations, prepends new member, saves to `localStorage` and calls `saveRosterToServer`.
    - `handleUpdateRoster` / `handleClearRoster` -> updates state, `localStorage`, and calls `saveRosterToServer`.

### Shared Types (`/src/types/`)
- **`src/types/index.ts`**:
  - `FamilyMember` (id, name, email, relationship)
  - `MemberRegistration` (id, contact info, experience, equipment, family membership, payment method `'paypal' | 'cash_at_meeting'`, dues, status `'pending' | 'paid' | 'verified'`)
  - `RecipeIngredient`, `HopAddition`, `Recipe` (vitals `og`/`fg`/`abv`/`ibu`/`srm`, category `'real-ale' | 'ipa' | 'stout' | 'wheat-farmhouse' | 'lager-specialty'`, fermentables, hops, yeast, temperatures, optional `award` and `caskConditioned`).

### API & CSV Client (`/src/services/`)
- **`src/services/api.ts`**:
  - **Server Sync Methods:**
    - `fetchStandings()` / `saveStandingsToServer()` (`/api/standings`)
    - `fetchSchedule()` / `saveScheduleToServer()` (`/api/schedule`)
    - `fetchMinutes()` / `saveMinutesToServer()` (`/api/minutes`)
    - `fetchRoster()` / `saveRosterToServer()` (`/api/roster`)
    - `fetchRecipes()` / `saveRecipesToServer()` (`/api/recipes`)
  - **CSV Utilities:**
    - `generateStandingsCSV(standings)` & `downloadStandingsCSV(standings)` — builds RFC-style quoted CSV and triggers browser Blob download.
    - `parseCSVLine(line)` — handles quoted fields and escaped quotes.
    - `parseStandingsCSVText(text)` — parses both **row-by-row placement** CSVs (`Month, Style Category, Place, Brewer, Beer Name, Points`) and **column-based summary** CSVs (`Month, Category, 1st Place, 2nd Place, ...`) into `MonthArchive[]`.

---

## 6. Seed / Default Datasets (`/src/data/`)

Used as client-side initial/fallback data when `server_data/*.json` is unreachable or empty:

| File | Exports | Connected Components |
| :--- | :--- | :--- |
| **`src/data/competitionStandings.ts`** | `MonthlyPlacement`, `MonthArchive`, `TopBrewer`, `DEFAULT_MONTHLY_RESULTS` (9 months of official standings), `HISTORICAL_MOCK_RESULTS`, `calculateTopBrewers(results)` | `App.tsx`, `CompetitionSchedule.tsx`, `OfficerManagement.tsx`, `api.ts` |
| **`src/data/competitionSchedule.ts`** | `MonthlyComp`, `DEFAULT_ANNUAL_SCHEDULE` (12 monthly BJCP themes & guidelines) | `App.tsx`, `CompetitionSchedule.tsx`, `OfficerManagement.tsx`, `api.ts` |
| **`src/data/defaultMinutes.ts`** | `SimpleMeetingNote`, `DEFAULT_MINUTES` (archived 2026 meeting notes) | `MeetingMinutes.tsx`, `OfficerManagement.tsx`, `api.ts` |
| **`src/data/defaultRoster.ts`** | `DEFAULT_ROSTER` (`MemberRegistration[]` seed sample) | `App.tsx` |
| **`src/data/mockRecipes.ts`** | `CLUB_RECIPES` (`Recipe[]` seed collection) | `RecipeVault.tsx`, `OfficerManagement.tsx` |

---

## 7. UI Components (`/src/components/`)

### Public Landing Page Sections (Rendered in order in `src/App.tsx`)

| Component | Section ID | What It Does & How It Connects |
| :--- | :--- | :--- |
| **`Navbar.tsx`** | Top header | Sticky navigation bar with logo, section scroll links (`#about`, `#competitions`, `#minutes`, `#social`, `#tools`, `#vault`), mobile drawer, and `#join` CTA button. |
| **`Hero.tsx`** | `#hero` | Club introduction, meeting quick info (Heavy Seas Brewery, 3rd Wednesday 7:00 PM), CTA buttons (`onJoinClick`, `onCompetitionsClick`), and interactive full-screen bottle-cap emblem lightbox modal. |
| **`AboutMeetings.tsx`** | `#about` | Club overview, 3 pillar cards, meeting location & Google Maps links, Heavy Seas & Maryland Homebrew sponsor recognition, and embeds `<MeetingMinutes />`. |
| **`MeetingMinutes.tsx`** | `#minutes` (embedded inside `AboutMeetings.tsx`) | Displays searchable archive of monthly club meeting minutes with copy & print actions. Fetches live data via `fetchMinutes()` on mount and listens to `storage` & `crabs-minutes-updated` events. |
| **`CompetitionSchedule.tsx`** | `#competitions` | Displays "This Month" spotlight + 12-month BJCP schedule (quarter filters + detail modal), plus a collapsible Standings section ("Season Standings / BOTY Top 5", "Monthly Flights", "Points System"). Reads `competitionResults` & `schedule` props from `App.tsx` and calculates rankings via `calculateTopBrewers()`. |
| **`JoinSection.tsx`** | `#join` | Public membership registration form (Individual $25 / Family $40 with dynamic family member rows, experience/equipment selects, PayPal/Venmo or Pay-at-Meeting options, email confirmation generator). Calls `onMemberRegistered(newMember)` in `App.tsx`, which persists directly to `/api/roster`. |
| **`SocialMediaSection.tsx`** | `#social` | Links to C.R.A.B.S. Facebook Group and community contact channels (`crabsbrew@googlegroups.com`). |
| **`BrewingTools.tsx`** | `#tools` | Purely client-side utility calculators: **ABV & Attenuation** (Standard & Palmer Alternate equations), **Mash Strike Water Temperature**, and **Refractometer Brix-to-SG Converter** (pre-ferment ASBC & post-ferment Sean Terrill correction). No server persistence needed. |
| **`RecipeVault.tsx`** | `#vault` | Filterable/searchable club recipe archive with full brew-sheet modal and "Submit Your Recipe" form modal. Fetches live data via `fetchRecipes()` on mount; submitting a new recipe calls `saveRecipesToServer()`, updates `localStorage`, and dispatches `crabs-recipes-updated`. |
| **`Footer.tsx`** | Bottom footer | Displays club address, contact email (`crabsbrew@googlegroups.com`), Facebook link, copyright, and **"Officers Management Portal"** trigger (`onOpenOfficerPortal`). |

### Officer Administration Components

| Component | Access / Trigger | What It Does & How It Connects |
| :--- | :--- | :--- |
| **`OfficerLoginGate.tsx`** | Shown on `#officers` when `!isOfficerAuthenticated` | Password gate protecting the Officer Portal. Validates against `localStorage.getItem('crabs_officer_password_v1')` (defaults to `'crabs1981'` if unchanged). Sets `sessionStorage.setItem('crabs_officer_authenticated', 'true')` on success and calls `onSuccess()`. |
| **`OfficerManagement.tsx`** | Shown on `#officers` once authenticated | Full multi-tab admin dashboard connected to all server APIs:<br>• **Tab 1 (`minutes`):** Create, edit, search, and delete meeting notes -> `saveMinutesToServer()`.<br>• **Tab 2 (`schedule`):** Edit monthly styles, BJCP codes, guidelines, or active spotlight month -> `saveScheduleToServer()`.<br>• **Tab 3 (`standings`):** Enter monthly flight winners (with tie support), delete/reset flights, **Export CSV** (`downloadStandingsCSV`), and **Import CSV** modal (`parseStandingsCSVText` with Append/Merge or Overwrite/Replace options) -> `saveStandingsToServer()`.<br>• **Tab 4 (`roster`):** Add/verify/edit/delete members, import/export member roster CSV -> calls `onUpdateRoster` (`saveRosterToServer`).<br>• **Tab 5 (`vault`):** Inspect, remove, or reset recipes -> `saveRecipesToServer()`.<br>• **Header Modal:** Change Officer Portal password (updates `crabs_officer_password_v1` in `localStorage`) and Log Out (`onLogout`). |
| **`OfficerRosterModal.tsx`** | Optional quick-view modal in `App.tsx` | Lightweight modal showing member roster search, verification toggles, CSV export, and clear roster action, wired to `roster`, `onUpdateRoster`, and `onClearRoster` in `App.tsx`. |

---

## 8. API Endpoint & Storage Key Cheat Sheet

### REST API Endpoints (`server.ts`)
| Endpoint | Methods | Backing File | Consumers |
| :--- | :--- | :--- | :--- |
| `/api/standings` | `GET`, `POST` | `server_data/standings.json` + `standings.csv` | `App.tsx`, `OfficerManagement.tsx` (via `api.ts`) |
| `/api/standings/csv` | `GET` | `server_data/standings.csv` | Direct CSV download |
| `/api/schedule` | `GET`, `POST` | `server_data/schedule.json` | `App.tsx`, `OfficerManagement.tsx` (via `api.ts`) |
| `/api/minutes` | `GET`, `POST` | `server_data/minutes.json` | `MeetingMinutes.tsx`, `OfficerManagement.tsx` (via `api.ts`) |
| `/api/roster` | `GET`, `POST` | `server_data/roster.json` | `App.tsx`, `OfficerManagement.tsx` (via `api.ts`) |
| `/api/recipes` | `GET`, `POST` | `server_data/recipes.json` | `RecipeVault.tsx`, `OfficerManagement.tsx` (via `api.ts`) |

*(All `POST` endpoints accept either a raw JSON array `[...]` or a wrapped object `{ "<key>": [...] }`.)*

### Browser Storage Keys & Custom Window Events
| Storage Key / Event | Storage Type | Purpose |
| :--- | :--- | :--- |
| `crabs_competition_standings_v2` / `crabs-standings-updated` | `localStorage` + `Event` | Client cache & sync event for standings (`v1` is purged on load). |
| `crabs_competition_schedule_v1` / `crabs-schedule-updated` | `localStorage` + `Event` | Client cache & sync event for competition schedule. |
| `crabs_meeting_minutes_v2` / `crabs-minutes-updated` | `localStorage` + `Event` | Client cache & sync event for meeting minutes (`v1` is purged on load). |
| `crabs_member_roster_v1` | `localStorage` | Client cache for member roster. |
| `crabs_recipes_vault_v1` / `crabs-recipes-updated` | `localStorage` + `Event` | Client cache & sync event for Recipe Vault. |
| `crabs_officer_password_v1` | `localStorage` | Master password for Officer Portal (updated in portal, checked in `OfficerLoginGate.tsx`). |
| `crabs_officer_authenticated` | `sessionStorage` | Tab-scoped unlock flag cleared when browser tab closes or officer logs out. |

---

## 9. Rules for Future Developers & LLMs

1. **Keep `server.ts` Independent of `src/`:** Do not import `.ts` files from `./src/...` inside `server.ts`. Node's native TypeScript execution (`node server.ts`) uses strict ESM resolution and will fail with `ERR_MODULE_NOT_FOUND` on extensionless client TypeScript imports.
2. **Preserve Flat-File Persistence:** Do not introduce SQL/external databases unless explicitly requested. All shared state changes must call the corresponding `save*ToServer()` helper in `src/services/api.ts`.
3. **Verify Before Finishing:** Always run `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`), and verify `NODE_ENV=production node server.ts` starts cleanly without module errors.
4. **Preserve Docker Compatibility:** Always read/write server data strictly inside `server_data/` (resolved relative to `server.ts`) so Docker volume mounts (`-v ./server_data:/app/server_data`) capture all state.
