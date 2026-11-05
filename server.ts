import express from 'express';
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

// Helper to convert standings array to CSV string
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
    if (!monthArchive.standings || monthArchive.standings.length === 0) {
      rows.push(
        [
          `"${monthArchive.month}"`,
          monthArchive.monthNumber || '',
          `"${monthArchive.styleCategory || ''}"`,
          `"${monthArchive.bjcpCode || ''}"`,
          monthArchive.entriesCount || 0,
          '',
          '',
          '',
          '',
          ''
        ].join(',')
      );
    } else {
      monthArchive.standings.forEach((placement: any) => {
        rows.push(
          [
            `"${monthArchive.month}"`,
            monthArchive.monthNumber || '',
            `"${monthArchive.styleCategory || ''}"`,
            `"${monthArchive.bjcpCode || ''}"`,
            monthArchive.entriesCount || 0,
            placement.place || '',
            placement.points || '',
            `"${placement.brewer || ''}"`,
            `"${placement.beerName || ''}"`,
            `"${placement.style || ''}"`
          ].join(',')
        );
      });
    }
  });

  return [headers.join(','), ...rows].join('\n') + '\n';
}

// Write standings to both JSON and CSV
// Helper to read JSON file safely with fallback
function readJSONFile(filePath: string, fallback: any): any {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length === 0) {
        return parsed;
      }
      return parsed || fallback;
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }
  return fallback;
}

// Write standings to both JSON and CSV
function writeStandings(data: any[]): void {
  fs.writeFileSync(STANDINGS_JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');
  fs.writeFileSync(STANDINGS_CSV_FILE, standingsToCSV(data), 'utf-8');
}

// Read standings from JSON or initialize
function readStandings(): any[] {
  return readJSONFile(STANDINGS_JSON_FILE, []);
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Standings Endpoints
app.get('/api/standings', (_req, res) => {
  const data = readStandings();
  res.json(data);
});

app.post('/api/standings', (req, res) => {
  try {
    const standings = Array.isArray(req.body) ? req.body : req.body?.standings;
    if (!Array.isArray(standings)) {
      return res.status(400).json({ error: 'standings array required' });
    }
    writeStandings(standings);
    res.json({ success: true, count: standings.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Download server CSV
app.get('/api/standings/csv', (_req, res) => {
  if (!fs.existsSync(STANDINGS_CSV_FILE)) {
    const data = readStandings();
    writeStandings(data);
  }
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=CRABS_Standings_${new Date().toISOString().slice(0, 10)}.csv`);
  res.sendFile(STANDINGS_CSV_FILE);
});

// 2. Schedule Endpoints
app.get('/api/schedule', (_req, res) => {
  const schedule = readJSONFile(SCHEDULE_JSON_FILE, []);
  res.json(schedule);
});

app.post('/api/schedule', (req, res) => {
  try {
    const schedule = Array.isArray(req.body) ? req.body : req.body?.schedule;
    if (!Array.isArray(schedule)) {
      return res.status(400).json({ error: 'schedule array required' });
    }
    fs.writeFileSync(SCHEDULE_JSON_FILE, JSON.stringify(schedule, null, 2), 'utf-8');
    res.json({ success: true, count: schedule.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Minutes Endpoints
app.get('/api/minutes', (_req, res) => {
  const minutes = readJSONFile(MINUTES_JSON_FILE, []);
  res.json(minutes);
});

app.post('/api/minutes', (req, res) => {
  try {
    const minutes = Array.isArray(req.body) ? req.body : req.body?.minutes;
    if (!Array.isArray(minutes)) {
      return res.status(400).json({ error: 'minutes array required' });
    }
    fs.writeFileSync(MINUTES_JSON_FILE, JSON.stringify(minutes, null, 2), 'utf-8');
    res.json({ success: true, count: minutes.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Roster Endpoints
app.get('/api/roster', (_req, res) => {
  const roster = readJSONFile(ROSTER_JSON_FILE, []);
  res.json(roster);
});

app.post('/api/roster', (req, res) => {
  try {
    const roster = Array.isArray(req.body) ? req.body : req.body?.roster;
    if (!Array.isArray(roster)) {
      return res.status(400).json({ error: 'roster array required' });
    }
    fs.writeFileSync(ROSTER_JSON_FILE, JSON.stringify(roster, null, 2), 'utf-8');
    res.json({ success: true, count: roster.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Recipe Vault Endpoints
app.get('/api/recipes', (_req, res) => {
  const recipes = readJSONFile(RECIPES_JSON_FILE, []);
  res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
  try {
    const recipes = Array.isArray(req.body) ? req.body : req.body?.recipes;
    if (!Array.isArray(recipes)) {
      return res.status(400).json({ error: 'recipes array required' });
    }
    fs.writeFileSync(RECIPES_JSON_FILE, JSON.stringify(recipes, null, 2), 'utf-8');
    res.json({ success: true, count: recipes.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// VITE INTEGRATION
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
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[C.R.A.B.S.] Full-stack server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
