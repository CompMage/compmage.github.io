import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure server data directory exists
const DATA_DIR = path.resolve(__dirname, 'server_data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const STANDINGS_JSON_FILE = path.join(DATA_DIR, 'standings.json');
const STANDINGS_CSV_FILE = path.join(DATA_DIR, 'standings.csv');
const SCHEDULE_JSON_FILE = path.join(DATA_DIR, 'schedule.json');
const MINUTES_JSON_FILE = path.join(DATA_DIR, 'minutes.json');
const RECIPES_JSON_FILE = path.join(DATA_DIR, 'recipes.json');
const ROSTER_JSON_FILE = path.join(DATA_DIR, 'roster.json');

// RFC-4180 CSV field escaping to preserve quotes, commas, and newlines safely
function escapeCSVField(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

// Atomic write (temp file -> rename) to prevent partial/corrupted files on interrupted writes
function writeFileAtomic(filePath: string, content: string): void {
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmpPath, content, 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {}
    throw err;
  }
}

// Read JSON array safely with fallback
function readJSONArray<T = any>(filePath: string, fallback: T[] = []): T[] {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJSONAtomic(filePath: string, data: unknown[]): void {
  writeFileAtomic(filePath, JSON.stringify(data, null, 2));
}

// Convert standings array to escaped CSV string
function standingsToCSV(standings: any[]): string {
  const headers = [
    'Month',
    'Month Number',
    'Style Category',
    'BJCP Code',
    'Entries Count',
    'Place',
    'Points',
    'Brewer',
    'Beer Name',
    'Style'
  ];

  const rows: string[] = [];

  standings.forEach((monthArchive) => {
    const month = escapeCSVField(monthArchive.month ?? '');
    const monthNum = monthArchive.monthNumber ?? '';
    const styleCat = escapeCSVField(monthArchive.styleCategory ?? '');
    const bjcp = escapeCSVField(monthArchive.bjcpCode ?? '');
    const entries = monthArchive.entriesCount ?? 0;

    if (!monthArchive.standings || monthArchive.standings.length === 0) {
      rows.push([month, monthNum, styleCat, bjcp, entries, '', '', '', '', ''].join(','));
    } else {
      monthArchive.standings.forEach((placement: any) => {
        rows.push(
          [
            month,
            monthNum,
            styleCat,
            bjcp,
            entries,
            placement.place ?? '',
            placement.points ?? '',
            escapeCSVField(placement.brewer ?? ''),
            escapeCSVField(placement.beerName ?? ''),
            escapeCSVField(placement.style ?? '')
          ].join(',')
        );
      });
    }
  });

  return [headers.join(','), ...rows].join('\n') + '\n';
}

function writeStandings(data: any[]): void {
  writeJSONAtomic(STANDINGS_JSON_FILE, data);
  writeFileAtomic(STANDINGS_CSV_FILE, standingsToCSV(data));
}

// Reusable flat-file GET/POST route factory
function registerArrayEndpoint(routePath: string, filePath: string, bodyKey: string): void {
  app.get(routePath, (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(readJSONArray(filePath, []));
  });

  app.post(routePath, (req: Request, res: Response) => {
    try {
      const payload = Array.isArray(req.body) ? req.body : req.body?.[bodyKey];
      if (!Array.isArray(payload)) {
        return res.status(400).json({ error: `${bodyKey} array required` });
      }
      writeJSONAtomic(filePath, payload);
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, count: payload.length });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to save data' });
    }
  });
}

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

// 1. Standings Endpoints (writes both JSON & CSV atomically)
app.get('/api/standings', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(readJSONArray(STANDINGS_JSON_FILE, []));
});

app.post('/api/standings', (req, res) => {
  try {
    const standings = Array.isArray(req.body) ? req.body : req.body?.standings;
    if (!Array.isArray(standings)) {
      return res.status(400).json({ error: 'standings array required' });
    }
    writeStandings(standings);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ success: true, count: standings.length });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save standings' });
  }
});

app.get('/api/standings/csv', (_req, res) => {
  if (!fs.existsSync(STANDINGS_CSV_FILE)) {
    writeStandings(readJSONArray(STANDINGS_JSON_FILE, []));
  }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=CRABS_Standings_${new Date().toISOString().slice(0, 10)}.csv`
  );
  res.sendFile(STANDINGS_CSV_FILE);
});

// 2-5. Schedule, Minutes, Roster & Recipe Vault Endpoints
registerArrayEndpoint('/api/schedule', SCHEDULE_JSON_FILE, 'schedule');
registerArrayEndpoint('/api/minutes', MINUTES_JSON_FILE, 'minutes');
registerArrayEndpoint('/api/roster', ROSTER_JSON_FILE, 'roster');
registerArrayEndpoint('/api/recipes', RECIPES_JSON_FILE, 'recipes');

// ==========================================
// VITE INTEGRATION & STATIC HOSTING
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT)
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const assetsPath = path.join(distPath, 'assets');

    // Long-lived immutable cache for fingerprinted Vite assets
    if (fs.existsSync(assetsPath)) {
      app.use(
        '/assets',
        express.static(assetsPath, {
          maxAge: '1y',
          immutable: true
        })
      );
    }

    app.use(
      express.static(distPath, {
        index: false,
        maxAge: '1h'
      })
    );

    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(
      `[C.R.A.B.S.] Full-stack server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`
    );
  });
}

startServer();

