import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Copy,
  Printer
} from 'lucide-react';
import { SimpleMeetingNote, DEFAULT_MINUTES } from '../data/defaultMinutes';
import { fetchMinutes } from '../services/api';

export type { SimpleMeetingNote };

export const MeetingMinutes: React.FC = () => {
  const [minutesList, setMinutesList] = useState<SimpleMeetingNote[]>(() => {
    try {
      localStorage.removeItem('crabs_meeting_minutes_v1');
      const stored = localStorage.getItem('crabs_meeting_minutes_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_MINUTES;
  });

  const [selectedMinuteId, setSelectedMinuteId] = useState<string>('oct-2026');
  const [isMinutesExpanded, setIsMinutesExpanded] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync with server on mount so changes on any device are visible
  useEffect(() => {
    fetchMinutes().then((serverMinutes) => {
      if (serverMinutes && serverMinutes.length > 0) {
        setMinutesList(serverMinutes);
        if (!serverMinutes.some((m) => m.id === selectedMinuteId)) {
          setSelectedMinuteId(serverMinutes[0].id);
        }
      }
    });
  }, []);

  // Sync with localStorage whenever updated in Officer Portal
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('crabs_meeting_minutes_v2');
        if (stored) {
          const parsed = JSON.parse(stored);
          setMinutesList(parsed);
          if (!parsed.some((m: SimpleMeetingNote) => m.id === selectedMinuteId) && parsed.length > 0) {
            setSelectedMinuteId(parsed[0].id);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('crabs-minutes-updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('crabs-minutes-updated', handleSync);
    };
  }, [selectedMinuteId]);

  const filteredMinutes = useMemo(() => {
    if (!searchQuery.trim()) return minutesList;
    const q = searchQuery.toLowerCase();
    return minutesList.filter(
      (m) => m.month.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q)
    );
  }, [minutesList, searchQuery]);

  // Group minutes by year for scalable multi-year archiving
  const minutesByYear = useMemo(() => {
    const groups: { [year: string]: SimpleMeetingNote[] } = {};
    filteredMinutes.forEach((item) => {
      const match = item.month.match(/\b(19\d\d|20\d\d)\b/) || item.date.match(/\b(19\d\d|20\d\d)\b/);
      const year = match ? match[1] : 'All Meetings';
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return groups;
  }, [filteredMinutes]);

  const currentIndex = filteredMinutes.findIndex((m) => m.id === selectedMinuteId);

  const handlePreviousMonth = () => {
    if (currentIndex > 0) {
      setSelectedMinuteId(filteredMinutes[currentIndex - 1].id);
    }
  };

  const handleNextMonth = () => {
    if (currentIndex >= 0 && currentIndex < filteredMinutes.length - 1) {
      setSelectedMinuteId(filteredMinutes[currentIndex + 1].id);
    }
  };

  const selectedMinute =
    minutesList.find((m) => m.id === selectedMinuteId) ||
    filteredMinutes[0] ||
    minutesList[0] ||
    DEFAULT_MINUTES[0];

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText && selectedMinute) {
      navigator.clipboard.writeText(selectedMinute.notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="minutes" className="pt-6 border-t border-slate-200 scroll-mt-24">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200/60">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>Club Records & Minutes</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              C.R.A.B.S. Meeting Minutes
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Monthly gathering notes, announcements, competition results, and technical presentations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://crabsbrew.org/meeting_minutes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
              title="Visit official historical meeting minutes on crabsbrew.org"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>crabsbrew.org/meeting_minutes</span>
            </a>

            <button
              onClick={() => setIsMinutesExpanded(!isMinutesExpanded)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 shadow-2xs"
            >
              <span>{isMinutesExpanded ? 'Collapse Minutes' : 'View Minutes'}</span>
              {isMinutesExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isMinutesExpanded && (
          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/40">
            
            {/* Top Toolbar: Dropdown selector, quick stepper, and search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="meeting-month-dropdown" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>Select Month:</span>
                </label>
                
                <div className="relative inline-flex items-center">
                  <select
                    id="meeting-month-dropdown"
                    value={selectedMinuteId}
                    onChange={(e) => setSelectedMinuteId(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-xs sm:text-sm rounded-xl pl-3.5 pr-9 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 cursor-pointer transition-all min-w-[210px] sm:min-w-[260px]"
                  >
                    {filteredMinutes.length === 0 ? (
                      <option disabled value="">No matching meetings</option>
                    ) : (
                      Object.keys(minutesByYear).map((year) => (
                        <optgroup key={year} label={year === 'All Meetings' ? 'Meetings' : `Year ${year}`}>
                          {minutesByYear[year].map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.month} ({item.date})
                            </option>
                          ))}
                        </optgroup>
                      ))
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
                </div>

                {/* Quick Prev/Next Step Buttons */}
                {filteredMinutes.length > 1 && (
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={handlePreviousMonth}
                      disabled={currentIndex <= 0}
                      className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Newer month"
                      aria-label="Newer month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono font-medium text-slate-500 px-1.5 select-none">
                      {currentIndex >= 0 ? currentIndex + 1 : 1} of {filteredMinutes.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      disabled={currentIndex >= filteredMinutes.length - 1 || currentIndex === -1}
                      className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Older month"
                      aria-label="Older month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (q.trim()) {
                      const matches = minutesList.filter(
                        (m) => m.month.toLowerCase().includes(q.toLowerCase()) || m.notes.toLowerCase().includes(q.toLowerCase())
                      );
                      if (matches.length > 0 && !matches.some((m) => m.id === selectedMinuteId)) {
                        setSelectedMinuteId(matches[0].id);
                      }
                    }
                  }}
                  placeholder="Search minutes text..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
              </div>
            </div>

            {/* Selected Month Document Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
              
              {/* Document Header & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                      Monthly Notes
                    </span>
                    <span className="text-xs text-slate-400 font-mono">•</span>
                    <span className="text-xs font-mono font-semibold text-slate-600">
                      {selectedMinute.date}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    {selectedMinute.month} Meeting Notes
                  </h4>
                </div>

                {/* Copy & Print buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                    title="Copy full notes to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                    title="Print these notes"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Clean, read-only notes container */}
              <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 sm:p-6">
                <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm selection:bg-red-100">
                  {selectedMinute.notes}
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-100">
                <span>Official recorded minutes for Chesapeake Real Ale Brewers Society monthly gatherings.</span>
                <span className="font-mono text-slate-500">C.R.A.B.S. Halethorpe, MD</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
