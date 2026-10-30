# Chesapeake Real Ale Brewers Society (C.R.A.B.S.)

Official web application for the **Chesapeake Real Ale Brewers Society (C.R.A.B.S.)**, founded in 1981 in Baltimore, Maryland.

---

## Features

- **About & Meetings**: Meeting schedule (3rd Wednesday of every month at Heavy Seas Brewery), partner gratitude for Heavy Seas and Maryland Home Brew, and club officer roster.
- **2026 Monthly Competitions**: Full annual calendar featuring monthly BJCP competition styles, Sapwood Cellars clone competition, and guidelines.
- **Brewer of the Year Standings**: Live standings table and point system breakdown (1st = 10 pts, 2nd = 7 pts, 3rd = 5 pts, 4th = 3 pts, 5th = 2 pts).
- **Meeting Minutes**: Archive of monthly gathering notes with in-browser editing, add month, copying, and search.
- **Club Brewhouse Utilities**:
  - Brix to Specific Gravity converter with wort refractometer correction factor.
  - ABV, Apparent Attenuation & Calories Calculator.
  - Dilution & Boil-Off Calculator.
  - Priming Sugar & Keg Carbonation Calculator.
- **Recipe Vault**: Award-winning club recipe collection with expanded submit form, line-by-line fermentables and hops schedules, brewer notes, and print view.
- **Membership Registration**: Join C.R.A.B.S. form with dues payment options and persistent member roster.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

---

## Getting Started Locally

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd <YOUR-REPO-NAME>

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The app will start at `http://localhost:3000/`.

### Production Build

```bash
npm run build
```

The compiled static assets will be output to `./dist/`.

---

## Deploying to GitHub

### 1. Initialize Git and Push to GitHub

If you haven't yet pushed the code to your GitHub account:

```bash
# Initialize git in project root
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: C.R.A.B.S. web application"

# Rename branch to main
git branch -M main

# Add your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# Push to GitHub
git push -u origin main
```

---

### 2. Enable GitHub Pages Automatic Deployment

This repository includes a preconfigured GitHub Actions workflow in `.github/workflows/deploy.yml`.

To activate automatic deployments:

1. Open your repository on **GitHub**.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. That's it! Every time you push to `main`, GitHub Actions will build the app and deploy it automatically.

Your live site will be published at:
`https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

### 3. Using a Custom Domain (e.g. `crabsbrew.org`)

To link a custom domain:
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Custom domain**, enter your domain (e.g., `crabsbrew.org`).
3. Check **Enforce HTTPS**.
4. Configure your DNS provider with the appropriate `A` and `CNAME` records pointing to GitHub Pages.

---

## License

Created for the Chesapeake Real Ale Brewers Society (C.R.A.B.S.). All rights reserved.
