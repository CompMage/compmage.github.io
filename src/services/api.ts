import { MonthArchive, MonthlyPlacement } from '../data/competitionStandings';
import { MonthlyComp } from '../data/competitionSchedule';
import { SimpleMeetingNote } from '../data/defaultMinutes';
import { MemberRegistration, Recipe } from '../types';

const API_BASE = '/api';

// ==========================================
// 1. COMPETITION STANDINGS API
// ==========================================

export async function fetchStandings(): Promise<MonthArchive[] | null> {
  try {
    const res = await fetch(`${API_BASE}/standings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      // Cache to localStorage for offline resilience
      try {
        localStorage.setItem('crabs_competition_standings_v2', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch standings from server, using local cache:', err);
  }
  return null;
}

export async function saveStandingsToServer(standings: MonthArchive[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/standings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ standings })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save standings to server:', err);
    return false;
  }
}

// ==========================================
// 2. COMPETITION SCHEDULE API
// ==========================================

export async function fetchSchedule(): Promise<MonthlyComp[] | null> {
  try {
    const res = await fetch(`${API_BASE}/schedule`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      try {
        localStorage.setItem('crabs_competition_schedule_v1', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch schedule from server, using local cache:', err);
  }
  return null;
}

export async function saveScheduleToServer(schedule: MonthlyComp[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save schedule to server:', err);
    return false;
  }
}

// ==========================================
// 3. MEETING MINUTES API
// ==========================================

export async function fetchMinutes(): Promise<SimpleMeetingNote[] | null> {
  try {
    const res = await fetch(`${API_BASE}/minutes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      try {
        localStorage.setItem('crabs_meeting_minutes_v2', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch minutes from server, using local cache:', err);
  }
  return null;
}

export async function saveMinutesToServer(minutes: SimpleMeetingNote[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/minutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save minutes to server:', err);
    return false;
  }
}

// ==========================================
// 4. CLUB ROSTER API
// ==========================================

export async function fetchRoster(): Promise<MemberRegistration[] | null> {
  try {
    const res = await fetch(`${API_BASE}/roster`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      try {
        localStorage.setItem('crabs_member_roster_v1', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch roster from server, using local cache:', err);
  }
  return null;
}

export async function saveRosterToServer(roster: MemberRegistration[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/roster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roster })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save roster to server:', err);
    return false;
  }
}

// ==========================================
// 5. RECIPE VAULT API
// ==========================================

export async function fetchRecipes(): Promise<Recipe[] | null> {
  try {
    const res = await fetch(`${API_BASE}/recipes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      try {
        localStorage.setItem('crabs_recipes_vault_v1', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch recipes from server, using local cache:', err);
  }
  return null;
}

export async function saveRecipesToServer(recipes: Recipe[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipes })
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save recipes to server:', err);
    return false;
  }
}

// ==========================================
// 6. CSV EXPORT & IMPORT UTILITIES
// ==========================================

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
    if (!monthArchive.standings || monthArchive.standings.length === 0) {
      // Row with empty standings
      rows.push(
        [
          `"${monthArchive.month}"`,
          monthArchive.monthNumber,
          `"${monthArchive.styleCategory}"`,
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
      monthArchive.standings.forEach((placement) => {
        rows.push(
          [
            `"${monthArchive.month}"`,
            monthArchive.monthNumber,
            `"${monthArchive.styleCategory}"`,
            `"${monthArchive.bjcpCode || ''}"`,
            monthArchive.entriesCount || 0,
            placement.place,
            placement.points,
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

/**
 * Trigger client-side browser file download of CSV
 */
export function downloadStandingsCSV(standings: MonthArchive[]): void {
  const blob = new Blob([generateStandingsCSV(standings)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CRABS_Competition_Standings_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
 * Supports:
 * Format A: Row-by-row placement: Month, Category, Place, Points, Brewer, Beer Name, Style
 * Format B: Column-based: Month, Theme, 1st Place, 2nd Place, 3rd Place, 4th Place, 5th Place
 */
export function parseStandingsCSVText(text: string): MonthArchive[] {
  const rawLines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (rawLines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headerLine = parseCSVLine(rawLines[0]);
  const headerMap: { [key: string]: number } = {};
  headerLine.forEach((h, idx) => {
    const clean = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    headerMap[clean] = idx;
  });

  const findCol = (...names: string[]) => {
    for (const n of names) {
      const clean = n.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (headerMap[clean] !== undefined) return headerMap[clean];
    }
    return -1;
  };

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

  // Check for column-based format (1st Place, 2nd Place, etc.)
  const firstCol = findCol('1st', 'first', 'firstplace', '1stplace');
  const secondCol = findCol('2nd', 'second', 'secondplace', '2ndplace');
  const thirdCol = findCol('3rd', 'third', 'thirdplace', '3rdplace');
  const fourthCol = findCol('4th', 'fourth', 'fourthplace', '4thplace');
  const fifthCol = findCol('5th', 'fifth', 'fifthplace', '5thplace');

  const monthMap: { [monthKey: string]: MonthArchive } = {};

  if (firstCol !== -1 || secondCol !== -1) {
    // Format B: Column-based placings
    for (let i = 1; i < rawLines.length; i++) {
      const cols = parseCSVLine(rawLines[i]);
      if (cols.length === 0 || cols.every((c) => !c)) continue;

      const rawMonth = monthIdx !== -1 && cols[monthIdx] ? cols[monthIdx] : `Flight ${i}`;
      const styleCategory = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Open Style';
      const bjcpCode = bjcpIdx !== -1 && cols[bjcpIdx] ? cols[bjcpIdx] : '';
      const entriesCount = entriesIdx !== -1 && cols[entriesIdx] ? parseInt(cols[entriesIdx], 10) || 10 : 10;

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
    // Format A: Row-by-row placement
    for (let i = 1; i < rawLines.length; i++) {
      const cols = parseCSVLine(rawLines[i]);
      if (cols.length === 0 || cols.every((c) => !c)) continue;

      const rawMonth = monthIdx !== -1 && cols[monthIdx] ? cols[monthIdx] : 'Unknown Month';
      const monthTrimmed = rawMonth.trim();
      const monthClean = monthTrimmed.toLowerCase();
      const detectedNum = monthNumIdx !== -1 && cols[monthNumIdx] ? parseInt(cols[monthNumIdx], 10) : NaN;
      const monthNum = !isNaN(detectedNum) ? detectedNum : (MONTH_NUMBERS[monthClean] || 1);

      const styleCategory = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'Open Style';
      const bjcpCode = bjcpIdx !== -1 && cols[bjcpIdx] ? cols[bjcpIdx] : '';
      const entriesCount = entriesIdx !== -1 && cols[entriesIdx] ? parseInt(cols[entriesIdx], 10) || 10 : 10;

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

      // Add placement if row has brewer and place
      const brewer = brewerIdx !== -1 && cols[brewerIdx] ? cols[brewerIdx].trim() : '';
      const placeRaw = placeIdx !== -1 && cols[placeIdx] ? parseInt(cols[placeIdx].replace(/[^0-9]/g, ''), 10) : NaN;

      if (brewer && !isNaN(placeRaw)) {
        const pointsRaw = pointsIdx !== -1 && cols[pointsIdx] ? parseInt(cols[pointsIdx], 10) : NaN;
        const points = !isNaN(pointsRaw) ? pointsRaw : (DEFAULT_POINTS_BY_PLACE[placeRaw] || 0);
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

  // Sort months by monthNumber ascending or descending
  const result = Object.values(monthMap);
  result.forEach((m) => {
    m.standings.sort((a, b) => a.place - b.place);
  });
  return result;
}
