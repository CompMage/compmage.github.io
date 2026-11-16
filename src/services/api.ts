import { MonthArchive, MonthlyPlacement } from '../data/competitionStandings';
import { MonthlyComp } from '../data/competitionSchedule';
import { SimpleMeetingNote } from '../data/defaultMinutes';
import { MemberRegistration, Recipe } from '../types';

const API_BASE = '/api';

export const STORAGE_KEYS = {
  STANDINGS: 'crabs_competition_standings_v2',
  LEGACY_STANDINGS: 'crabs_competition_standings_v1',
  SCHEDULE: 'crabs_competition_schedule_v1',
  MINUTES: 'crabs_meeting_minutes_v2',
  LEGACY_MINUTES: 'crabs_meeting_minutes_v1',
  ROSTER: 'crabs_member_roster_v1',
  RECIPES: 'crabs_recipes_vault_v1',
  OFFICER_PASSWORD: 'crabs_officer_password_v1',
  OFFICER_AUTH: 'crabs_officer_authenticated'
} as const;

export const SYNC_EVENTS = {
  STANDINGS: 'crabs-standings-updated',
  SCHEDULE: 'crabs-schedule-updated',
  MINUTES: 'crabs-minutes-updated',
  RECIPES: 'crabs-recipes-updated'
} as const;

export const BREWING_EXPERIENCE_OPTIONS = [
  'Just starting out / Never brewed',
  'Under 1 year (New to the hobby)',
  '1-3 years (Casual brewer)',
  '3-5 years (Regular homebrewer)',
  '5-10 years (Advanced brewer)',
  '10+ years (Homebrew veteran / Pro)'
] as const;

export function readCachedList<T>(
  key: string,
  fallback: T[],
  legacyKeyToPurge?: string,
  allowEmpty = false
): T[] {
  try {
    if (legacyKeyToPurge) {
      localStorage.removeItem(legacyKeyToPurge);
    }
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && (allowEmpty || parsed.length > 0)) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return fallback;
}

export function writeCachedList<T>(key: string, data: T[], eventName?: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (eventName) {
      window.dispatchEvent(new Event(eventName));
    }
  } catch (err) {
    console.error(`Failed to cache ${key}:`, err);
  }
}

// ==========================================
// GENERIC RESOURCE SYNC HELPERS
// ==========================================

async function fetchResource<T>(
  endpoint: string,
  cacheKey: string,
  label: string,
  cacheEmpty = true
): Promise<T[] | null> {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      if (cacheEmpty || data.length > 0) {
        writeCachedList(cacheKey, data);
      }
      return data;
    }
  } catch (err) {
    console.warn(`Failed to fetch ${label} from server, using local cache:`, err);
  }
  return null;
}

async function saveResource<T>(endpoint: string, payloadKey: string, data: T[], label: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [payloadKey]: data })
    });
    return res.ok;
  } catch (err) {
    console.error(`Failed to save ${label} to server:`, err);
    return false;
  }
}

// 1. Competition Standings
export const fetchStandings = (): Promise<MonthArchive[] | null> =>
  fetchResource<MonthArchive>('standings', STORAGE_KEYS.STANDINGS, 'standings', true);

export const saveStandingsToServer = (standings: MonthArchive[]): Promise<boolean> =>
  saveResource('standings', 'standings', standings, 'standings');

// 2. Competition Schedule
export const fetchSchedule = (): Promise<MonthlyComp[] | null> =>
  fetchResource<MonthlyComp>('schedule', STORAGE_KEYS.SCHEDULE, 'schedule', false);

export const saveScheduleToServer = (schedule: MonthlyComp[]): Promise<boolean> =>
  saveResource('schedule', 'schedule', schedule, 'schedule');

// 3. Meeting Minutes
export const fetchMinutes = (): Promise<SimpleMeetingNote[] | null> =>
  fetchResource<SimpleMeetingNote>('minutes', STORAGE_KEYS.MINUTES, 'minutes', false);

export const saveMinutesToServer = (minutes: SimpleMeetingNote[]): Promise<boolean> =>
  saveResource('minutes', 'minutes', minutes, 'minutes');

// 4. Club Roster
export const fetchRoster = (): Promise<MemberRegistration[] | null> =>
  fetchResource<MemberRegistration>('roster', STORAGE_KEYS.ROSTER, 'roster', true);

export const saveRosterToServer = (roster: MemberRegistration[]): Promise<boolean> =>
  saveResource('roster', 'roster', roster, 'roster');

// 5. Recipe Vault
export const fetchRecipes = (): Promise<Recipe[] | null> =>
  fetchResource<Recipe>('recipes', STORAGE_KEYS.RECIPES, 'recipes', false);

export const saveRecipesToServer = (recipes: Recipe[]): Promise<boolean> =>
  saveResource('recipes', 'recipes', recipes, 'recipes');

// ==========================================
// 6. SHARED CSV EXPORT & IMPORT UTILITIES
// ==========================================

export function escapeCSVField(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function triggerCSVDownload(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate CSV string from MonthArchive array
 */
export function generateStandingsCSV(standings: MonthArchive[]): string {
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
    const month = escapeCSVField(monthArchive.month);
    const styleCat = escapeCSVField(monthArchive.styleCategory);
    const bjcp = escapeCSVField(monthArchive.bjcpCode || '');
    const entries = monthArchive.entriesCount || 0;

    if (!monthArchive.standings || monthArchive.standings.length === 0) {
      rows.push([month, monthArchive.monthNumber, styleCat, bjcp, entries, '', '', '', '', ''].join(','));
    } else {
      monthArchive.standings.forEach((placement) => {
        rows.push(
          [
            month,
            monthArchive.monthNumber,
            styleCat,
            bjcp,
            entries,
            placement.place,
            placement.points,
            escapeCSVField(placement.brewer || ''),
            escapeCSVField(placement.beerName || ''),
            escapeCSVField(placement.style || '')
          ].join(',')
        );
      });
    }
  });

  return [headers.join(','), ...rows].join('\n') + '\n';
}

export function downloadStandingsCSV(standings: MonthArchive[]): void {
  const filename = `CRABS_Competition_Standings_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerCSVDownload(generateStandingsCSV(standings), filename);
}

export function downloadRosterCSV(roster: MemberRegistration[], detailed = false): void {
  if (roster.length === 0) return;

  const dateTag = new Date().toISOString().slice(0, 10);

  if (detailed) {
    const headers = [
      'Member ID',
      'Registration Date',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Membership Type',
      'Dues ($)',
      'Payment Method',
      'Brewing Experience',
      'Equipment',
      'Attended Meeting',
      'Family Members Count',
      'Family Details'
    ];
    const rows = roster.map((m) => {
      const familyDetail = m.familyMembers
        .map((f) => `${f.name} (${f.relationship}: ${f.email})`)
        .join('; ');
      return [
        escapeCSVField(m.id),
        escapeCSVField(new Date(m.createdAt).toLocaleDateString()),
        escapeCSVField(m.firstName),
        escapeCSVField(m.lastName),
        escapeCSVField(m.email),
        escapeCSVField(m.phone || ''),
        escapeCSVField(m.isFamily ? 'Family' : 'Individual'),
        m.duesAmount,
        escapeCSVField(m.paymentMethod === 'paypal' ? 'PayPal' : 'Cash at Meeting'),
        escapeCSVField(m.brewingExperience),
        escapeCSVField(m.equipment),
        escapeCSVField(m.attendedMeeting),
        m.familyMembers.length,
        escapeCSVField(familyDetail)
      ].join(',');
    });
    triggerCSVDownload([headers.join(','), ...rows].join('\n'), `CRABS_Membership_Roster_${dateTag}.csv`);
    return;
  }

  const headers = [
    'Member ID',
    'Registration Date',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Type',
    'Dues',
    'Status',
    'Experience',
    'Equipment'
  ];
  const rows = roster.map((m) =>
    [
      escapeCSVField(m.id),
      escapeCSVField(new Date(m.createdAt).toLocaleDateString()),
      escapeCSVField(m.firstName),
      escapeCSVField(m.lastName),
      escapeCSVField(m.email),
      escapeCSVField(m.phone || ''),
      escapeCSVField(m.isFamily ? 'Family' : 'Individual'),
      m.duesAmount,
      escapeCSVField(m.status),
      escapeCSVField(m.brewingExperience || ''),
      escapeCSVField(m.equipment || '')
    ].join(',')
  );
  triggerCSVDownload([headers.join(','), ...rows].join('\n'), `CRABS_Roster_${dateTag}.csv`);
}

/**
 * Robust CSV parser that handles quotes, commas inside quotes, CRLF/LF line endings
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function buildHeaderFinder(headerLine: string[]) {
  const headerMap: { [key: string]: number } = {};
  headerLine.forEach((h, idx) => {
    const clean = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    headerMap[clean] = idx;
  });
  return (...names: string[]) => {
    for (const n of names) {
      const clean = n.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (headerMap[clean] !== undefined) return headerMap[clean];
    }
    return -1;
  };
}

export function parseRosterCSVText(text: string): MemberRegistration[] {
  const rawLines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (rawLines.length < 2) {
    throw new Error('CSV must contain a header row and at least one member row.');
  }

  const findCol = buildHeaderFinder(parseCSVLine(rawLines[0]));

  const idIdx = findCol('memberid', 'id');
  const firstIdx = findCol('firstname', 'first', 'fname');
  const lastIdx = findCol('lastname', 'last', 'lname');
  const nameIdx = findCol('name', 'brewername', 'fullname', 'membername');
  const emailIdx = findCol('email', 'emailaddress', 'mail');
  const phoneIdx = findCol('phone', 'phonenumber', 'tel', 'cell');
  const typeIdx = findCol('type', 'membershiptype', 'isfamily');
  const duesIdx = findCol('dues', 'duesamount', 'amount');
  const statusIdx = findCol('status', 'duesstatus', 'paymentstatus');
  const expIdx = findCol('experience', 'brewingexperience', 'explevel');
  const equipIdx = findCol('equipment', 'brewequipment', 'gear');

  const newMembers: MemberRegistration[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const cols = parseCSVLine(rawLines[i]);
    if (cols.length === 0 || cols.every((c) => !c)) continue;

    let firstName = firstIdx !== -1 && cols[firstIdx] ? cols[firstIdx] : '';
    let lastName = lastIdx !== -1 && cols[lastIdx] ? cols[lastIdx] : '';

    if ((!firstName || !lastName) && nameIdx !== -1 && cols[nameIdx]) {
      const parts = cols[nameIdx].split(' ');
      firstName = parts[0] || 'Member';
      lastName = parts.slice(1).join(' ') || 'Brew';
    }

    if (!firstName && !lastName) {
      firstName = 'Member';
      lastName = `${i}`;
    }

    const email =
      emailIdx !== -1 && cols[emailIdx] ? cols[emailIdx] : `member_${Date.now()}_${i}@crabsbrew.org`;
    const phone = phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx] : undefined;
    const memberId =
      idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `CRABS-${Math.floor(1000 + Math.random() * 9000)}`;

    const isFamilyRaw = typeIdx !== -1 && cols[typeIdx] ? cols[typeIdx].toLowerCase() : '';
    const isFamily = isFamilyRaw.includes('family') || isFamilyRaw === 'true';

    const duesRaw =
      duesIdx !== -1 && cols[duesIdx] ? parseFloat(cols[duesIdx].replace(/[^0-9.]/g, '')) : NaN;
    const duesAmount = !isNaN(duesRaw) ? duesRaw : isFamily ? 40 : 25;

    const statusRaw = statusIdx !== -1 && cols[statusIdx] ? cols[statusIdx].toLowerCase() : '';
    const status: 'verified' | 'pending' = statusRaw.includes('pending') ? 'pending' : 'verified';

    const experience =
      expIdx !== -1 && cols[expIdx] ? cols[expIdx] : '3-5 years (Regular homebrewer)';
    const equipment = equipIdx !== -1 && cols[equipIdx] ? cols[equipIdx] : 'All-Grain BIAB';

    newMembers.push({
      id: memberId,
      createdAt: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone,
      brewingExperience: experience,
      equipment,
      attendedMeeting: 'yes',
      isFamily,
      familyMembers: [],
      paymentMethod: 'paypal',
      duesAmount,
      status
    });
  }

  return newMembers;
}

const MONTH_NUMBERS: { [key: string]: number } = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12
};

const DEFAULT_POINTS_BY_PLACE: { [place: number]: number } = {
  1: 10,
  2: 7,
  3: 5,
  4: 3,
  5: 2
};

/**
 * Parse CSV text into MonthArchive[]
 * Supports row-by-row placements and column-based (1st Place .. 5th Place) formats.
 */
export function parseStandingsCSVText(text: string): MonthArchive[] {
  const rawLines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (rawLines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const findCol = buildHeaderFinder(parseCSVLine(rawLines[0]));

  const monthIdx = findCol('month', 'competitionmonth', 'flightmonth');
  const monthNumIdx = findCol('monthnumber', 'monthnum');
  const catIdx = findCol('stylecategory', 'category', 'theme', 'style');
  const bjcpIdx = findCol('bjcpcode', 'bjcp');
  const entriesIdx = findCol('entriescount', 'entries', 'count');
  const placeIdx = findCol('place', 'rank', 'finish');
  const pointsIdx = findCol('points', 'pts', 'score');
  const brewerIdx = findCol('brewer', 'brewername', 'name', 'winner');
  const beerNameIdx = findCol('beername', 'beer', 'entryname');
  const styleIdx = findCol('beerstyle', 'style', 'substyle');

  const firstCol = findCol('1st', 'first', 'firstplace', '1stplace');
  const secondCol = findCol('2nd', 'second', 'secondplace', '2ndplace');
  const thirdCol = findCol('3rd', 'third', 'thirdplace', '3rdplace');
  const fourthCol = findCol('4th', 'fourth', 'fourthplace', '4thplace');
  const fifthCol = findCol('5th', 'fifth', 'fifthplace', '5thplace');

  const monthMap: { [monthKey: string]: MonthArchive } = {};

  if (firstCol !== -1 || secondCol !== -1) {
    for (let i = 1; i < rawLines.length; i++) {
      const cols = parseCSVLine(rawLines[i]);
      if (cols.length === 0 || cols.every((c) => !c)) continue;

      const rawMonth = monthIdx !== -1 && cols[monthIdx] ? cols[monthIdx] : `Flight ${i}`;
      const styleCategory = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Open Style';
      const bjcpCode = bjcpIdx !== -1 && cols[bjcpIdx] ? cols[bjcpIdx] : '';
      const entriesCount =
        entriesIdx !== -1 && cols[entriesIdx] ? parseInt(cols[entriesIdx], 10) || 10 : 10;

      const monthClean = rawMonth.trim().toLowerCase();
      const monthNum = MONTH_NUMBERS[monthClean] || i;

      const standings: MonthlyPlacement[] = [];
      const colDefs = [
        { col: firstCol, place: 1, pts: 10 },
        { col: secondCol, place: 2, pts: 7 },
        { col: thirdCol, place: 3, pts: 5 },
        { col: fourthCol, place: 4, pts: 3 },
        { col: fifthCol, place: 5, pts: 2 }
      ];

      colDefs.forEach(({ col, place, pts }) => {
        if (col !== -1 && cols[col] && cols[col].trim()) {
          standings.push({
            place,
            points: pts,
            brewer: cols[col].trim(),
            style: styleCategory
          });
        }
      });

      monthMap[rawMonth.trim()] = {
        month: rawMonth.trim(),
        monthNumber: monthNum,
        styleCategory,
        bjcpCode,
        entriesCount,
        standings
      };
    }
  } else {
    for (let i = 1; i < rawLines.length; i++) {
      const cols = parseCSVLine(rawLines[i]);
      if (cols.length === 0 || cols.every((c) => !c)) continue;

      const rawMonth = monthIdx !== -1 && cols[monthIdx] ? cols[monthIdx] : 'Unknown Month';
      const monthTrimmed = rawMonth.trim();
      const monthClean = monthTrimmed.toLowerCase();
      const detectedNum =
        monthNumIdx !== -1 && cols[monthNumIdx] ? parseInt(cols[monthNumIdx], 10) : NaN;
      const monthNum = !isNaN(detectedNum) ? detectedNum : MONTH_NUMBERS[monthClean] || 1;

      const styleCategory = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Open Style';
      const bjcpCode = bjcpIdx !== -1 && cols[bjcpIdx] ? cols[bjcpIdx] : '';
      const entriesCount =
        entriesIdx !== -1 && cols[entriesIdx] ? parseInt(cols[entriesIdx], 10) || 10 : 10;

      if (!monthMap[monthTrimmed]) {
        monthMap[monthTrimmed] = {
          month: monthTrimmed,
          monthNumber: monthNum,
          styleCategory,
          bjcpCode,
          entriesCount,
          standings: []
        };
      }

      const brewer = brewerIdx !== -1 && cols[brewerIdx] ? cols[brewerIdx].trim() : '';
      const placeRaw =
        placeIdx !== -1 && cols[placeIdx]
          ? parseInt(cols[placeIdx].replace(/[^0-9]/g, ''), 10)
          : NaN;

      if (brewer && !isNaN(placeRaw)) {
        const pointsRaw =
          pointsIdx !== -1 && cols[pointsIdx] ? parseInt(cols[pointsIdx], 10) : NaN;
        const points = !isNaN(pointsRaw) ? pointsRaw : DEFAULT_POINTS_BY_PLACE[placeRaw] || 0;
        const beerName = beerNameIdx !== -1 && cols[beerNameIdx] ? cols[beerNameIdx].trim() : undefined;
        const style = styleIdx !== -1 && cols[styleIdx] ? cols[styleIdx].trim() : styleCategory;

        monthMap[monthTrimmed].standings.push({
          place: placeRaw,
          points,
          brewer,
          beerName,
          style
        });
      }
    }
  }

  const result = Object.values(monthMap);
  result.forEach((m) => {
    m.standings.sort((a, b) => a.place - b.place);
  });
  return result;
}
