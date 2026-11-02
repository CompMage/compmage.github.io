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
import { MonthlyComp, DEFAULT_ANNUAL_SCHEDULE } from '../data/competitionSchedule';
import { CLUB_RECIPES } from '../data/mockRecipes';
import { Recipe, MemberRegistration } from '../types';

interface OfficerManagementProps {
  onBackToSite: () => void;
  roster: MemberRegistration[];
  onUpdateRoster: (newRoster: MemberRegistration[]) => void;
  competitionResults?: MonthArchive[];
  onUpdateCompetitionResults?: (newResults: MonthArchive[]) => void;
  schedule?: MonthlyComp[];
  onUpdateSchedule?: (newSchedule: MonthlyComp[]) => void;
}

export const OfficerManagement: React.FC<OfficerManagementProps> = ({
  onBackToSite,
  roster,
  onUpdateRoster,
  competitionResults: propCompetitionResults,
  onUpdateCompetitionResults,
  schedule: propSchedule,
  onUpdateSchedule
}) => {
  const [activeTab, setActiveTab] = useState<'minutes' | 'schedule' | 'standings' | 'roster' | 'vault'>('minutes');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // ==========================================
  // 1B. COMPETITION SCHEDULE STATE & ACTIONS
  // ==========================================
  const [scheduleList, setScheduleList] = useState<MonthlyComp[]>(() => {
    if (propSchedule && propSchedule.length > 0) return propSchedule;
    try {
      const stored = localStorage.getItem('crabs_competition_schedule_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ANNUAL_SCHEDULE;
  });

  useEffect(() => {
    if (propSchedule) setScheduleList(propSchedule);
  }, [propSchedule]);

  const saveSchedule = (updated: MonthlyComp[]) => {
    setScheduleList(updated);
    if (onUpdateSchedule) onUpdateSchedule(updated);
    try {
      localStorage.setItem('crabs_competition_schedule_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-schedule-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const activeMonthComp =
    scheduleList.find((m) => m.isCurrentMonth) || scheduleList[10] || scheduleList[0];

  const [editingMonth, setEditingMonth] = useState<MonthlyComp | null>(null);
  const [editCategory, setEditCategory] = useState<string>('');
  const [editBjcp, setEditBjcp] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editGuidelinesText, setEditGuidelinesText] = useState<string>('');
  const [editIsCurrent, setEditIsCurrent] = useState<boolean>(false);

  const openEditMonth = (month: MonthlyComp) => {
    setEditingMonth(month);
    setEditCategory(month.styleCategory);
    setEditBjcp(month.bjcpCode);
    setEditDate(month.meetingDate);
    setEditDesc(month.description);
    setEditGuidelinesText(month.entryGuidelines.join('\n'));
    setEditIsCurrent(Boolean(month.isCurrentMonth));
  };

  const handleSaveMonthEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMonth) return;

    const guidelines = editGuidelinesText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const updated = scheduleList.map((m) => {
      if (m.month === editingMonth.month) {
        return {
          ...m,
          styleCategory: editCategory.trim() || m.styleCategory,
          bjcpCode: editBjcp.trim() || m.bjcpCode,
          meetingDate: editDate.trim() || m.meetingDate,
          description: editDesc.trim() || m.description,
          entryGuidelines: guidelines.length > 0 ? guidelines : m.entryGuidelines,
          isCurrentMonth: editIsCurrent
        };
      }
      if (editIsCurrent) {
        return { ...m, isCurrentMonth: false };
      }
      return m;
    });

    saveSchedule(updated);
    setEditingMonth(null);
    showNotification(`Updated competition schedule for ${editingMonth.month}.`);
  };

  const handleQuickSetActiveMonth = (monthName: string) => {
    const updated = scheduleList.map((m) => ({
      ...m,
      isCurrentMonth: m.month === monthName
    }));
    saveSchedule(updated);
    showNotification(`Set ${monthName} as the active spotlight month on the public site.`);
  };

  const handleResetScheduleDefaults = () => {
    if (window.confirm('Reset all 12 competition months back to club default schedule and guidelines?')) {
      saveSchedule(DEFAULT_ANNUAL_SCHEDULE);
      showNotification('Reset competition schedule to official defaults.');
    }
  };

  // ==========================================
  // 1. MEETING MINUTES STATE & ACTIONS
  // ==========================================
  const [minutesList, setMinutesList] = useState<SimpleMeetingNote[]>(() => {
    try {
      localStorage.removeItem('crabs_meeting_minutes_v1');
      const stored = localStorage.getItem('crabs_meeting_minutes_v2');
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
      localStorage.setItem('crabs_meeting_minutes_v2', JSON.stringify(updated));
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
    if (propCompetitionResults && propCompetitionResults.length > 0) {
      return propCompetitionResults;
    }
    try {
      localStorage.removeItem('crabs_competition_standings_v1');
      const stored = localStorage.getItem('crabs_competition_standings_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MONTHLY_RESULTS;
  });

  useEffect(() => {
    if (propCompetitionResults) {
      setCompetitionResults(propCompetitionResults);
    }
  }, [propCompetitionResults]);

  const saveStandings = (updated: MonthArchive[]) => {
    setCompetitionResults(updated);
    if (onUpdateCompetitionResults) {
      onUpdateCompetitionResults(updated);
    }
    try {
      localStorage.setItem('crabs_competition_standings_v2', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-standings-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetAllStandings = () => {
    if (window.confirm('Are you sure you want to reset all competition standings? This will clear all recorded placements and reset the season leaderboard to 0 points.')) {
      saveStandings([]);
      showNotification('All competition standings have been reset.');
    }
  };

  // Standings input form state
  const [standingsMonth, setStandingsMonth] = useState<string>('November');
  const [standingsStyle, setStandingsStyle] = useState<string>('Porters & Stouts');
  const [standingsBjcp, setStandingsBjcp] = useState<string>('BJCP 13C, 15B-C, 16A-D, 20A-B');
  const [standingsEntriesCount, setStandingsEntriesCount] = useState<number>(14);

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

  const initialRanks: RankTier[] = [
    { place: 1, points: 10, label: '1st Place', entries: [{ id: '1-1', brewer: '', style: '' }] },
    { place: 2, points: 7, label: '2nd Place', entries: [{ id: '2-1', brewer: '', style: '' }] },
    { place: 3, points: 5, label: '3rd Place', entries: [{ id: '3-1', brewer: '', style: '' }] },
    { place: 4, points: 3, label: '4th Place', entries: [{ id: '4-1', brewer: '', style: '' }] },
    { place: 5, points: 2, label: '5th Place', entries: [{ id: '5-1', brewer: '', style: '' }] }
  ];

  const [ranks, setRanks] = useState<RankTier[]>(initialRanks);

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

        // Support splitting on comma, "&", or "/" if typed together
        const names = rawBrewer.includes('&') || rawBrewer.includes(',') || rawBrewer.includes(' / ')
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
    setRanks([
      { place: 1, points: 10, label: '1st Place', entries: [{ id: '1-1', brewer: '', style: '' }] },
      { place: 2, points: 7, label: '2nd Place', entries: [{ id: '2-1', brewer: '', style: '' }] },
      { place: 3, points: 5, label: '3rd Place', entries: [{ id: '3-1', brewer: '', style: '' }] },
      { place: 4, points: 3, label: '4th Place', entries: [{ id: '4-1', brewer: '', style: '' }] },
      { place: 5, points: 2, label: '5th Place', entries: [{ id: '5-1', brewer: '', style: '' }] }
    ]);
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
                    Meeting Minutes · Competition Schedule · Monthly Standings · Club Roster · Recipe Vault
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats Bar */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Month: <strong className="text-white font-mono">{activeMonthComp.month}</strong></span>
              </div>
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
              onClick={() => setActiveTab('schedule')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Competition Schedule</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25">
                {scheduleList.length}
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
        {/* TAB 2: COMPETITION SCHEDULE MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Competition Desk
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Manage Competition Schedule & Monthly Styles
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Update style categories, BJCP codes, meeting dates, and entry guidelines. Choose which month is actively spotlighted on the homebrew competition section.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleResetScheduleDefaults}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  title="Reset all 12 months to club default schedule"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Active Spotlight Summary Banner */}
            {activeMonthComp && (
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Current Active Spotlight on Public Site</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeMonthComp.meetingDate}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {activeMonthComp.month}: {activeMonthComp.styleCategory}
                  </h3>
                  <p className="text-xs text-emerald-400/90 font-mono">
                    {activeMonthComp.bjcpCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openEditMonth(activeMonthComp)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit {activeMonthComp.month} Schedule</span>
                </button>
              </div>
            )}

            {/* 12-Month Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduleList.map((comp) => {
                const isCurrent = Boolean(comp.isCurrentMonth);
                return (
                  <div
                    key={comp.month}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isCurrent
                        ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          isCurrent ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {comp.month}
                        </span>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                            Active Spotlight
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">
                            Month {comp.monthNumber}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white line-clamp-1">
                          {comp.styleCategory}
                        </h4>
                        <p className="text-xs text-amber-400/90 font-mono font-semibold line-clamp-1">
                          {comp.bjcpCode}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {comp.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono">{comp.meetingDate}</span>
                        <span className="text-slate-400">{comp.entryGuidelines.length} entry rules</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                      {!isCurrent ? (
                        <button
                          type="button"
                          onClick={() => handleQuickSetActiveMonth(comp.month)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-400 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          title={`Set ${comp.month} as the active current month on the site`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Set Active</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Current Spotlight</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditMonth(comp)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-700"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit Month</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit Month Modal */}
            {editingMonth && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Edit {editingMonth.month} Competition
                        </h3>
                        <p className="text-xs text-slate-400">
                          Update style, guidelines, and active spotlight status
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingMonth(null)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMonthEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Month
                        </label>
                        <input
                          type="text"
                          disabled
                          value={editingMonth.month}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Meeting Date
                        </label>
                        <input
                          type="text"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          placeholder="e.g. Nov 18, 2026"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Competition Style Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        placeholder="e.g. Porters & Stouts"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        BJCP Code / Reference *
                      </label>
                      <input
                        type="text"
                        required
                        value={editBjcp}
                        onChange={(e) => setEditBjcp(e.target.value)}
                        placeholder="e.g. BJCP 13C, 15B-C, 16A-D, 20A-B"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Description / Style Overview
                      </label>
                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Short summary of eligible beer styles or theme..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-300">
                          Entry Guidelines (One rule per line)
                        </label>
                        <span className="text-[10px] text-slate-500">Each line will become a bullet point</span>
                      </div>
                      <textarea
                        rows={4}
                        value={editGuidelinesText}
                        onChange={(e) => setEditGuidelinesText(e.target.value)}
                        placeholder="13 C only: English Porter&#10;15 B-C: Irish Stout&#10;Bring 2-3 bottles for the judging flight..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Set as Active Spotlight Month
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Displays this month prominently in Section 1 on the public website.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editIsCurrent}
                        onChange={(e) => setEditIsCurrent(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingMonth(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Month Schedule</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BREWER STANDINGS & BOTY POINTS */}
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

                  {/* Placings 1 through 5 - All 5 Ranks Identical & Tie-Enabled */}
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
