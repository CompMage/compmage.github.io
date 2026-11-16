import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

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

// Serve logo and static images stored in /images off the root
const IMAGES_DIR = path.resolve(__dirname, 'images');
if (fs.existsSync(IMAGES_DIR)) {
  app.use(
    '/images',
    express.static(IMAGES_DIR, {
      maxAge: '1y',
      immutable: true
    })
  );
}

const DB_FILE = path.join(DATA_DIR, 'crabs.db');
const LEGACY_STANDINGS_JSON = path.join(DATA_DIR, 'standings.json');
const LEGACY_STANDINGS_CSV = path.join(DATA_DIR, 'standings.csv');
const LEGACY_SCHEDULE_JSON = path.join(DATA_DIR, 'schedule.json');
const LEGACY_MINUTES_JSON = path.join(DATA_DIR, 'minutes.json');
const LEGACY_RECIPES_JSON = path.join(DATA_DIR, 'recipes.json');
const LEGACY_ROSTER_JSON = path.join(DATA_DIR, 'roster.json');

const SEED_ANNUAL_SCHEDULE = [
  {
    month: 'January',
    monthNumber: 1,
    styleCategory: 'Hedonistic',
    bjcpCode: 'Open / No Rules',
    description: 'No rules/no styles - bring your best beer.',
    meetingDate: 'Jan 21, 2026',
    entryGuidelines: [
      'No rules/no styles - bring your best beer!',
      'Any beer style, ABV, or brewing technique welcome.',
      'Judging focused on overall brewing excellence, flavor harmony, and enjoyment.'
    ],
    isCurrentMonth: false
  },
  {
    month: 'February',
    monthNumber: 2,
    styleCategory: 'UK Beers',
    bjcpCode: 'BJCP 11A-C, 14A-C, 15A',
    description: 'British Bitter, Scottish Ale, and Irish Red Ale.',
    meetingDate: 'Feb 18, 2026',
    entryGuidelines: [
      '11 A-C: British Bitter',
      '14 A-C: Scottish Ale',
      '15 A only: Irish Red Ale'
    ],
    isCurrentMonth: false
  },
  {
    month: 'March',
    monthNumber: 3,
    styleCategory: 'Belgian & Trappist',
    bjcpCode: 'BJCP 24B-C, 25A-B, 26A-C',
    description: 'Belgian Ale, Strong Belgian Ale, and Monastic Ale.',
    meetingDate: 'Mar 18, 2026',
    entryGuidelines: [
      '24 B-C (no A): Belgian Ale',
      '25 A-B (no C): Strong Belgian Ale',
      '26 A-C (no D): Monastic Ale'
    ],
    isCurrentMonth: false
  },
  {
    month: 'April',
    monthNumber: 4,
    styleCategory: 'IPAs',
    bjcpCode: 'BJCP 12C, 21A-C',
    description: 'English IPA and American, Specialty & Hazy IPAs.',
    meetingDate: 'Apr 15, 2026',
    entryGuidelines: [
      '12 C only: English IPA',
      '21 A-C: IPA (American, Specialty, Hazy)'
    ],
    isCurrentMonth: false
  },
  {
    month: 'May',
    monthNumber: 5,
    styleCategory: 'Pale, Malty',
    bjcpCode: 'BJCP 1A-C, 2A, 3A-B, 4A-C',
    description:
      'Standard American Beer, International Pale Lager, Czech Pale & Premium Lager, and Pale Malty European Lager.',
    meetingDate: 'May 20, 2026',
    entryGuidelines: [
      '1 A-C (no D): Standard American Beer',
      '2 A only: International Pale Lager',
      '3 A-B: Czech Pale & Premium Lager',
      '4 A-C: Pale Malty European Lager'
    ],
    isCurrentMonth: false
  },
  {
    month: 'June',
    monthNumber: 6,
    styleCategory: 'Sapwood Cellars Clone (TBD)',
    bjcpCode: 'Sapwood Cellars Official Clone Recipe',
    description:
      'Recipe provided by Sapwood Cellars. Sapwood brewers will judge and select the top 5 beers. Competition held at Sapwood Cellars.',
    meetingDate: 'Jun 17, 2026',
    entryGuidelines: [
      'Recipe provided by Sapwood Cellars.',
      'Sapwood brewers will judge and select the top 5 beers.',
      'Competition held at Sapwood Cellars.'
    ],
    isCurrentMonth: false
  },
  {
    month: 'July',
    monthNumber: 7,
    styleCategory: 'Session Beers',
    bjcpCode: 'Anything under 4.5% ABV',
    description: 'Anything under 4.5% ABV across any style.',
    meetingDate: 'Jul 15, 2026',
    entryGuidelines: [
      'Anything under 4.5% ABV.',
      'Any base style is permitted as long as ABV remains strictly below 4.5%.',
      'Measured original and final gravity recommended on entry label.'
    ],
    isCurrentMonth: false
  },
  {
    month: 'August',
    monthNumber: 8,
    styleCategory: 'No Competition',
    bjcpCode: 'Summer Club Social & Bottle Share',
    description: 'No formal competition this month. Enjoy open tastings and social time.',
    meetingDate: 'Aug 19, 2026',
    entryGuidelines: [
      'No formal points competition this month.',
      'Members are invited to bring homebrews or commercial bottles to share casually.'
    ],
    isCurrentMonth: false
  },
  {
    month: 'September',
    monthNumber: 9,
    styleCategory: 'Pale, Bitter / Hoppy',
    bjcpCode: 'BJCP 5A-D, 12A-B, 18A-B',
    description: 'Pale Bitter European Beer, Pale Commonwealth Beer, and Pale American Ale.',
    meetingDate: 'Sep 16, 2026',
    entryGuidelines: [
      '5 A-D: Pale Bitter European Beer',
      '12 A-B (no C): Pale Commonwealth Beer',
      '18 A-B: Pale American Ale'
    ],
    isCurrentMonth: false
  },
  {
    month: 'October',
    monthNumber: 10,
    styleCategory: 'Amber / Dark, Malty',
    bjcpCode: 'BJCP 2B-C, 3C-D, 6A-C, 8A-B',
    description:
      'International Amber & Dark Lagers, Czech Amber & Dark Lagers, Amber Malty European Lager, and Dark European Lager.',
    meetingDate: 'Oct 21, 2026',
    entryGuidelines: [
      '2 B-C: International Amber & Dark Lagers',
      '3 C-D: Czech Amber & Dark Lagers',
      '6 A-C: Amber Malty European Lager',
      '8 A-B: Dark European Lager'
    ],
    isCurrentMonth: false
  },
  {
    month: 'November',
    monthNumber: 11,
    styleCategory: 'Porters & Stouts',
    bjcpCode: 'BJCP 13C, 15B-C, 16A-D, 20A-B',
    description: 'English Porter, Irish Stout, Dark British Beer, and American Porter and Stout.',
    meetingDate: 'Nov 18, 2026',
    entryGuidelines: [
      '13 C only: English Porter',
      '15 B-C: Irish Stout',
      '16 A-D: Dark British Beer',
      '20 A-B (no C): American Porter and Stout'
    ],
    isCurrentMonth: true
  },
  {
    month: 'December',
    monthNumber: 12,
    styleCategory: 'Holiday Party',
    bjcpCode: 'Annual Club Gathering',
    description: 'Holiday Party and year-end celebration with club awards!',
    meetingDate: 'Dec 16, 2026',
    entryGuidelines: [
      'Annual C.R.A.B.S. Holiday Party!',
      'Potluck food, holiday beers, and crowning of the Brewer of the Year.'
    ],
    isCurrentMonth: false
  }
];

// ==========================================
// SQLITE INITIALIZATION & SCHEMA
// ==========================================

const db = new DatabaseSync(DB_FILE);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS db_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    name TEXT NOT NULL,
    style TEXT NOT NULL,
    category TEXT NOT NULL,
    brewer TEXT NOT NULL,
    og TEXT NOT NULL,
    fg TEXT NOT NULL,
    abv TEXT NOT NULL,
    ibu INTEGER NOT NULL,
    srm INTEGER NOT NULL,
    batch_size TEXT NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    fermentables_json TEXT NOT NULL,
    hops_json TEXT NOT NULL,
    yeast TEXT NOT NULL,
    mash_temp TEXT NOT NULL,
    fermentation_temp TEXT NOT NULL,
    cask_conditioned INTEGER NOT NULL DEFAULT 0,
    award TEXT
  );

  CREATE TABLE IF NOT EXISTS roster (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    brewing_experience TEXT NOT NULL,
    equipment TEXT NOT NULL,
    attended_meeting TEXT NOT NULL,
    is_family INTEGER NOT NULL DEFAULT 0,
    family_members_json TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    dues_amount REAL NOT NULL,
    status TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS standings_months (
    month TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    month_number INTEGER NOT NULL,
    style_category TEXT NOT NULL,
    bjcp_code TEXT NOT NULL,
    entries_count INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS standings_placements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL REFERENCES standings_months(month) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    place INTEGER NOT NULL,
    points INTEGER NOT NULL,
    brewer TEXT NOT NULL,
    beer_name TEXT,
    style TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS competition_schedule (
    month TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    month_number INTEGER NOT NULL,
    style_category TEXT NOT NULL,
    bjcp_code TEXT NOT NULL,
    description TEXT NOT NULL,
    meeting_date TEXT NOT NULL,
    entry_guidelines_json TEXT NOT NULL,
    is_current_month INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS meeting_minutes (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    month TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT NOT NULL
  );
`);

function withTransaction<T>(fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {}
    throw err;
  }
}

function safeParseJSONArray(raw: unknown): any[] {
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLegacyJSONArray(filePath: string): any[] | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.error(`Failed to read legacy JSON file ${filePath}:`, err);
    return null;
  }
}

function getMeta(key: string): string | null {
  const row = db.prepare('SELECT value FROM db_meta WHERE key = ?').get(key) as
    | { value?: string }
    | undefined;
  return row?.value ?? null;
}

function setMeta(key: string, value: string): void {
  db.prepare('INSERT OR REPLACE INTO db_meta (key, value) VALUES (?, ?)').run(key, value);
}

// ==========================================
// SQLITE DATA ACCESSORS
// ==========================================

function readRecipes(): any[] {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY sort_order ASC').all() as any[];
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    style: String(row.style),
    category: String(row.category),
    brewer: String(row.brewer),
    og: String(row.og),
    fg: String(row.fg),
    abv: String(row.abv),
    ibu: Number(row.ibu),
    srm: Number(row.srm),
    batchSize: String(row.batch_size),
    description: String(row.description),
    ...(row.notes !== null && row.notes !== undefined ? { notes: String(row.notes) } : {}),
    fermentables: safeParseJSONArray(row.fermentables_json),
    hops: safeParseJSONArray(row.hops_json),
    yeast: String(row.yeast),
    mashTemp: String(row.mash_temp),
    fermentationTemp: String(row.fermentation_temp),
    caskConditioned: Boolean(row.cask_conditioned),
    ...(row.award !== null && row.award !== undefined ? { award: String(row.award) } : {})
  }));
}

function writeRecipes(recipes: any[]): void {
  withTransaction(() => {
    db.exec('DELETE FROM recipes');
    const insert = db.prepare(`
      INSERT OR REPLACE INTO recipes (
        id, sort_order, name, style, category, brewer, og, fg, abv, ibu, srm,
        batch_size, description, notes, fermentables_json, hops_json, yeast,
        mash_temp, fermentation_temp, cask_conditioned, award
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    recipes.forEach((r, idx) => {
      insert.run(
        String(r.id || `recipe_${idx}`),
        idx,
        String(r.name || ''),
        String(r.style || ''),
        String(r.category || 'real-ale'),
        String(r.brewer || ''),
        String(r.og || ''),
        String(r.fg || ''),
        String(r.abv || ''),
        Number(r.ibu) || 0,
        Number(r.srm) || 0,
        String(r.batchSize || ''),
        String(r.description || ''),
        r.notes !== undefined && r.notes !== null ? String(r.notes) : null,
        JSON.stringify(Array.isArray(r.fermentables) ? r.fermentables : []),
        JSON.stringify(Array.isArray(r.hops) ? r.hops : []),
        String(r.yeast || ''),
        String(r.mashTemp || ''),
        String(r.fermentationTemp || ''),
        r.caskConditioned ? 1 : 0,
        r.award !== undefined && r.award !== null ? String(r.award) : null
      );
    });
  });
}

function readRoster(): any[] {
  const rows = db.prepare('SELECT * FROM roster ORDER BY sort_order ASC').all() as any[];
  return rows.map((row) => ({
    id: String(row.id),
    createdAt: String(row.created_at),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    email: String(row.email),
    ...(row.phone !== null && row.phone !== undefined ? { phone: String(row.phone) } : {}),
    brewingExperience: String(row.brewing_experience),
    equipment: String(row.equipment),
    attendedMeeting: String(row.attended_meeting),
    isFamily: Boolean(row.is_family),
    familyMembers: safeParseJSONArray(row.family_members_json),
    paymentMethod: String(row.payment_method),
    duesAmount: Number(row.dues_amount),
    status: String(row.status),
    ...(row.notes !== null && row.notes !== undefined ? { notes: String(row.notes) } : {})
  }));
}

function writeRoster(roster: any[]): void {
  withTransaction(() => {
    db.exec('DELETE FROM roster');
    const insert = db.prepare(`
      INSERT OR REPLACE INTO roster (
        id, sort_order, created_at, first_name, last_name, email, phone,
        brewing_experience, equipment, attended_meeting, is_family,
        family_members_json, payment_method, dues_amount, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    roster.forEach((m, idx) => {
      insert.run(
        String(m.id || `CRABS-${idx}`),
        idx,
        String(m.createdAt || new Date().toISOString()),
        String(m.firstName || ''),
        String(m.lastName || ''),
        String(m.email || ''),
        m.phone !== undefined && m.phone !== null ? String(m.phone) : null,
        String(m.brewingExperience || ''),
        String(m.equipment || ''),
        String(m.attendedMeeting || 'yes'),
        m.isFamily ? 1 : 0,
        JSON.stringify(Array.isArray(m.familyMembers) ? m.familyMembers : []),
        String(m.paymentMethod || 'paypal'),
        Number(m.duesAmount) || 0,
        String(m.status || 'pending'),
        m.notes !== undefined && m.notes !== null ? String(m.notes) : null
      );
    });
  });
}

function readStandings(): any[] {
  const months = db
    .prepare('SELECT * FROM standings_months ORDER BY sort_order ASC')
    .all() as any[];
  const placements = db
    .prepare('SELECT * FROM standings_placements ORDER BY sort_order ASC, id ASC')
    .all() as any[];

  const placementsByMonth = new Map<string, any[]>();
  for (const p of placements) {
    const monthKey = String(p.month);
    if (!placementsByMonth.has(monthKey)) {
      placementsByMonth.set(monthKey, []);
    }
    placementsByMonth.get(monthKey)!.push({
      place: Number(p.place),
      points: Number(p.points),
      brewer: String(p.brewer),
      beerName: p.beer_name !== null && p.beer_name !== undefined ? String(p.beer_name) : '',
      style: String(p.style)
    });
  }

  return months.map((m) => ({
    month: String(m.month),
    monthNumber: Number(m.month_number),
    styleCategory: String(m.style_category),
    bjcpCode: String(m.bjcp_code),
    entriesCount: Number(m.entries_count),
    standings: placementsByMonth.get(String(m.month)) || []
  }));
}

function writeStandings(standings: any[]): void {
  withTransaction(() => {
    db.exec('DELETE FROM standings_placements');
    db.exec('DELETE FROM standings_months');

    const insertMonth = db.prepare(`
      INSERT OR REPLACE INTO standings_months (
        month, sort_order, month_number, style_category, bjcp_code, entries_count
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertPlacement = db.prepare(`
      INSERT INTO standings_placements (
        month, sort_order, place, points, brewer, beer_name, style
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    standings.forEach((m, mIdx) => {
      const monthName = String(m.month || `Month ${mIdx + 1}`);
      insertMonth.run(
        monthName,
        mIdx,
        Number(m.monthNumber) || mIdx + 1,
        String(m.styleCategory || ''),
        String(m.bjcpCode || ''),
        Number(m.entriesCount) || 0
      );

      if (Array.isArray(m.standings)) {
        m.standings.forEach((p: any, pIdx: number) => {
          insertPlacement.run(
            monthName,
            pIdx,
            Number(p.place) || pIdx + 1,
            Number(p.points) || 0,
            String(p.brewer || ''),
            p.beerName !== undefined && p.beerName !== null ? String(p.beerName) : '',
            String(p.style || m.styleCategory || '')
          );
        });
      }
    });
  });
}

function readSchedule(): any[] {
  const rows = db
    .prepare('SELECT * FROM competition_schedule ORDER BY sort_order ASC')
    .all() as any[];
  return rows.map((row) => ({
    month: String(row.month),
    monthNumber: Number(row.month_number),
    styleCategory: String(row.style_category),
    bjcpCode: String(row.bjcp_code),
    description: String(row.description),
    meetingDate: String(row.meeting_date),
    entryGuidelines: safeParseJSONArray(row.entry_guidelines_json).map(String),
    isCurrentMonth: Boolean(row.is_current_month)
  }));
}

function writeSchedule(schedule: any[]): void {
  withTransaction(() => {
    db.exec('DELETE FROM competition_schedule');
    const insert = db.prepare(`
      INSERT OR REPLACE INTO competition_schedule (
        month, sort_order, month_number, style_category, bjcp_code,
        description, meeting_date, entry_guidelines_json, is_current_month
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    schedule.forEach((item, idx) => {
      insert.run(
        String(item.month || `Month ${idx + 1}`),
        idx,
        Number(item.monthNumber) || idx + 1,
        String(item.styleCategory || ''),
        String(item.bjcpCode || ''),
        String(item.description || ''),
        String(item.meetingDate || ''),
        JSON.stringify(Array.isArray(item.entryGuidelines) ? item.entryGuidelines : []),
        item.isCurrentMonth ? 1 : 0
      );
    });
  });
}

function readMinutes(): any[] {
  const rows = db
    .prepare('SELECT * FROM meeting_minutes ORDER BY sort_order ASC')
    .all() as any[];
  return rows.map((row) => ({
    id: String(row.id),
    month: String(row.month),
    date: String(row.date),
    notes: String(row.notes)
  }));
}

function writeMinutes(minutes: any[]): void {
  withTransaction(() => {
    db.exec('DELETE FROM meeting_minutes');
    const insert = db.prepare(`
      INSERT OR REPLACE INTO meeting_minutes (
        id, sort_order, month, date, notes
      ) VALUES (?, ?, ?, ?, ?)
    `);
    minutes.forEach((item, idx) => {
      insert.run(
        String(item.id || `minute_${idx}`),
        idx,
        String(item.month || ''),
        String(item.date || ''),
        String(item.notes || '')
      );
    });
  });
}

// ==========================================
// ONE-TIME MIGRATION FROM LEGACY FLAT FILES
// ==========================================

function migrateLegacyData(): void {
  if (!getMeta('migrated_recipes')) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM recipes').get() as any).c;
    if (count === 0) {
      const legacy = readLegacyJSONArray(LEGACY_RECIPES_JSON);
      if (legacy && legacy.length > 0) writeRecipes(legacy);
    }
    setMeta('migrated_recipes', '1');
  }

  if (!getMeta('migrated_roster')) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM roster').get() as any).c;
    if (count === 0) {
      const legacy = readLegacyJSONArray(LEGACY_ROSTER_JSON);
      if (legacy && legacy.length > 0) writeRoster(legacy);
    }
    setMeta('migrated_roster', '1');
  }

  if (!getMeta('migrated_standings')) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM standings_months').get() as any).c;
    if (count === 0) {
      const legacy = readLegacyJSONArray(LEGACY_STANDINGS_JSON);
      if (legacy && legacy.length > 0) writeStandings(legacy);
    }
    setMeta('migrated_standings', '1');
  }

  if (!getMeta('migrated_schedule')) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM competition_schedule').get() as any).c;
    if (count === 0) {
      const legacy = readLegacyJSONArray(LEGACY_SCHEDULE_JSON);
      writeSchedule(legacy && legacy.length > 0 ? legacy : SEED_ANNUAL_SCHEDULE);
    }
    setMeta('migrated_schedule', '1');
  }

  if (!getMeta('migrated_minutes')) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM meeting_minutes').get() as any).c;
    if (count === 0) {
      const legacy = readLegacyJSONArray(LEGACY_MINUTES_JSON);
      if (legacy && legacy.length > 0) writeMinutes(legacy);
    }
    setMeta('migrated_minutes', '1');
  }

  // Remove superseded flat JSON/CSV files once safely persisted in SQLite
  for (const legacyFile of [
    LEGACY_RECIPES_JSON,
    LEGACY_ROSTER_JSON,
    LEGACY_STANDINGS_JSON,
    LEGACY_STANDINGS_CSV,
    LEGACY_SCHEDULE_JSON,
    LEGACY_MINUTES_JSON
  ]) {
    try {
      if (fs.existsSync(legacyFile)) {
        fs.unlinkSync(legacyFile);
      }
    } catch (err) {
      console.warn(`Could not remove legacy file ${legacyFile}:`, err);
    }
  }
}

migrateLegacyData();

// ==========================================
// CSV & ROUTE HELPERS
// ==========================================

// RFC-4180 CSV field escaping to preserve quotes, commas, and newlines safely
function escapeCSVField(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
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

function registerSQLiteArrayEndpoint(
  routePath: string,
  bodyKey: string,
  reader: () => any[],
  writer: (items: any[]) => void
): void {
  app.get(routePath, (_req: Request, res: Response) => {
    try {
      res.setHeader('Cache-Control', 'no-store');
      res.json(reader());
    } catch (err: any) {
      res.status(500).json({ error: err?.message || `Failed to load ${bodyKey}` });
    }
  });

  app.post(routePath, (req: Request, res: Response) => {
    try {
      const payload = Array.isArray(req.body) ? req.body : req.body?.[bodyKey];
      if (!Array.isArray(payload)) {
        return res.status(400).json({ error: `${bodyKey} array required` });
      }
      writer(payload);
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, count: payload.length });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || `Failed to save ${bodyKey}` });
    }
  });
}

// ==========================================
// API ROUTES (SQLite-backed)
// ==========================================

app.get('/api/health', (_req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.setHeader('Cache-Control', 'no-store');
    res.json({ status: 'ok', storage: 'sqlite', uptime: Math.round(process.uptime()) });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err?.message || 'SQLite unavailable' });
  }
});

registerSQLiteArrayEndpoint('/api/standings', 'standings', readStandings, writeStandings);
registerSQLiteArrayEndpoint('/api/schedule', 'schedule', readSchedule, writeSchedule);
registerSQLiteArrayEndpoint('/api/minutes', 'minutes', readMinutes, writeMinutes);
registerSQLiteArrayEndpoint('/api/roster', 'roster', readRoster, writeRoster);
registerSQLiteArrayEndpoint('/api/recipes', 'recipes', readRecipes, writeRecipes);

app.get('/api/standings/csv', (_req, res) => {
  try {
    const csvContent = standingsToCSV(readStandings());
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=CRABS_Standings_${new Date().toISOString().slice(0, 10)}.csv`
    );
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to export standings CSV' });
  }
});

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
      `[C.R.A.B.S.] Full-stack SQLite server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`
    );
  });
}

function shutdown(): void {
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
    db.close();
  } catch {}
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
