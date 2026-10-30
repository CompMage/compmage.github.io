export interface MonthlyPlacement {
  place: number;
  points: number;
  brewer: string;
  beerName: string;
  style: string;
}

export interface MonthArchive {
  month: string;
  monthNumber: number;
  styleCategory: string;
  bjcpCode: string;
  entriesCount: number;
  standings: MonthlyPlacement[];
}

export interface TopBrewer {
  rank: number;
  name: string;
  points: number;
  medals: string;
  lastBrew: string;
  monthlyFinishes: {
    month: string;
    place: string;
    points: number;
    beerName: string;
    style: string;
  }[];
}

export const DEFAULT_MONTHLY_RESULTS: MonthArchive[] = [
  {
    month: 'January',
    monthNumber: 1,
    styleCategory: 'Hedonistic',
    bjcpCode: 'No rules/no styles',
    entriesCount: 14,
    standings: [
      { place: 1, points: 10, brewer: 'Justin Wilson', beerName: 'Baltic Night Imperial Porter', style: 'Wood-Aged Baltic Porter' },
      { place: 2, points: 7, brewer: 'John Keough', beerName: 'Nelson Sauvin Double NEIPA', style: 'Double Hazy IPA' },
      { place: 3, points: 5, brewer: 'Peter Werle', beerName: 'Monastery Quad with Figs', style: 'Belgian Dark Strong Ale' },
      { place: 4, points: 3, brewer: 'Craig Bryant', beerName: 'English Old Oak Barleywine', style: 'English Barleywine' },
      { place: 5, points: 2, brewer: 'Tom D\'Asto', beerName: 'Cask ESB Reserve', style: 'Extra Special Bitter' }
    ]
  },
  {
    month: 'February',
    monthNumber: 2,
    styleCategory: 'UK Beers',
    bjcpCode: 'BJCP 11A-C, 14A-C, 15A',
    entriesCount: 10,
    standings: [
      { place: 1, points: 10, brewer: 'John Bugert', beerName: 'Cask Best Bitter', style: 'Best Bitter (BJCP 11B)' },
      { place: 2, points: 7, brewer: 'Tom D\'Asto', beerName: 'Highland Heather 80/-', style: 'Scottish Export (BJCP 14C)' },
      { place: 3, points: 5, brewer: 'Les White', beerName: 'Shamrock Red Ale', style: 'Irish Red Ale (BJCP 15A)' },
      { place: 4, points: 3, brewer: 'Chris Hermance', beerName: 'Old Crabby Ordinary', style: 'Ordinary Bitter (BJCP 11A)' },
      { place: 5, points: 2, brewer: 'Joe O\'Keefe', beerName: 'Presidential Strong Bitter', style: 'Strong Bitter (BJCP 11C)' }
    ]
  },
  {
    month: 'March',
    monthNumber: 3,
    styleCategory: 'Belgian & Trappist',
    bjcpCode: 'BJCP 24B-C, 25A-B, 26A-C',
    entriesCount: 13,
    standings: [
      { place: 1, points: 10, brewer: 'Peter Werle', beerName: 'Saint Bernardine Tripel', style: 'Trappist Tripel (BJCP 26C)' },
      { place: 2, points: 7, brewer: 'Justin Wilson', beerName: 'Abbey Dubbel', style: 'Belgian Dubbel (BJCP 26B)' },
      { place: 3, points: 5, brewer: 'Elena Rostova', beerName: 'Golden Devil Ale', style: 'Belgian Golden Strong (BJCP 25A)' },
      { place: 4, points: 3, brewer: 'John Keough', beerName: 'Farmhouse Rustic', style: 'Saison (BJCP 24B)' },
      { place: 5, points: 2, brewer: 'Chris Hermance', beerName: 'Northern Garde', style: 'Bière de Garde (BJCP 24C)' }
    ]
  },
  {
    month: 'April',
    monthNumber: 4,
    styleCategory: 'IPAs',
    bjcpCode: 'BJCP 12C, 21A-C',
    entriesCount: 16,
    standings: [
      { place: 1, points: 10, brewer: 'John Keough', beerName: 'Juice Cloud NEIPA', style: 'Hazy IPA (BJCP 21C)' },
      { place: 2, points: 7, brewer: 'Justin Wilson', beerName: 'Pine & Resin IPA', style: 'West Coast IPA (BJCP 21A)' },
      { place: 3, points: 5, brewer: 'Brian England', beerName: 'East India Merchant', style: 'English IPA (BJCP 12C)' },
      { place: 4, points: 3, brewer: 'Tom D\'Asto', beerName: 'Dark Horizon', style: 'Black IPA (BJCP 21B)' },
      { place: 5, points: 2, brewer: 'Bob Baroncinni', beerName: 'Hop Harbor IPA', style: 'American IPA (BJCP 21A)' }
    ]
  },
  {
    month: 'May',
    monthNumber: 5,
    styleCategory: 'Pale, Malty',
    bjcpCode: 'BJCP 1A-C, 2A, 3A-B, 4A-C',
    entriesCount: 12,
    standings: [
      { place: 1, points: 10, brewer: 'Justin Wilson', beerName: 'Plzeň Crisp', style: 'Czech Premium Pale Lager (BJCP 3B)' },
      { place: 2, points: 7, brewer: 'Peter Werle', beerName: 'Bavarian Gold Helles', style: 'Munich Helles (BJCP 4A)' },
      { place: 3, points: 5, brewer: 'John Keough', beerName: 'Amber Danube', style: 'Vienna Lager (BJCP 4A)' },
      { place: 4, points: 3, brewer: 'Craig Bryant', beerName: 'Corn Belt Classic', style: 'Cream Ale (BJCP 1C)' },
      { place: 5, points: 2, brewer: 'Tom D\'Asto', beerName: 'Baltic Premium Crisp', style: 'International Pale Lager (BJCP 2A)' }
    ]
  },
  {
    month: 'June',
    monthNumber: 6,
    styleCategory: 'Sapwood Cellars Clone',
    bjcpCode: 'Sapwood Cellars Official Clone',
    entriesCount: 12,
    standings: [
      { place: 1, points: 10, brewer: 'John Keough', beerName: 'Hedge Trimmer Clone #1', style: 'Sapwood Cellars Clone (Judged by Sapwood)' },
      { place: 2, points: 7, brewer: 'Justin Wilson', beerName: 'Hedge Trimmer Homage', style: 'Sapwood Cellars Clone' },
      { place: 3, points: 5, brewer: 'Peter Werle', beerName: 'Sapwood Clone Trial', style: 'Sapwood Cellars Clone' },
      { place: 4, points: 3, brewer: 'John Bugert', beerName: 'Cellar Trimmer Clone', style: 'Sapwood Cellars Clone' },
      { place: 5, points: 2, brewer: 'Tom D\'Asto', beerName: 'Sapwood Blend Entry', style: 'Sapwood Cellars Clone' }
    ]
  },
  {
    month: 'July',
    monthNumber: 7,
    styleCategory: 'Session Beers',
    bjcpCode: 'Anything under 4.5% ABV',
    entriesCount: 11,
    standings: [
      { place: 1, points: 10, brewer: 'Tom D\'Asto', beerName: 'Cask Mild Champion (3.6%)', style: 'English Dark Mild (< 4.5%)' },
      { place: 2, points: 7, brewer: 'Chris Hermance', beerName: 'Chesapeake Summer Saison (3.8%)', style: 'Table Saison (< 4.5%)' },
      { place: 3, points: 5, brewer: 'Justin Wilson', beerName: 'Little Haze (4.2%)', style: 'Session Hazy Pale (< 4.5%)' },
      { place: 4, points: 3, brewer: 'John Keough', beerName: 'Emerald Isle Nitro (4.1%)', style: 'Dry Irish Stout (< 4.5%)' },
      { place: 5, points: 2, brewer: 'Joe O\'Keefe', beerName: 'Patapsco Session Bitter (3.7%)', style: 'Ordinary Bitter (< 4.5%)' }
    ]
  },
  {
    month: 'September',
    monthNumber: 9,
    styleCategory: 'Pale, Bitter / Hoppy',
    bjcpCode: 'BJCP 5A-D, 12A-B, 18A-B',
    entriesCount: 15,
    standings: [
      { place: 1, points: 10, brewer: 'Chris Hermance', beerName: 'Cascade Bay Pale', style: 'American Pale Ale (BJCP 18B)' },
      { place: 2, points: 7, brewer: 'Tom D\'Asto', beerName: 'Hallertau Noble Pils', style: 'German Pils (BJCP 5D)' },
      { place: 3, points: 5, brewer: 'John Jester', beerName: 'Galaxy Southern Pale', style: 'Australian Pale Ale (BJCP 12B)' },
      { place: 4, points: 3, brewer: 'Justin Wilson', beerName: 'Cascade Crest', style: 'Pacific Northwest Pale (BJCP 18B)' },
      { place: 5, points: 2, brewer: 'Peter Werle', beerName: 'Wiesn Gold', style: 'Festbier (BJCP 5B)' }
    ]
  },
  {
    month: 'October',
    monthNumber: 10,
    styleCategory: 'Amber / Dark, Malty',
    bjcpCode: 'BJCP 2B-C, 3C-D, 6A-C, 8A-B',
    entriesCount: 14,
    standings: [
      { place: 1, points: 10, brewer: 'Justin Wilson', beerName: 'Bavarian Autumn Fest', style: 'Traditional Märzen (BJCP 6A)' },
      { place: 2, points: 7, brewer: 'John Keough', beerName: 'Bohemian Twilight', style: 'Czech Dark Lager (BJCP 3D)' },
      { place: 3, points: 5, brewer: 'Tom D\'Asto', beerName: 'Goat Herder Bock', style: 'Dunkles Bock (BJCP 6C)' },
      { place: 4, points: 3, brewer: 'Chris Hermance', beerName: 'Pegleg Amber Keller', style: 'Amber Malty Kellerbier (BJCP 6B)' },
      { place: 5, points: 2, brewer: 'John Bugert', beerName: 'Bavarian Night Dunkel', style: 'Munich Dunkel (BJCP 8A)' }
    ]
  }
];

export function calculateTopBrewers(archives: MonthArchive[]): TopBrewer[] {
  const brewerMap = new Map<
    string,
    {
      name: string;
      points: number;
      gold: number;
      silver: number;
      bronze: number;
      finishes: {
        month: string;
        place: string;
        points: number;
        beerName: string;
        style: string;
      }[];
    }
  >();

  // Process all monthly archives
  for (const arc of archives) {
    for (const s of arc.standings) {
      if (!s.brewer || s.brewer.trim() === '') continue;
      const brewer = s.brewer.trim();
      const existing = brewerMap.get(brewer) || {
        name: brewer,
        points: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        finishes: []
      };

      existing.points += s.points;
      if (s.place === 1) existing.gold += 1;
      else if (s.place === 2) existing.silver += 1;
      else if (s.place === 3) existing.bronze += 1;

      const placeLabel =
        s.place === 1 ? '1st Place' :
        s.place === 2 ? '2nd Place' :
        s.place === 3 ? '3rd Place' :
        `${s.place}th Place`;

      existing.finishes.push({
        month: arc.month,
        place: placeLabel,
        points: s.points,
        beerName: s.beerName || 'Homebrew Entry',
        style: s.style || arc.styleCategory
      });

      brewerMap.set(brewer, existing);
    }
  }

  // Sort brewers descending by total points
  const sorted = Array.from(brewerMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.bronze - a.bronze;
  });

  return sorted.slice(0, 10).map((b, idx) => {
    const medalsList: string[] = [];
    if (b.gold > 0) medalsList.push(`${b.gold} Gold`);
    if (b.silver > 0) medalsList.push(`${b.silver} Silver`);
    if (b.bronze > 0) medalsList.push(`${b.bronze} Bronze`);
    const medals = medalsList.length > 0 ? medalsList.join(', ') : 'Ranked Competitor';

    const last = b.finishes[b.finishes.length - 1];
    const lastBrew = last ? `${last.beerName} (${last.style})` : 'Homebrew Entry';

    return {
      rank: idx + 1,
      name: b.name,
      points: b.points,
      medals,
      lastBrew,
      monthlyFinishes: [...b.finishes].reverse()
    };
  });
}
