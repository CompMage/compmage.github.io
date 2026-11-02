export interface MonthlyComp {
  month: string;
  monthNumber: number;
  styleCategory: string;
  bjcpCode: string;
  description: string;
  meetingDate: string;
  entryGuidelines: string[];
  isCurrentMonth?: boolean;
}

export const DEFAULT_ANNUAL_SCHEDULE: MonthlyComp[] = [
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    month: 'May',
    monthNumber: 5,
    styleCategory: 'Pale, Malty',
    bjcpCode: 'BJCP 1A-C, 2A, 3A-B, 4A-C',
    description: 'Standard American Beer, International Pale Lager, Czech Pale & Premium Lager, and Pale Malty European Lager.',
    meetingDate: 'May 20, 2026',
    entryGuidelines: [
      '1 A-C (no D): Standard American Beer',
      '2 A only: International Pale Lager',
      '3 A-B: Czech Pale & Premium Lager',
      '4 A-C: Pale Malty European Lager'
    ]
  },
  {
    month: 'June',
    monthNumber: 6,
    styleCategory: 'Sapwood Cellars Clone (TBD)',
    bjcpCode: 'Sapwood Cellars Official Clone Recipe',
    description: 'Recipe provided by Sapwood Cellars. Sapwood brewers will judge and select the top 5 beers. Competition held at Sapwood Cellars.',
    meetingDate: 'Jun 17, 2026',
    entryGuidelines: [
      'Recipe provided by Sapwood Cellars.',
      'Sapwood brewers will judge and select the top 5 beers.',
      'Competition held at Sapwood Cellars.'
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    month: 'October',
    monthNumber: 10,
    styleCategory: 'Amber / Dark, Malty',
    bjcpCode: 'BJCP 2B-C, 3C-D, 6A-C, 8A-B',
    description: 'International Amber & Dark Lagers, Czech Amber & Dark Lagers, Amber Malty European Lager, and Dark European Lager.',
    meetingDate: 'Oct 21, 2026',
    entryGuidelines: [
      '2 B-C: International Amber & Dark Lagers',
      '3 C-D: Czech Amber & Dark Lagers',
      '6 A-C: Amber Malty European Lager',
      '8 A-B: Dark European Lager'
    ]
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
    ]
  }
];
