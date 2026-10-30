import React, { useState, useEffect } from 'react';
import {
  Shield,
  ArrowLeft,
  FileText,
  Trophy,
  Users,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  Download,
  Search,
  ExternalLink,
  Beer,
  Award,
  RefreshCw,
  X,
  Copy,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';
import { SimpleMeetingNote, DEFAULT_MINUTES } from '../data/defaultMinutes';
import {
  DEFAULT_MONTHLY_RESULTS,
  calculateTopBrewers,
  MonthArchive,
  MonthlyPlacement,
  TopBrewer
} from '../data/competitionStandings';
import { CLUB_RECIPES } from '../data/mockRecipes';
import { Recipe, MemberRegistration } from '../types';

interface OfficerManagementProps {
  onBackToSite: () => void;
  roster: MemberRegistration[];
  onUpdateRoster: (newRoster: MemberRegistration[]) => void;
}

export const OfficerManagement: React.FC<OfficerManagementProps> = ({
  onBackToSite,
  roster,
  onUpdateRoster
}) => {
  const [activeTab, setActiveTab] = useState<'minutes' | 'standings' | 'roster' | 'vault'>('minutes');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // ==========================================
  // 1. MEETING MINUTES STATE & ACTIONS
  // ==========================================
  const [minutesList, setMinutesList] = useState<SimpleMeetingNote[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_meeting_minutes_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MINUTES;
  });

  const [isAddingMonth, setIsAddingMonth] = useState<boolean>(false);
  const [newMonthName, setNewMonthName] = useState<string>('');
  const [newMonthDate, setNewMonthDate] = useState<string>('');
  const [newMonthNotes, setNewMonthNotes] = useState<string>('');
  const [editingMinuteId, setEditingMinuteId] = useState<string | null>(null);
  const [editNotesBuffer, setEditNotesBuffer] = useState<string>('');
  const [minutesSearch, setMinutesSearch] = useState<string>('');

  const saveMinutes = (updated: SimpleMeetingNote[]) => {
    setMinutesList(updated);
    try {
      localStorage.setItem('crabs_meeting_minutes_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-minutes-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMonthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonthName.trim()) return;

    const newId = `month-${Date.now()}`;
    const newEntry: SimpleMeetingNote = {
      id: newId,
      month: newMonthName.trim(),
      date: newMonthDate.trim() || `${newMonthName.trim()} Meeting`,
      notes:
        newMonthNotes.trim() ||
        `C.R.A.B.S. Gathering: ${newMonthName.trim()}\nLocation: Heavy Seas Brewery, Halethorpe, MD\nPresiding: Club Officers\n\n• NOTES:\n[Drop in notes here]`
    };

    const updated = [newEntry, ...minutesList];
    saveMinutes(updated);
    setIsAddingMonth(false);
    setNewMonthName('');
    setNewMonthDate('');
    setNewMonthNotes('');
    showNotification(`Added "${newEntry.month}" to meeting minutes archive.`);
  };

  const handleDeleteMonth = (id: string, monthName: string) => {
    if (window.confirm(`Delete meeting minutes for "${monthName}"? This will remove it from the public site.`)) {
      const updated = minutesList.filter((m) => m.id !== id);
      saveMinutes(updated);
      showNotification(`Deleted meeting minutes for "${monthName}".`);
    }
  };

  const handleSaveEditedNotes = (id: string) => {
    const updated = minutesList.map((m) => (m.id === id ? { ...m, notes: editNotesBuffer } : m));
    saveMinutes(updated);
    setEditingMinuteId(null);
    showNotification('Saved updated meeting notes.');
  };

  // ==========================================
  // 2. BREWER STANDINGS STATE & ACTIONS
  // ==========================================
  const [competitionResults, setCompetitionResults] = useState<MonthArchive[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_competition_standings_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MONTHLY_RESULTS;
  });

  const saveStandings = (updated: MonthArchive[]) => {
    setCompetitionResults(updated);
    try {
      localStorage.setItem('crabs_competition_standings_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-standings-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Standings input form state
  const [standingsMonth, setStandingsMonth] = useState<string>('November');
  const [standingsStyle, setStandingsStyle] = useState<string>('Stouts & Porters');
  const [standingsBjcp, setStandingsBjcp] = useState<string>('BJCP 15A-C, 16A-D');
  const [standingsEntriesCount, setStandingsEntriesCount] = useState<number>(14);

  const [place1, setPlace1] = useState<MonthlyPlacement>({ place: 1, points: 10, brewer: '', beerName: '', style: '' });
  const [place2, setPlace2] = useState<MonthlyPlacement>({ place: 2, points: 7, brewer: '', beerName: '', style: '' });
  const [place3, setPlace3] = useState<MonthlyPlacement>({ place: 3, points: 5, brewer: '', beerName: '', style: '' });
  const [place4, setPlace4] = useState<MonthlyPlacement>({ place: 4, points: 3, brewer: '', beerName: '', style: '' });
  const [place5, setPlace5] = useState<MonthlyPlacement>({ place: 5, points: 2, brewer: '', beerName: '', style: '' });

  const handleSaveFlightStandings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!standingsMonth.trim()) return;

    const placings: MonthlyPlacement[] = [
      { ...place1, place: 1, points: 10 },
      { ...place2, place: 2, points: 7 },
      { ...place3, place: 3, points: 5 },
      { ...place4, place: 4, points: 3 },
      { ...place5, place: 5, points: 2 }
    ].filter((p) => p.brewer.trim() !== '');

    if (placings.length === 0) {
      alert('Please enter at least one brewer for 1st place standings.');
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

    // Replace if month already exists, or append
    const exists = competitionResults.some(
      (m) => m.month.toLowerCase() === standingsMonth.trim().toLowerCase()
    );
    let updated: MonthArchive[];
    if (exists) {
      updated = competitionResults.map((m) =>
        m.month.toLowerCase() === standingsMonth.trim().toLowerCase() ? monthArchiveEntry : m
      );
    } else {
      updated = [...competitionResults, monthArchiveEntry];
    }

    saveStandings(updated);
    showNotification(`Recorded ${standingsMonth} competition standings! Brewer of the Year rankings updated.`);

    // Reset inputs
    setPlace1({ place: 1, points: 10, brewer: '', beerName: '', style: '' });
    setPlace2({ place: 2, points: 7, brewer: '', beerName: '', style: '' });
    setPlace3({ place: 3, points: 5, brewer: '', beerName: '', style: '' });
    setPlace4({ place: 4, points: 3, brewer: '', beerName: '', style: '' });
    setPlace5({ place: 5, points: 2, brewer: '', beerName: '', style: '' });
  };

  const handleDeleteFlight = (monthName: string) => {
    if (window.confirm(`Delete standings for ${monthName}? This will recalculate the leaderboards.`)) {
      const updated = competitionResults.filter((m) => m.month !== monthName);
      saveStandings(updated);
      showNotification(`Deleted standings for ${monthName}.`);
    }
  };

  const currentTopBrewers = calculateTopBrewers(competitionResults);

  // ==========================================
  // 3. CLUB ROSTER ACTIONS
  // ==========================================
  const [rosterSearch, setRosterSearch] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberFirst, setNewMemberFirst] = useState('');
  const [newMemberLast, setNewMemberLast] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberType, setNewMemberType] = useState<'individual' | 'family'>('individual');
  const [newMemberExp, setNewMemberExp] = useState('3-5 years (Regular homebrewer)');
  const [newMemberEquip, setNewMemberEquip] = useState('All-in-One Electric System');
  const [newMemberStatus, setNewMemberStatus] = useState<'verified' | 'paid' | 'pending'>('verified');

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberFirst.trim() || !newMemberLast.trim() || !newMemberEmail.trim()) return;

    const newMember: MemberRegistration = {
      id: `CRABS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      firstName: newMemberFirst.trim(),
      lastName: newMemberLast.trim(),
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim() || undefined,
      brewingExperience: newMemberExp,
      equipment: newMemberEquip,
      attendedMeeting: 'yes',
      isFamily: newMemberType === 'family',
      familyMembers: [],
      paymentMethod: 'paypal',
      duesAmount: newMemberType === 'family' ? 40 : 25,
      status: newMemberStatus
    };

    const updated = [newMember, ...roster];
    onUpdateRoster(updated);
    try {
      localStorage.setItem('crabs_member_roster_v1', JSON.stringify(updated));
    } catch {}

    setIsAddingMember(false);
    setNewMemberFirst('');
    setNewMemberLast('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    showNotification(`Added ${newMember.firstName} ${newMember.lastName} to the club roster.`);
  };

  const handleToggleMemberStatus = (id: string) => {
    const updated = roster.map((m) => {
      if (m.id === id) {
        const nextStatus: 'verified' | 'pending' = m.status === 'pending' ? 'verified' : 'pending';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    onUpdateRoster(updated);
    try {
      localStorage.setItem('crabs_member_roster_v1', JSON.stringify(updated));
    } catch {}
    showNotification('Updated member status.');
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (window.confirm(`Remove member "${name}" (${id}) from the active roster?`)) {
      const updated = roster.filter((m) => m.id !== id);
      onUpdateRoster(updated);
      try {
        localStorage.setItem('crabs_member_roster_v1', JSON.stringify(updated));
      } catch {}
      showNotification(`Removed ${name} from roster.`);
    }
  };

  const exportRosterCSV = () => {
    if (roster.length === 0) return;
    const headers = ['Member ID', 'Registration Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Type', 'Dues', 'Status'];
    const rows = roster.map((m) => [
      `"${m.id}"`,
      `"${new Date(m.createdAt).toLocaleDateString()}"`,
      `"${m.firstName}"`,
      `"${m.lastName}"`,
      `"${m.email}"`,
      `"${m.phone || ''}"`,
      `"${m.isFamily ? 'Family' : 'Individual'}"`,
      m.duesAmount,
      `"${m.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CRABS_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // 4. RECIPE VAULT STATE & ACTIONS
  // ==========================================
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_recipes_vault_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return CLUB_RECIPES;
  });

  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('all');
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const saveRecipes = (updated: Recipe[]) => {
    setRecipes(updated);
    try {
      localStorage.setItem('crabs_recipes_vault_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-recipes-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveRecipe = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the recipe "${name}" from the Vault? This will permanently remove it from the public recipe archive.`)) {
      const updated = recipes.filter((r) => r.id !== id);
      saveRecipes(updated);
      if (viewingRecipe?.id === id) setViewingRecipe(null);
      showNotification(`Recipe "${name}" was removed from the Vault.`);
    }
  };

  const handleResetDefaultRecipes = () => {
    if (window.confirm('Reset all Recipe Vault recipes back to club defaults?')) {
      saveRecipes(CLUB_RECIPES);
      showNotification('Recipe Vault reset to defaults.');
    }
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchCat = recipeCategoryFilter === 'all' || r.category === recipeCategoryFilter;
    const q = recipeSearch.toLowerCase();
    const matchSearch =
      r.name.toLowerCase().includes(q) ||
      r.brewer.toLowerCase().includes(q) ||
      r.style.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const filteredRoster = roster.filter((m) => {
    const q = rosterSearch.toLowerCase();
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  });

  const filteredMinutes = minutesList.filter((m) => {
    const q = minutesSearch.toLowerCase();
    return m.month.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3 border border-red-500 font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Branding & Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToSite}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all cursor-pointer shadow-xs"
                title="Return to the public C.R.A.B.S. website"
              >
                <ArrowLeft className="w-4 h-4 text-red-400" />
                <span>Return to Club Site</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
                  alt="C.R.A.B.S. Logo"
                  className="w-9 h-9 object-contain"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black tracking-tight text-white">
                      C.R.A.B.S. Officers Portal
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span>Officer Admin</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Meeting Minutes · Monthly Standings · Club Roster · Recipe Vault Management
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats Bar */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-red-400" />
                <span>Roster: <strong className="text-white font-mono">{roster.length}</strong></span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Flights: <strong className="text-white font-mono">{competitionResults.length}</strong></span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Recipes: <strong className="text-white font-mono">{recipes.length}</strong></span>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60 mt-3">
            <button
              onClick={() => setActiveTab('minutes')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'minutes'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Meeting Minutes</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25">
                {minutesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'standings'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Brewer Standings</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25">
                {competitionResults.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Club Member Roster</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25">
                {roster.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Recipe Vault Management</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25">
                {recipes.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

        {/* ========================================================= */}
        {/* TAB 1: MEETING MINUTES MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'minutes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Officer Minutes Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Manage Meeting Minutes & Drop In Notes
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Add new months, drop in raw notes, or edit past meetings. Updates sync directly with the public website.
                </p>
              </div>

              <button
                onClick={() => setIsAddingMonth(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Month</span>
              </button>
            </div>

            {/* Search toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={minutesSearch}
                  onChange={(e) => setMinutesSearch(e.target.value)}
                  placeholder="Filter minutes by month or text..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                Showing {filteredMinutes.length} of {minutesList.length} recorded months
              </p>
            </div>

            {/* List of recorded months */}
            <div className="space-y-4">
              {filteredMinutes.map((item) => {
                const isEditingThis = editingMinuteId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-red-950/60 text-red-400 rounded-lg border border-red-800/40">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <span>{item.month}</span>
                            <span className="text-xs font-normal text-slate-400">({item.date})</span>
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditingThis ? (
                          <>
                            <button
                              onClick={() => handleSaveEditedNotes(item.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Notes</span>
                            </button>
                            <button
                              onClick={() => setEditingMinuteId(null)}
                              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingMinuteId(item.id);
                                setEditNotesBuffer(item.notes);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit / Drop In</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMonth(item.id, item.month)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer border border-red-900/40"
                              title="Delete this month's notes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content text or textarea */}
                    {isEditingThis ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300">
                          Edit or drop in raw notes (plain text):
                        </label>
                        <textarea
                          rows={12}
                          value={editNotesBuffer}
                          onChange={(e) => setEditNotesBuffer(e.target.value)}
                          className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
                        />
                      </div>
                    ) : (
                      <pre className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                        {item.notes}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BREWER STANDINGS & BOTY POINTS */}
        {/* ========================================================= */}
        {activeTab === 'standings' && (
          <div className="space-y-8">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Competitions Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Enter Monthly Competition Flight Standings
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Put in this month's brewer placings (1st: 10 pts, 2nd: 7 pts, 3rd: 5 pts, 4th: 3 pts, 5th: 2 pts). The Brewer of the Year leaderboard recomputes automatically.
              </p>
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
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Flight Placings (Points Awarded)
                    </p>

                    {/* 1st Place */}
                    <div className="p-3 bg-slate-900/90 border border-amber-500/40 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>1st Place (10 Points) *</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Brewer Name *"
                          value={place1.brewer}
                          onChange={(e) => setPlace1({ ...place1, brewer: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Beer Name"
                          value={place1.beerName}
                          onChange={(e) => setPlace1({ ...place1, beerName: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Style Specification"
                          value={place1.style}
                          onChange={(e) => setPlace1({ ...place1, style: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* 2nd Place */}
                    <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-slate-300">2nd Place (7 Points)</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Brewer Name"
                          value={place2.brewer}
                          onChange={(e) => setPlace2({ ...place2, brewer: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Beer Name"
                          value={place2.beerName}
                          onChange={(e) => setPlace2({ ...place2, beerName: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Style Specification"
                          value={place2.style}
                          onChange={(e) => setPlace2({ ...place2, style: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-amber-600/90">3rd Place (5 Points)</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Brewer Name"
                          value={place3.brewer}
                          onChange={(e) => setPlace3({ ...place3, brewer: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Beer Name"
                          value={place3.beerName}
                          onChange={(e) => setPlace3({ ...place3, beerName: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          placeholder="Style Specification"
                          value={place3.style}
                          onChange={(e) => setPlace3({ ...place3, style: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* 4th & 5th Places */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1">
                        <span className="text-[11px] font-bold text-slate-400">4th Place (3 Points)</span>
                        <input
                          type="text"
                          placeholder="Brewer Name"
                          value={place4.brewer}
                          onChange={(e) => setPlace4({ ...place4, brewer: e.target.value })}
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg space-y-1">
                        <span className="text-[11px] font-bold text-slate-400">5th Place (2 Points)</span>
                        <input
                          type="text"
                          placeholder="Brewer Name"
                          value={place5.brewer}
                          onChange={(e) => setPlace5({ ...place5, brewer: e.target.value })}
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
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
                {/* Live Top Rankings */}
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
                    {currentTopBrewers.slice(0, 5).map((b) => (
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
                    ))}
                  </div>
                </div>

                {/* Monthly Flights List */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <h3 className="text-sm font-bold text-white">
                      Recorded Flights ({competitionResults.length})
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {competitionResults.map((m) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CLUB ROSTER */}
        {/* ========================================================= */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Membership Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Club Membership Roster
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Track dues payment, verify active members, register new brewers, and export official CSV records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportRosterCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setIsAddingMember(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Member</span>
                </button>
              </div>
            </div>

            {/* Roster Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Search members by name, email, ID..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-slate-400">
                Showing {filteredRoster.length} active registered members
              </p>
            </div>

            {/* Roster Table */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-4">Member ID</th>
                      <th className="py-3 px-4">Brewer Name</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Dues Status</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredRoster.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No members matching "{rosterSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredRoster.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-300">
                            {m.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block">
                              {m.firstName} {m.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Joined {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-300 block">{m.email}</span>
                            {m.phone && <span className="text-slate-400 font-mono text-[10px]">{m.phone}</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                              {m.isFamily ? 'Family ($40)' : 'Individual ($25)'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleMemberStatus(m.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                m.status === 'verified' || m.status === 'paid'
                                  ? 'bg-green-950/80 text-green-300 border border-green-800'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              }`}
                              title="Click to toggle status"
                            >
                              {m.status === 'verified' || m.status === 'paid' ? (
                                <>
                                  <Check className="w-3 h-3 text-green-400" />
                                  <span>Dues Paid</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>Pending</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                            {m.brewingExperience}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveMember(m.id, `${m.firstName} ${m.lastName}`)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/50 rounded transition-colors cursor-pointer"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: RECIPE VAULT MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Recipe Archive Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Recipe Vault Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Review all member recipes currently in the vault. You have full authority to inspect formulas and remove recipes from the live site.
                </p>
              </div>

              <button
                onClick={handleResetDefaultRecipes}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                title="Restore default recipe list"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Search recipes by name, brewer, style..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'real-ale', label: 'Real Ale' },
                  { id: 'ipa', label: 'IPA' },
                  { id: 'stout', label: 'Stout' },
                  { id: 'wheat-farmhouse', label: 'Wheat/Farmhouse' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setRecipeCategoryFilter(c.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      recipeCategoryFilter === c.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecipes.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-colors shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded">
                        {r.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{r.abv} ABV</span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">{r.name}</h3>
                    <p className="text-xs text-slate-400">
                      Brewed by <strong className="text-slate-200">{r.brewer}</strong>
                    </p>
                    <p className="text-xs text-slate-300 font-medium">{r.style}</p>

                    {r.award && (
                      <p className="text-[11px] text-amber-300 flex items-center gap-1 line-clamp-1">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>{r.award}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingRecipe(r)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Formula</span>
                    </button>

                    <button
                      onClick={() => handleRemoveRecipe(r.id, r.name)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-red-400 hover:text-red-200 hover:bg-red-950/60 border border-red-900/40 rounded-lg transition-colors cursor-pointer"
                      title="Remove recipe from Vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD MONTH (MOVED FROM PUBLIC MINUTES) */}
      {/* ========================================================= */}
      {isAddingMonth && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Officer Action
                </span>
                <h3 className="text-xl font-black text-white">
                  Add Month to Meeting Minutes
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMonth(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMonthSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Month Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. November 2026"
                    value={newMonthName}
                    onChange={(e) => setNewMonthName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Meeting Date</label>
                  <input
                    type="text"
                    placeholder="e.g. November 18, 2026"
                    value={newMonthDate}
                    onChange={(e) => setNewMonthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Drop in Notes *</label>
                <textarea
                  rows={9}
                  required
                  placeholder="Paste or type meeting notes here..."
                  value={newMonthNotes}
                  onChange={(e) => setNewMonthNotes(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMonth(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save Month & Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD MEMBER MANUALLY */}
      {/* ========================================================= */}
      {isAddingMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Roster Management
                </span>
                <h3 className="text-xl font-black text-white">
                  Add Member to Roster
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMember(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newMemberFirst}
                    onChange={(e) => setNewMemberFirst(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newMemberLast}
                    onChange={(e) => setNewMemberLast(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Email *</label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="410-555-0100"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Membership Type</label>
                  <select
                    value={newMemberType}
                    onChange={(e) => setNewMemberType(e.target.value as 'individual' | 'family')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="individual">Individual ($25)</option>
                    <option value="family">Family ($40)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Dues Status</label>
                  <select
                    value={newMemberStatus}
                    onChange={(e) => setNewMemberStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="verified">Verified / Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW RECIPE IN OFFICER PORTAL */}
      {/* ========================================================= */}
      {viewingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingRecipe(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {viewingRecipe.style}
              </span>
              <h3 className="text-2xl font-black text-white">
                {viewingRecipe.name}
              </h3>
              <p className="text-xs text-slate-400">
                Formulation by <strong>{viewingRecipe.brewer}</strong> · Batch Size: {viewingRecipe.batchSize}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">OG</span>
                <span className="font-mono font-bold text-white">{viewingRecipe.og}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">FG</span>
                <span className="font-mono font-bold text-white">{viewingRecipe.fg}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">ABV</span>
                <span className="font-mono font-bold text-amber-400">{viewingRecipe.abv}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">IBU</span>
                <span className="font-mono font-bold text-red-400">{viewingRecipe.ibu}</span>
              </div>
            </div>

            {/* Grain Bill & Hops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 block">Fermentables:</span>
                <ul className="space-y-1 text-slate-400">
                  {viewingRecipe.fermentables.map((f, i) => (
                    <li key={i} className="flex justify-between border-b border-slate-800 py-0.5">
                      <span>{f.name}</span>
                      <span className="font-mono text-slate-300">{f.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 block">Hop Schedule:</span>
                <ul className="space-y-1 text-slate-400">
                  {viewingRecipe.hops.map((h, i) => (
                    <li key={i} className="flex justify-between border-b border-slate-800 py-0.5">
                      <span>{h.name} ({h.time})</span>
                      <span className="font-mono text-slate-300">{h.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleRemoveRecipe(viewingRecipe.id, viewingRecipe.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 hover:text-white bg-red-950/70 hover:bg-red-900 border border-red-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from Vault</span>
              </button>

              <button
                onClick={() => setViewingRecipe(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
