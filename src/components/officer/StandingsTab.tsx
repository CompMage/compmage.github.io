import React, { useState, useRef, useMemo } from 'react';
import {
  Trophy,
  Upload,
  Download,
  Award,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  Check
} from 'lucide-react';
import {
  calculateTopBrewers,
  MonthArchive,
  MonthlyPlacement
} from '../../data/competitionStandings';
import { downloadStandingsCSV, parseStandingsCSVText } from '../../services/api';

interface RankEntry {
  id: string;
  brewer: string;
  style: string;
}

interface RankTier {
  place: number;
  points: number;
  label: string;
  entries: RankEntry[];
}

const createInitialRanks = (): RankTier[] => [
  { place: 1, points: 10, label: '1st Place', entries: [{ id: '1-1', brewer: '', style: '' }] },
  { place: 2, points: 7, label: '2nd Place', entries: [{ id: '2-1', brewer: '', style: '' }] },
  { place: 3, points: 5, label: '3rd Place', entries: [{ id: '3-1', brewer: '', style: '' }] },
  { place: 4, points: 3, label: '4th Place', entries: [{ id: '4-1', brewer: '', style: '' }] },
  { place: 5, points: 2, label: '5th Place', entries: [{ id: '5-1', brewer: '', style: '' }] }
];

interface StandingsTabProps {
  competitionResults: MonthArchive[];
  onSaveStandings: (updated: MonthArchive[]) => void;
  showNotification: (msg: string) => void;
}

export const StandingsTab: React.FC<StandingsTabProps> = ({
  competitionResults,
  onSaveStandings,
  showNotification
}) => {
  const [isImportingStandingsCSV, setIsImportingStandingsCSV] = useState<boolean>(false);
  const [standingsCSVMode, setStandingsCSVMode] = useState<'append' | 'replace'>('append');
  const [parsedStandingsPreview, setParsedStandingsPreview] = useState<MonthArchive[] | null>(null);
  const [standingsCSVError, setStandingsCSVError] = useState<string | null>(null);
  const standingsCSVInputRef = useRef<HTMLInputElement | null>(null);

  const [standingsMonth, setStandingsMonth] = useState<string>('November');
  const [standingsStyle, setStandingsStyle] = useState<string>('Porters & Stouts');
  const [standingsBjcp, setStandingsBjcp] = useState<string>('BJCP 13C, 15B-C, 16A-D, 20A-B');
  const [standingsEntriesCount, setStandingsEntriesCount] = useState<number>(14);
  const [ranks, setRanks] = useState<RankTier[]>(createInitialRanks);

  const currentTopBrewers = useMemo(
    () => calculateTopBrewers(competitionResults),
    [competitionResults]
  );

  const handleResetAllStandings = () => {
    if (window.confirm('Are you sure you want to reset all competition standings? This will clear all recorded placements and reset the season leaderboard to 0 points.')) {
      onSaveStandings([]);
      showNotification('All competition standings have been reset.');
    }
  };

  const handleStandingsCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStandingsCSVError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseStandingsCSVText(text);
        if (parsed.length === 0) {
          setStandingsCSVError('No valid standings records found in the uploaded CSV file. Please ensure the CSV has columns like Month, Place, Brewer Name, Beer Name / Style, Points.');
          setParsedStandingsPreview(null);
        } else {
          setParsedStandingsPreview(parsed);
          setStandingsCSVError(null);
        }
      } catch (err: any) {
        setStandingsCSVError(err?.message || 'Failed to parse CSV file.');
        setParsedStandingsPreview(null);
      }
    };
    reader.onerror = () => {
      setStandingsCSVError('Failed to read CSV file from your disk.');
    };
    reader.readAsText(file);
  };

  const handleApplyStandingsCSV = () => {
    if (!parsedStandingsPreview || parsedStandingsPreview.length === 0) return;

    let updated: MonthArchive[] = [];
    if (standingsCSVMode === 'replace') {
      updated = parsedStandingsPreview;
    } else {
      const existingMap = new Map<string, MonthArchive>();
      competitionResults.forEach((m) => existingMap.set(m.month.trim().toLowerCase(), m));
      parsedStandingsPreview.forEach((m) => existingMap.set(m.month.trim().toLowerCase(), m));

      const monthOrder = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      updated = Array.from(existingMap.values()).sort((a, b) => {
        const aIdx = monthOrder.indexOf(a.month.trim().toLowerCase());
        const bIdx = monthOrder.indexOf(b.month.trim().toLowerCase());
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.month.localeCompare(b.month);
      });
    }

    onSaveStandings(updated);
    setIsImportingStandingsCSV(false);
    setParsedStandingsPreview(null);
    setStandingsCSVError(null);
    if (standingsCSVInputRef.current) standingsCSVInputRef.current.value = '';
    showNotification(
      standingsCSVMode === 'replace'
        ? `Replaced standings with ${parsedStandingsPreview.length} months from CSV file.`
        : `Merged CSV standings! ${parsedStandingsPreview.length} month(s) imported and saved to server.`
    );
  };

  const handleUpdateRankEntry = (place: number, entryId: string, field: 'brewer' | 'style', value: string) => {
    setRanks((prev) =>
      prev.map((tier) => {
        if (tier.place !== place) return tier;
        return {
          ...tier,
          entries: tier.entries.map((entry) =>
            entry.id === entryId ? { ...entry, [field]: value } : entry
          )
        };
      })
    );
  };

  const handleAddRankTie = (place: number) => {
    setRanks((prev) =>
      prev.map((tier) => {
        if (tier.place !== place) return tier;
        return {
          ...tier,
          entries: [
            ...tier.entries,
            { id: `${place}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, brewer: '', style: '' }
          ]
        };
      })
    );
  };

  const handleRemoveRankTie = (place: number, entryId: string) => {
    setRanks((prev) =>
      prev.map((tier) => {
        if (tier.place !== place) return tier;
        if (tier.entries.length <= 1) {
          return {
            ...tier,
            entries: [{ id: `${place}-1`, brewer: '', style: '' }]
          };
        }
        return {
          ...tier,
          entries: tier.entries.filter((e) => e.id !== entryId)
        };
      })
    );
  };

  const handleSaveFlightStandings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!standingsMonth.trim()) return;

    const placings: MonthlyPlacement[] = [];

    ranks.forEach((tier) => {
      tier.entries.forEach((entry) => {
        const rawBrewer = entry.brewer.trim();
        if (!rawBrewer) return;

        const names =
          rawBrewer.includes('&') || rawBrewer.includes(',') || rawBrewer.includes(' / ')
            ? rawBrewer.split(/[,&/]/).map((n) => n.trim()).filter(Boolean)
            : [rawBrewer];

        names.forEach((name) => {
          placings.push({
            place: tier.place,
            points: tier.points,
            brewer: name,
            style: entry.style.trim() || standingsStyle.trim() || 'Monthly Flight'
          });
        });
      });
    });

    if (placings.length === 0) {
      alert('Please enter at least one brewer ranking for this flight.');
      return;
    }

    const monthArchiveEntry: MonthArchive = {
      month: standingsMonth.trim(),
      monthNumber: new Date(`${standingsMonth} 1, 2026`).getMonth() + 1 || 11,
      styleCategory: standingsStyle.trim() || 'Monthly Flight',
      bjcpCode: standingsBjcp.trim() || 'BJCP Guidelines',
      entriesCount: Number(standingsEntriesCount) || placings.length,
      standings: placings
    };

    const exists = competitionResults.some(
      (m) => m.month.toLowerCase() === standingsMonth.trim().toLowerCase()
    );
    const updated = exists
      ? competitionResults.map((m) =>
          m.month.toLowerCase() === standingsMonth.trim().toLowerCase() ? monthArchiveEntry : m
        )
      : [...competitionResults, monthArchiveEntry];

    onSaveStandings(updated);
    showNotification(`Recorded ${standingsMonth} competition standings! Brewer of the Year rankings updated.`);
    setRanks(createInitialRanks());
  };

  const handleDeleteFlight = (monthName: string) => {
    if (window.confirm(`Delete standings for ${monthName}? This will recalculate the leaderboards.`)) {
      onSaveStandings(competitionResults.filter((m) => m.month !== monthName));
      showNotification(`Deleted standings for ${monthName}.`);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Competitions Desk · Live Server Persistence
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Enter Monthly Competition Flight Standings
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Input brewer placings or import CSV spreadsheet. Changes persist automatically to server storage so every system and visitor sees live updates.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsImportingStandingsCSV(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              title="Import standings from a CSV file"
            >
              <Upload className="w-4 h-4 text-emerald-200" />
              <span>Import CSV</span>
            </button>
            <button
              type="button"
              onClick={() => downloadStandingsCSV(competitionResults)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              title="Download all competition flight standings as a CSV file"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form to Enter This Month's Standings */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Input This Month's Standings</span>
              </h3>
              <span className="text-xs text-amber-300 font-mono">1st: 10p · 2nd: 7p · 3rd: 5p</span>
            </div>

            <form onSubmit={handleSaveFlightStandings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Competition Month *</label>
                  <select
                    value={standingsMonth}
                    onChange={(e) => setStandingsMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                      (m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Style Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stouts & Porters, Saisons, Dark Lagers"
                    value={standingsStyle}
                    onChange={(e) => setStandingsStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">BJCP Code / Rule</label>
                  <input
                    type="text"
                    placeholder="e.g. BJCP 15A-C, 16A-D"
                    value={standingsBjcp}
                    onChange={(e) => setStandingsBjcp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Total Entries Count</label>
                  <input
                    type="number"
                    min={1}
                    value={standingsEntriesCount}
                    onChange={(e) => setStandingsEntriesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Placings 1 through 5 */}
              <div className="space-y-3.5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Flight Placings (Points Awarded)
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Multiple brewers can share any rank (ties award full points)
                  </span>
                </div>

                {ranks.map((tier) => (
                  <div
                    key={tier.place}
                    className="p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2.5 shadow-2xs transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{tier.label}</span>
                        </span>
                        <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {tier.points} Points
                        </span>
                        {tier.entries.length > 1 && (
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-700/40">
                            {tier.entries.length}-Way Tie
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddRankTie(tier.place)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Add another brewer tied for this rank"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Tied Brewer</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tier.entries.map((entry, eIdx) => (
                        <div key={entry.id} className="flex items-center gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                            <input
                              type="text"
                              placeholder={eIdx === 0 && tier.place === 1 ? 'Brewer Name *' : 'Brewer Name'}
                              value={entry.brewer}
                              onChange={(e) =>
                                handleUpdateRankEntry(tier.place, entry.id, 'brewer', e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                            />
                            <input
                              type="text"
                              placeholder="Style / Subcategory"
                              value={entry.style}
                              onChange={(e) =>
                                handleUpdateRankEntry(tier.place, entry.id, 'style', e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                            />
                          </div>
                          {tier.entries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRankTie(tier.place, entry.id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Remove this tied brewer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Standings for {standingsMonth}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Brewer of the Year Standings & Archive */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Live Computed
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Brewer of the Year Leaderboard
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Top 5</span>
              </div>

              <div className="space-y-2.5">
                {currentTopBrewers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
                    Standings reset. Enter monthly flight placings to compute leaderboard.
                  </div>
                ) : (
                  currentTopBrewers.slice(0, 5).map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            b.rank === 1
                              ? 'bg-amber-500 text-slate-950'
                              : b.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : b.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {b.rank}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{b.name}</p>
                          <p className="text-[10px] text-slate-400">{b.medals}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black font-mono text-amber-400">
                        {b.points} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Flights List */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="text-sm font-bold text-white">
                  Recorded Flights ({competitionResults.length})
                </h3>
                {competitionResults.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAllStandings}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2 py-1 rounded transition-colors cursor-pointer"
                    title="Reset all competition standings"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {competitionResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-900 rounded-lg border border-slate-800">
                    Standings reset. No competition flights recorded yet.
                  </div>
                ) : (
                  competitionResults.map((m) => (
                    <div
                      key={m.month}
                      className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg text-xs border border-slate-800"
                    >
                      <div>
                        <strong className="text-white block">{m.month}</strong>
                        <span className="text-slate-400 text-[11px]">{m.styleCategory}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteFlight(m.month)}
                        className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                        title={`Delete ${m.month} standings`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: IMPORT STANDINGS CSV */}
      {isImportingStandingsCSV && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsImportingStandingsCSV(false);
                setParsedStandingsPreview(null);
                setStandingsCSVError(null);
              }}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 bg-emerald-950/70 text-emerald-400 rounded-xl border border-emerald-800/40">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Import Competition Standings CSV
                </h3>
                <p className="text-xs text-slate-400">
                  Upload a CSV spreadsheet with flight results. Saves persistently to server so all visitors see live updates.
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={standingsCSVInputRef}
              onChange={handleStandingsCSVFileChange}
              accept=".csv,text/csv"
              className="hidden"
            />

            <div
              onClick={() => standingsCSVInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60 hover:bg-slate-950"
            >
              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">
                {parsedStandingsPreview
                  ? 'Click to choose a different CSV file'
                  : 'Click to select CSV file from your computer'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Accepts standard comma-separated (.csv) files
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Accepted CSV column formats:</span>
              <p className="font-mono text-emerald-300">
                • Standard: Month, Style Category, Place, Brewer Name, Beer Name / Style, Points
              </p>
              <p className="font-mono text-slate-400">
                • Summary: Month, Category, 1st Place, 2nd Place, 3rd Place, 4th Place, 5th Place
              </p>
            </div>

            {standingsCSVError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{standingsCSVError}</span>
              </div>
            )}

            {parsedStandingsPreview && parsedStandingsPreview.length > 0 && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Parsed {parsedStandingsPreview.length} Month(s)</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Total Placements:{' '}
                    <strong className="text-white">
                      {parsedStandingsPreview.reduce((acc, m) => acc + (m.standings?.length || 0), 0)}
                    </strong>
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {parsedStandingsPreview.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-white mb-1.5">
                        <span className="text-amber-400">{m.month}</span>
                        <span className="text-slate-400 font-normal">{m.styleCategory}</span>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-slate-300">
                        {m.standings?.map((p, pIdx) => (
                          <div key={pIdx} className="flex justify-between font-mono">
                            <span>
                              {p.place === 1 ? '🥇 1st' : p.place === 2 ? '🥈 2nd' : p.place === 3 ? '🥉 3rd' : `${p.place}th`}: {p.brewer}{p.beerName ? ` (${p.beerName})` : ''}
                            </span>
                            <span className="text-amber-400 font-bold">{p.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white block">
                    Choose Import Mode:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                        standingsCSVMode === 'append'
                          ? 'border-emerald-500 bg-emerald-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="standingsCSVMode"
                        value="append"
                        checked={standingsCSVMode === 'append'}
                        onChange={() => setStandingsCSVMode('append')}
                        className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                      />
                      <div className="text-xs">
                        <strong className="block text-white">Append / Merge</strong>
                        <span className="text-[11px] text-slate-400 block">
                          Add or update months from this CSV. Keeps your other existing months untouched.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                        standingsCSVMode === 'replace'
                          ? 'border-amber-500 bg-amber-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="standingsCSVMode"
                        value="replace"
                        checked={standingsCSVMode === 'replace'}
                        onChange={() => setStandingsCSVMode('replace')}
                        className="mt-0.5 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="text-xs">
                        <strong className="block text-white">Overwrite / Replace</strong>
                        <span className="text-[11px] text-slate-400 block">
                          Replace all current standings with only the data in this CSV file.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsImportingStandingsCSV(false);
                  setParsedStandingsPreview(null);
                  setStandingsCSVError(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStandingsCSV}
                disabled={!parsedStandingsPreview || parsedStandingsPreview.length === 0}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply Import</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
