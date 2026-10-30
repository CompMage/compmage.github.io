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
  Plus,
  RotateCcw,
  Printer
} from 'lucide-react';

export interface SimpleMeetingNote {
  id: string;
  month: string;
  date: string;
  notes: string;
}

const DEFAULT_MINUTES: SimpleMeetingNote[] = [
  {
    id: 'sep-2026',
    month: 'September 2026',
    date: 'September 16, 2026',
    notes: `C.R.A.B.S. Gathering: September 16, 2026
Location: Heavy Seas Brewery, Halethorpe, MD
Presiding: Joe O'Keefe (President)
Recorded By: Ben Schwalb (Secretary)
Attendees: 28 Members & Guests Present

• CALL TO ORDER:
Meeting called to order at 7:04 PM by President Joe O'Keefe. Welcomed attending members and guests.

• OFFICER REPORTS:
- Treasury (Rob Kiernan): Steady club balances with active dues collections via cash and PayPal.
- Competitions (Chris Hermance): Reviewed 10 entries in Pale/Bitter/Hoppy. Announced October 21 competition featuring Amber, Dark, and Malty lagers.
- Guild (Tom Flavinh): Tom is in the hospital recovering with pancreatitis through November; the club sends its warmest support.

• TECHNICAL EDUCATION:
Specialty Fermentations & Barrel Project Fill (presented by Les White & Barrel Committee). Les shared makgeolli (traditional Korean rice wine) from J.S. Brewery. The barrel committee finalized logistics to fill the quad barrel with gueuze using low/unhopped pale ales and aged beers.

• COMPETITION RESULTS (Pale, Bitter / Hoppy):
- 1st Place (10 pts): Justin Wilson (American Pale Ale)
- 2nd Place (7 pts): John Jester
- 3rd Place (5 pts): Brian England
- 4th Place (tie, 3 pts each): Bob Baroncinni & Craig Bryant
- 5th Place (tie, 2 pts each): Chris + Christa & Joe O'Keefe

• UPCOMING EVENTS:
- Sep 26: Maryland Microbrewery Fest & Homebrew Contest at Union Mills Homestead
- Sep 27: Annual Crabs4CRABS at Guilford Park pavilion in Jessup (Free for members, $20 guests, kids under 14 free)
- Oct 10: Das Best Oktoberfest at MD State Fairgrounds in Timonium
- Oct 14: Checkerspot Homebrew Extravaganza (6-9 PM, $10 tickets benefiting BARCS)
- Oct 17: SMASH 5th Annual Brewers Challenge at Mully's Brewery
- Oct 21: Next C.R.A.B.S. Meeting: Amber / Dark, Malty Lagers Competition

• OPEN FLOOR & BOTTLE SHARE:
Tasting and sensory critique of member commercial inspirations and homebrews. Meeting adjourned at 9:18 PM.`
  },
  {
    id: 'aug-2026',
    month: 'August 2026',
    date: 'August 19, 2026',
    notes: `C.R.A.B.S. Gathering: August 19, 2026
Location: Heavy Seas Brewery, Halethorpe, MD
Presiding: Joe O'Keefe (President)
Recorded By: Ben Schwalb (Secretary)
Attendees: 25 Members & Guests Present

• CALL TO ORDER:
Meeting called to order at 7:06 PM by President Joe O'Keefe. Summer gathering focused on MASHOUT recap and upcoming fall festival circuit.

• OFFICER REPORTS:
- Treasury (Rob Kiernan): Financial health confirmed; noted club reimbursements for summer festival supplies.
- Competitions (Chris Hermance): Reminder that September will feature Pale, Bitter / Hoppy styles (BJCP 5A-D, 12A-B, 18A-B).
- Guild: Early-bird registration and participation updates for state guild events.

• TECHNICAL EDUCATION:
MASHOUT Retrospective & On-Site Kveik Fermentation (Justin Wilson, Trevor & John Keough). Review of annual MASHOUT in Cumberland, MD. The food competition featured meatloaf: Trevor took 2nd place, while John Jester and John Keough tied for 3rd. Justin brewed a 4-gallon batch of kveik on-site at camp, which kicked during the festival.

• COMPETITION:
No formal points competition flight held this month in accordance with annual summer club social tradition. Open bottle share & tap tasting.

• UPCOMING EVENTS:
- Sep 27: Crabs4CRABS Gathering at Guilford Park pavilion in Jessup, MD
- Sep 16: Next C.R.A.B.S. Meeting: Pale, Bitter / Hoppy Styles
- Autumn: Maryland Microbrewery Festival, Das Best Oktoberfest, and BADASS Turkey Shoot Competition

• OPEN FLOOR:
Extensive bottle share featuring member sour ales, summer saisons, and commercial lagers. Meeting adjourned at 9:10 PM.`
  },
  {
    id: 'oct-2025',
    month: 'October 2025',
    date: 'October 15, 2025',
    notes: `C.R.A.B.S. Gathering: October 15, 2025
Location: Heavy Seas Brewery, Halethorpe, MD
Presiding: Joe O'Keefe (President)
Recorded By: Ben Schwalb (Secretary)
Attendees: 27 Members & Guests Present

• CALL TO ORDER:
President Joe O'Keefe called the meeting to order at 7:05 PM, with a warm welcome to several newcomers attending their first C.R.A.B.S. meeting.

• OFFICER REPORTS:
- Treasury (Rob Kiernan): Monthly financial report; active renewals for upcoming 2026 club memberships.
- Competitions (Chris Hermance): Recapped the fall schedule and announced drop-off dates for upcoming winter flights.
- Guild: Greater Baltimore Chapter / Maryland Homebrewers Guild Holiday Party scheduled for late January or early February.

• TECHNICAL EDUCATION:
Charity Homebrewing & Checkerspot Extravaganza Debrief (Club Officers & Event Participants). Debrief on the Checkerspot Homebrew Extravaganza benefiting BARCS animal rescue: 28 homebrew entries, more than double the prior year. Discussion on recipe scaling for charity tap takeovers.

• COMPETITION RESULTS (Amber / Dark, Malty Lagers):
Dark and malty lagers evaluated blind by attendees.
Winner: Justin Wilson (Czech Dark Lager). Constructive sensory feedback on malt depth, decoction character, and clean lager fermentation profiles.

• UPCOMING EVENTS:
- Nov: Upcoming Stouts & Porters Flight
- Dec: Annual C.R.A.B.S. Holiday Party & 750ml Bottle Swap at Heavy Seas
- Winter: Greater Baltimore Chapter / MD Guild Holiday Gathering

• OPEN FLOOR:
Table tasting of homebrew dark lagers, bocks, and seasonal pumpkin beers. Meeting adjourned at 9:12 PM.`
  },
  {
    id: 'dec-2025',
    month: 'December 2025',
    date: 'December 17, 2025',
    notes: `C.R.A.B.S. Gathering: December 17, 2025
Location: Heavy Seas Brewery, Halethorpe, MD
Presiding: Joe O'Keefe (President)
Recorded By: Ben Schwalb (Secretary)
Attendees: 34 Members & Guests Present

• CALL TO ORDER:
Meeting and annual celebration called to order at 7:00 PM by President Joe O'Keefe to celebrate the conclusion of a successful 2025 brewing year.

• OFFICER REPORTS:
- Treasury (Rob Kiernan): Thanked all members for another strong year of club support, insurance, and equipment maintenance.
- Competitions (Chris Hermance): Presented the 2025 year-end Brewer of the Year standings and reviewed the upcoming 2026 competition calendar.
- Guild: Guild holiday gathering confirmed for early winter, hosted jointly with regional Maryland homebrew clubs.

• TECHNICAL EDUCATION & CHARITY:
Community Partnership & Year-End Charity Donations (Joe O'Keefe & Ben Schwalb). In gratitude for hosting C.R.A.B.S. meetings in the taproom, the club organized a generous collection of special homebrews and craft beers for the Heavy Seas crew. Supported charities highlighted: House of Ruth, Pints for Prostates, and Habitat for Humanity.

• HOLIDAY BOTTLE SWAP & AWARDS:
The club held its signature 750ml holiday bottle swap with member-brewed imperial stouts, barleywines, wild ales, and winter warmers exchanged in a blind grab.
Annual Club Champion Trophy Presentation awarded.

• UPCOMING EVENTS:
- Jan 2026: Season Opener — Hedonistic Open Competition (No rules/no styles)
- Jan/Feb 2026: Maryland Homebrewers Guild Chapter Holiday Party
- Feb 2026: UK Beers Flight (British Bitter, Scottish Ale, Irish Red)

• OPEN FLOOR:
Festive potluck buffet, bottle sharing, and toast to 44+ years of C.R.A.B.S. real ale homebrewing fellowship. Meeting adjourned at 9:40 PM.`
  }
];

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

  // New month modal state
  const [isAddingMonth, setIsAddingMonth] = useState<boolean>(false);
  const [newMonthName, setNewMonthName] = useState<string>('');
  const [newMonthDate, setNewMonthDate] = useState<string>('');
  const [newMonthNotes, setNewMonthNotes] = useState<string>('');

  // Persist changes
  const saveMinutesToStorage = (updatedList: SimpleMeetingNote[]) => {
    setMinutesList(updatedList);
    try {
      localStorage.setItem('crabs_meeting_minutes_v1', JSON.stringify(updatedList));
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

  const handleAddNewMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonthName.trim()) return;
    const newId = `month-${Date.now()}`;
    const newEntry: SimpleMeetingNote = {
      id: newId,
      month: newMonthName.trim(),
      date: newMonthDate.trim() || `${newMonthName.trim()} Meeting`,
      notes: newMonthNotes.trim() || `C.R.A.B.S. Gathering: ${newMonthName.trim()}\nNotes dropped here...`
    };

    const updated = [newEntry, ...minutesList];
    saveMinutesToStorage(updated);
    setSelectedMinuteId(newId);
    setIsAddingMonth(false);
    setNewMonthName('');
    setNewMonthDate('');
    setNewMonthNotes('');
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

                <button
                  onClick={() => setIsAddingMonth(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                  title="Add a new month of notes"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-700" />
                  <span>Add Month</span>
                </button>
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

      {/* Add New Month Modal */}
      {isAddingMonth && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  New Minutes Entry
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Add Month to Meeting Minutes
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMonth(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewMonth} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Month Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026"
                    value={newMonthName}
                    onChange={(e) => setNewMonthName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Meeting Date</label>
                  <input
                    type="text"
                    placeholder="e.g. October 21, 2026"
                    value={newMonthDate}
                    onChange={(e) => setNewMonthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Drop in Notes</label>
                <textarea
                  rows={8}
                  placeholder="Paste or type meeting notes here..."
                  value={newMonthNotes}
                  onChange={(e) => setNewMonthNotes(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMonth(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Save Month & Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
