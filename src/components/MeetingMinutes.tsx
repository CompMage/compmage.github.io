import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Edit3,
  Check,
  Copy,
  RotateCcw,
  Printer
} from 'lucide-react';
import { SimpleMeetingNote, DEFAULT_MINUTES } from '../data/defaultMinutes';

export type { SimpleMeetingNote };

export const MeetingMinutes: React.FC = () => {
  const [minutesList, setMinutesList] = useState<SimpleMeetingNote[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_meeting_minutes_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_MINUTES;
  });

  const [selectedMinuteId, setSelectedMinuteId] = useState<string>('sep-2026');
  const [isMinutesExpanded, setIsMinutesExpanded] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync with localStorage whenever updated in Officer Portal
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('crabs_meeting_minutes_v1');
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

  // Persist changes if edited locally
  const saveMinutesToStorage = (updatedList: SimpleMeetingNote[]) => {
    setMinutesList(updatedList);
    try {
      localStorage.setItem('crabs_meeting_minutes_v1', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('crabs-minutes-updated'));
    } catch (e) {
      console.error('Failed to save meeting minutes to localStorage', e);
    }
  };

  const selectedMinute =
    minutesList.find((m) => m.id === selectedMinuteId) || minutesList[0] || DEFAULT_MINUTES[0];

  // Whenever selected month changes, sync edit buffer
  useEffect(() => {
    if (selectedMinute) {
      setEditedNotes(selectedMinute.notes);
      setIsEditing(false);
    }
  }, [selectedMinuteId, selectedMinute]);

  const handleSaveNotes = () => {
    const updated = minutesList.map((item) =>
      item.id === selectedMinute.id ? { ...item, notes: editedNotes } : item
    );
    saveMinutesToStorage(updated);
    setIsEditing(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all meeting minutes back to official defaults?')) {
      saveMinutesToStorage(DEFAULT_MINUTES);
      setSelectedMinuteId('sep-2026');
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(selectedMinute.notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredMinutes = minutesList.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.month.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q);
  });

  return (
    <div id="minutes" className="pt-6 border-t border-slate-200 scroll-mt-24">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/60">
                  Club Records & Minutes
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">
                  Simple Notes Archive
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                C.R.A.B.S. Meeting Minutes
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Monthly gathering notes, announcements, competition results, and technical presentations. Drop in raw notes anytime.
              </p>
            </div>
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
            
            {/* Top Toolbar: Month selector tabs, search, and Add Month */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
                  Month:
                </span>
                {filteredMinutes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMinuteId(item.id);
                      setIsEditing(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedMinuteId === item.id
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.month}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meeting notes text..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
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

                {/* Edit, Copy, Print buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isEditing) {
                        setEditedNotes(selectedMinute.notes);
                        setIsEditing(true);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isEditing
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit / Drop In Notes'}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
                    title="Copy full notes to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
                    title="Print these notes"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Simple Text Box Display / Edit Mode */}
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Drop or paste raw meeting notes below. Press <strong>Save Notes</strong> when done.</span>
                    <span className="font-mono text-slate-400">Plain text format</span>
                  </div>

                  <textarea
                    rows={18}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Drop or paste meeting notes here... No formatting required."
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-sans text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 font-mono"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleResetDefaults}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 font-semibold transition-colors"
                      title="Reset notes back to default"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Original Defaults</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Simple, clean, raw-text container */
                <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 sm:p-6">
                  <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm selection:bg-red-100">
                    {selectedMinute.notes}
                  </div>
                </div>
              )}

              {/* Quick tip footer */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-100">
                <span>Tip: Click <strong>"Edit / Drop In Notes"</strong> to paste notes straight from email, Slack, or documents without formatting hassle.</span>
                <span className="font-mono text-slate-500">C.R.A.B.S. Halethorpe, MD</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
