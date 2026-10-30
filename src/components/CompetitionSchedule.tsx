import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Award, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, Medal, FileText, Sparkles, Filter, ExternalLink, Flame, Beer, ArrowRight } from 'lucide-react';
import { MeetingMinutes } from './MeetingMinutes';
import {
  DEFAULT_MONTHLY_RESULTS,
  calculateTopBrewers,
  MonthArchive,
  MonthlyPlacement,
  TopBrewer
} from '../data/competitionStandings';

interface MonthlyComp {
  month: string;
  monthNumber: number;
  styleCategory: string;
  bjcpCode: string;
  description: string;
  meetingDate: string;
  entryGuidelines: string[];
  isCurrentMonth?: boolean;
}

export const CompetitionSchedule: React.FC = () => {
  // Toggle between 'this-month' and 'full-year'
  const [scheduleView, setScheduleView] = useState<'this-month' | 'full-year'>('this-month');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [activeMonthModal, setActiveMonthModal] = useState<MonthlyComp | null>(null);

  const annualSchedule: MonthlyComp[] = [
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
      ],
      isCurrentMonth: true
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
      ]
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

  const currentMonthComp = annualSchedule.find((m) => m.isCurrentMonth) || annualSchedule[9];

  // State for Section 4 standings view (Top 5 vs Monthly Standings Breakout vs Brewer of the Year Points System)
  const [standingsTab, setStandingsTab] = useState<'top5' | 'monthly' | 'points'>('top5');
  // Standings are collapsed on load as requested
  const [isStandingsExpanded, setIsStandingsExpanded] = useState<boolean>(false);
  const [expandedBrewerRank, setExpandedBrewerRank] = useState<number | null>(null);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');

  // Dynamic monthly results and Top 5 Standings synced with Officer Portal
  const [monthlyResults, setMonthlyResults] = useState<MonthArchive[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_competition_standings_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MONTHLY_RESULTS;
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('crabs_competition_standings_v1');
        if (stored) setMonthlyResults(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('crabs-standings-updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('crabs-standings-updated', handleSync);
    };
  }, []);

  const currentTop5 = calculateTopBrewers(monthlyResults);

  return (
    <section id="competitions" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header with Interactive Toggle Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>C.R.A.B.S. Homebrew Competitions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Competition Schedule & Standings
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every month at Heavy Seas Brewery, members enter their homebrews for friendly, constructive 
              BJCP feedback and points toward the annual <strong>Brewer of the Year</strong> title.
            </p>
          </div>

          {/* Interactive Schedule Toggle */}
          <div className="flex items-center p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0 self-start md:self-auto">
            <button
              onClick={() => setScheduleView('this-month')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                scheduleView === 'this-month'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>This Month's Schedule</span>
            </button>

            <button
              onClick={() => setScheduleView('full-year')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                scheduleView === 'full-year'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Full Year Schedule</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Sections Layout */}

        {/* Section 1 & 2: Conditional View based on Toggle */}
        {scheduleView === 'this-month' ? (
          /* SECTION 1: THIS MONTH'S COMPETITION SPOTLIGHT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Current Month Marquee Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 px-3 py-1 rounded-full">
                      Active Competition
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {currentMonthComp.month} 2026
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Meeting: {currentMonthComp.meetingDate}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    {currentMonthComp.bjcpCode}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {currentMonthComp.styleCategory}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentMonthComp.description}
                  </p>
                </div>

                {/* Entry Guidelines Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>How to Enter This Month's Flight</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {currentMonthComp.entryGuidelines.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Location & Dropoff Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span>Drop off entries at Heavy Seas Brewery in the </span>
                  <span className="font-bold text-purple-600">Purple Room</span>
                  <span> by 6:45 PM.</span>
                </div>
                <button
                  onClick={() => setScheduleView('full-year')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <span>View All 12 Months</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Next Month & Tips Card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Upcoming Next Month */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-md flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Coming Next Month
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-white">
                    November: Porters & Stouts
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Get ready for rich, roasty winter brews! Eligible categories include 13C English Porter, 15B-C Irish Stout, 16A-D Dark British Beer, and 20A-B American Porter & Stout.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Nov 18, 2026</span>
                  <span className="text-amber-400 font-mono font-bold">BJCP 13C, 15B-C, 16A-D, 20A-B</span>
                </div>
              </div>

              {/* Official BJCP Style Guidelines Link Card */}
              <a
                href="https://www.bjcp.org/bjcp-style-guidelines/"
                target="_blank"
                rel="noreferrer"
                className="group bg-white border border-slate-200 hover:border-red-300 rounded-2xl p-6 shadow-sm space-y-2.5 transition-all hover:shadow-md block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>Official BJCP Style Guidelines</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Beer Judge Certification Program Guidelines
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Club competitions and evaluations follow the official BJCP Beer Style Guidelines. Access comprehensive style parameters, vital statistics, and commercial examples at bjcp.org.
                </p>
                <div className="pt-1 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:underline">
                  <span>Visit https://www.bjcp.org/bjcp-style-guidelines/</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        ) : (
          /* SECTION 2: FULL YEAR COMPETITION SCHEDULE */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2026 Annual Schedule (12 Months)
              </span>
              <span className="text-xs text-slate-500">
                Click any month for full entry requirements
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {annualSchedule.map((comp) => (
                <div
                  key={comp.month}
                  onClick={() => setActiveMonthModal(comp)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    comp.isCurrentMonth
                      ? 'bg-red-50/60 border-red-300 shadow-sm ring-2 ring-red-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        comp.isCurrentMonth ? 'text-red-600' : 'text-slate-500'
                      }`}>
                        {comp.month}
                      </span>
                      {comp.isCurrentMonth && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                      {comp.styleCategory}
                    </h4>
                    <p className="text-xs text-red-700 font-mono font-semibold">
                      {comp.bjcpCode}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {comp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{comp.meetingDate}</span>
                    <span className="text-red-600 font-semibold group-hover:translate-x-1 flex items-center">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEETING MINUTES SECTION */}
        <MeetingMinutes />

        {/* SECTION 4: 2026 BREWER OF THE YEAR STANDINGS & POINT SYSTEM */}
        <div className="pt-6 border-t border-slate-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            
            {/* Collapsible Section Header Bar */}
            <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      Section 4: Standings
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      Active Leader: Justin Wilson (59 pts)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    2026 Brewer of the Year Standings
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Cumulative championship points earned from monthly blind BJCP competition flights (1st=10, 2nd=7, 3rd=5, 4th=3, 5th=2).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                {/* Brewer of the Year Point System Button (Section 3) */}
                <button
                  onClick={() => {
                    if (!isStandingsExpanded) {
                      setIsStandingsExpanded(true);
                      setStandingsTab('points');
                    } else if (standingsTab === 'points') {
                      setStandingsTab('top5');
                    } else {
                      setStandingsTab('points');
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                    isStandingsExpanded && standingsTab === 'points'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  }`}
                  title="View Brewer of the Year Point System rules and scoring scale"
                >
                  <Award className="w-4 h-4 text-red-600" />
                  <span>Brewer of the Year Point System</span>
                </button>

                {/* Expand / Collapse Standings Toggle */}
                <button
                  onClick={() => {
                    setIsStandingsExpanded(!isStandingsExpanded);
                    if (!isStandingsExpanded && standingsTab === 'points') {
                      setStandingsTab('top5');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs border border-slate-200"
                >
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>{isStandingsExpanded ? 'Collapse Standings' : 'Expand Standings'}</span>
                  {isStandingsExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
              </div>
            </div>

            {/* EXPANDED STANDINGS CONTENT */}
            {isStandingsExpanded && (
              <div className="p-6 sm:p-8 space-y-6 bg-slate-50/40">
                
                {/* Standings Sub-navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl text-xs font-bold gap-1">
                    <button
                      onClick={() => setStandingsTab('top5')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                        standingsTab === 'top5'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Top 5 Leaderboard</span>
                    </button>

                    <button
                      onClick={() => setStandingsTab('monthly')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                        standingsTab === 'monthly'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Monthly Breakout</span>
                    </button>

                    <button
                      onClick={() => setStandingsTab('points')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                        standingsTab === 'points'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'text-red-700 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Brewer of the Year Point System</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsStandingsExpanded(false)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    <span>Collapse section</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TAB 1: TOP 5 LEADERBOARD */}
                {standingsTab === 'top5' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                      <span>Current season leaders (Points scale: <strong>1st=10, 2nd=7, 3rd=5, 4th=3, 5th=2</strong>)</span>
                      <button
                        onClick={() => setStandingsTab('points')}
                        className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 hover:underline"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Point System Rules</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                      {currentTop5.map((brewer) => {
                        const isExpanded = expandedBrewerRank === brewer.rank;
                        return (
                          <div key={brewer.rank} className="bg-white hover:bg-slate-50/50 transition-colors">
                            <div
                              onClick={() => setExpandedBrewerRank(isExpanded ? null : brewer.rank)}
                              className="p-4 flex items-center justify-between cursor-pointer gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                                  {brewer.rank === 1 ? '🥇' : brewer.rank === 2 ? '🥈' : brewer.rank === 3 ? '🥉' : brewer.rank}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 text-sm">{brewer.name}</h4>
                                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                      ({brewer.medals})
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Latest: <span className="font-medium text-slate-700">{brewer.lastBrew}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <span className="font-mono font-extrabold text-red-600 text-base">
                                    {brewer.points}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium block">points</span>
                                </div>
                                <button
                                  aria-label="Toggle Monthly Finishes Breakout"
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Expandable Monthly Finishes Breakout */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 bg-slate-50/80 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                  <span>Monthly Finishes Breakout</span>
                                  <span className="text-red-700 font-mono">{brewer.monthlyFinishes.length} scoring flights</span>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs text-left">
                                    <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-200">
                                      <tr>
                                        <th className="py-1">Month</th>
                                        <th className="py-1">Placement</th>
                                        <th className="py-1">Beer Entry</th>
                                        <th className="py-1 text-right">Points</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {brewer.monthlyFinishes.map((f, i) => (
                                        <tr key={i}>
                                          <td className="py-1.5 font-bold text-slate-800">{f.month}</td>
                                          <td className="py-1.5 text-slate-700">{f.place}</td>
                                          <td className="py-1.5 text-slate-600 truncate max-w-[200px]">
                                            <span className="font-medium text-slate-900">{f.beerName}</span>
                                            <span className="text-[10px] text-slate-400 block truncate">{f.style}</span>
                                          </td>
                                          <td className="py-1.5 text-right font-mono font-bold text-red-600">
                                            +{f.points}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => setStandingsTab('monthly')}
                        className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                      >
                        <span>View All Monthly Standings Breakout</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-400 text-[11px]">Click any brewer to view their scoring breakdown</span>
                    </div>
                  </div>
                )}

                {/* TAB 2: MONTHLY STANDINGS BREAKOUT */}
                {standingsTab === 'monthly' && (
                  <div className="space-y-4">
                    {/* Month Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      <button
                        onClick={() => setSelectedMonthFilter('all')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          selectedMonthFilter === 'all'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All Months
                      </button>
                      {monthlyResults.map((m) => (
                        <button
                          key={m.month}
                          onClick={() => setSelectedMonthFilter(m.month)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                            selectedMonthFilter === m.month
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {m.month.slice(0, 3)}
                        </button>
                      ))}
                    </div>

                    {/* Monthly Results Flights */}
                    <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                      {monthlyResults
                        .filter((m) => selectedMonthFilter === 'all' || selectedMonthFilter === m.month)
                        .map((flight) => (
                          <div key={flight.month} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                                  {flight.month} 2026 Competition
                                </span>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {flight.styleCategory}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500 font-mono text-[11px]">{flight.bjcpCode}</span>
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                                  {flight.entriesCount} entries
                                </span>
                              </div>
                            </div>

                            {/* Placements Table for This Month */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead className="text-[10px] uppercase text-slate-400">
                                  <tr>
                                    <th className="py-1">Place</th>
                                    <th className="py-1">Points</th>
                                    <th className="py-1">Brewer</th>
                                    <th className="py-1">Beer & Subcategory</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white rounded-lg">
                                  {flight.standings.map((s) => (
                                    <tr key={s.place} className="hover:bg-slate-50">
                                      <td className="py-2 px-2 font-bold font-mono">
                                        {s.place === 1 ? '🥇 1st' : s.place === 2 ? '🥈 2nd' : s.place === 3 ? '🥉 3rd' : `${s.place}th`}
                                      </td>
                                      <td className="py-2 px-2 font-mono font-extrabold text-red-600">
                                        {s.points} pts
                                      </td>
                                      <td className="py-2 px-2 font-bold text-slate-900 whitespace-nowrap">
                                        {s.brewer}
                                      </td>
                                      <td className="py-2 px-2 text-slate-600">
                                        <span className="font-semibold text-slate-800">{s.beerName}</span>
                                        <span className="text-[10px] text-slate-500 block">{s.style}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setStandingsTab('top5')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        <span>Back to Top 5 Leaderboard</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: BREWER OF THE YEAR POINT SYSTEM (SECTION 3 CONTENT) */}
                {standingsTab === 'points' && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                            Club Championship Rules
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                            Brewer of the Year Point System
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => setStandingsTab('top5')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg self-start sm:self-auto"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Back to Current Standings</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      In every monthly competition flight, the top 5 beers evaluated blind by our judging panel earn cumulative points toward our annual club championship. At the end of the year, the brewer with the highest total is crowned <strong>C.R.A.B.S. Brewer of the Year</strong>.
                    </p>

                    {/* Compaction Points Cards: 1st=10, 2nd=7, 3rd=5, 4th=3, 5th=2 */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      <div className="p-4 bg-gradient-to-b from-amber-50 to-amber-100/40 border border-amber-200 rounded-xl shadow-2xs">
                        <span className="font-bold text-amber-800 block text-xs uppercase tracking-wider">1st Place</span>
                        <span className="font-mono font-black text-amber-950 text-2xl my-1 block">10 pts</span>
                        <span className="text-[11px] text-amber-700">Gold Medal</span>
                      </div>
                      <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-2xs">
                        <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider">2nd Place</span>
                        <span className="font-mono font-black text-slate-950 text-2xl my-1 block">7 pts</span>
                        <span className="text-[11px] text-slate-600">Silver Medal</span>
                      </div>
                      <div className="p-4 bg-gradient-to-b from-orange-50 to-orange-100/40 border border-orange-200 rounded-xl shadow-2xs">
                        <span className="font-bold text-orange-800 block text-xs uppercase tracking-wider">3rd Place</span>
                        <span className="font-mono font-black text-orange-950 text-2xl my-1 block">5 pts</span>
                        <span className="text-[11px] text-orange-700">Bronze Medal</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
                        <span className="font-bold text-slate-600 block text-xs uppercase tracking-wider">4th Place</span>
                        <span className="font-mono font-black text-slate-800 text-2xl my-1 block">3 pts</span>
                        <span className="text-[11px] text-slate-500">Honorable Mention</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
                        <span className="font-bold text-slate-600 block text-xs uppercase tracking-wider">5th Place</span>
                        <span className="font-mono font-black text-slate-800 text-2xl my-1 block">2 pts</span>
                        <span className="text-[11px] text-slate-500">Finalist Flight</span>
                      </div>
                    </div>

                    {/* Detailed Scoring Guidelines */}
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-800 text-sm">Official Scoring & Eligibility Guidelines:</p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span><strong>Standard Compaction Scale:</strong> 1st = 10 pts, 2nd = 7 pts, 3rd = 5 pts, 4th = 3 pts, 5th = 2 pts.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span><strong>Homebrew Requirement:</strong> All entries must be brewed on non-commercial homebrewing equipment by active, dues-paid C.R.A.B.S. members.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span><strong>Flight Limit:</strong> Maximum of two (2) separate entries per brewer per monthly competition flight.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span><strong>Tiebreakers:</strong> Year-end point ties are decided first by total 1st place gold medals won, followed by total 2nd place medals.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setStandingsTab('top5')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>View Current Top 5 Standings</span>
                      </button>
                      <button
                        onClick={() => setStandingsTab('monthly')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
                      >
                        <span>View Monthly Results Breakout</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Official 2026 Competition Winners Link & Collapse footer */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Official club records & historical archives:</span>
                    <a
                      href="https://www.crabsbrew.org/2026_competition_winners"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 hover:underline"
                    >
                      <span>crabsbrew.org/2026_competition_winners</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => setIsStandingsExpanded(false)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold self-start sm:self-auto"
                  >
                    <span>Collapse Standings</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Modal for Month Details */}
        {activeMonthModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  {activeMonthModal.month} 2026 Competition
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  {activeMonthModal.styleCategory}
                </h3>
                <p className="text-xs font-mono font-semibold text-red-700">
                  {activeMonthModal.bjcpCode}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {activeMonthModal.description}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Entry Rules & Guidelines:</span>
                <ul className="space-y-1.5 text-slate-600">
                  {activeMonthModal.entryGuidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  Meeting: {activeMonthModal.meetingDate}
                </span>
                <button
                  onClick={() => setActiveMonthModal(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
