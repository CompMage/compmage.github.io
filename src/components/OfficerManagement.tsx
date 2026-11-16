import React, { useState, useEffect } from 'react';
import {
  Shield,
  ArrowLeft,
  FileText,
  Trophy,
  Users,
  BookOpen,
  AlertCircle,
  Calendar,
  CheckCircle2,
  KeyRound,
  LogOut
} from 'lucide-react';
import { SimpleMeetingNote, DEFAULT_MINUTES } from '../data/defaultMinutes';
import { DEFAULT_MONTHLY_RESULTS, MonthArchive } from '../data/competitionStandings';
import { MonthlyComp, DEFAULT_ANNUAL_SCHEDULE } from '../data/competitionSchedule';
import { CLUB_RECIPES } from '../data/mockRecipes';
import { Recipe, MemberRegistration } from '../types';
import {
  STORAGE_KEYS,
  SYNC_EVENTS,
  readCachedList,
  writeCachedList,
  saveStandingsToServer,
  saveScheduleToServer,
  saveMinutesToServer,
  fetchMinutes,
  fetchRecipes,
  saveRecipesToServer
} from '../services/api';
import { MinutesTab } from './officer/MinutesTab';
import { ScheduleTab } from './officer/ScheduleTab';
import { StandingsTab } from './officer/StandingsTab';
import { RosterTab } from './officer/RosterTab';
import { RecipeVaultTab } from './officer/RecipeVaultTab';

export interface OfficerManagementProps {
  onBackToSite: () => void;
  onLogout?: () => void;
  roster: MemberRegistration[];
  onUpdateRoster: (newRoster: MemberRegistration[]) => void;
  competitionResults?: MonthArchive[];
  onUpdateCompetitionResults?: (newResults: MonthArchive[]) => void;
  schedule?: MonthlyComp[];
  onUpdateSchedule?: (newSchedule: MonthlyComp[]) => void;
}

export const OfficerManagement: React.FC<OfficerManagementProps> = ({
  onBackToSite,
  onLogout,
  roster,
  onUpdateRoster,
  competitionResults: propCompetitionResults,
  onUpdateCompetitionResults,
  schedule: propSchedule,
  onUpdateSchedule
}) => {
  const [activeTab, setActiveTab] = useState<'minutes' | 'schedule' | 'standings' | 'roster' | 'vault'>('minutes');
  const [notification, setNotification] = useState<string | null>(null);

  // Security & Password Management State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);

    const storedPassword = localStorage.getItem(STORAGE_KEYS.OFFICER_PASSWORD) || 'crabs1981';
    if (currentPasswordInput.trim() !== storedPassword.trim()) {
      setPasswordChangeError('Current password is incorrect.');
      return;
    }

    if (newPasswordInput.trim().length < 4) {
      setPasswordChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.OFFICER_PASSWORD, newPasswordInput.trim());
    setIsChangingPassword(false);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showNotification('Officer portal password updated successfully.');
  };

  // Competition Schedule State
  const [scheduleList, setScheduleList] = useState<MonthlyComp[]>(() =>
    propSchedule && propSchedule.length > 0
      ? propSchedule
      : readCachedList(STORAGE_KEYS.SCHEDULE, DEFAULT_ANNUAL_SCHEDULE)
  );

  useEffect(() => {
    if (propSchedule && propSchedule.length > 0) setScheduleList(propSchedule);
  }, [propSchedule]);

  const saveSchedule = (updated: MonthlyComp[]) => {
    const nextSchedule = updated.length > 0 ? updated : DEFAULT_ANNUAL_SCHEDULE;
    setScheduleList(nextSchedule);
    if (onUpdateSchedule) onUpdateSchedule(nextSchedule);
    saveScheduleToServer(nextSchedule).catch((err) => console.error('Failed to sync schedule to server:', err));
    writeCachedList(STORAGE_KEYS.SCHEDULE, nextSchedule, SYNC_EVENTS.SCHEDULE);
  };

  const safeScheduleList = scheduleList.length > 0 ? scheduleList : DEFAULT_ANNUAL_SCHEDULE;
  const activeMonthComp =
    safeScheduleList.find((m) => m.isCurrentMonth) ||
    safeScheduleList[10] ||
    safeScheduleList[0] ||
    DEFAULT_ANNUAL_SCHEDULE[10];

  // Meeting Minutes State
  const [minutesList, setMinutesList] = useState<SimpleMeetingNote[]>(() =>
    readCachedList(STORAGE_KEYS.MINUTES, DEFAULT_MINUTES, STORAGE_KEYS.LEGACY_MINUTES)
  );

  useEffect(() => {
    fetchMinutes().then((serverMinutes) => {
      if (serverMinutes && serverMinutes.length > 0) {
        setMinutesList(serverMinutes);
      }
    });
  }, []);

  const saveMinutes = (updated: SimpleMeetingNote[]) => {
    setMinutesList(updated);
    saveMinutesToServer(updated).catch((err) => console.error('Failed to sync minutes to server:', err));
    writeCachedList(STORAGE_KEYS.MINUTES, updated, SYNC_EVENTS.MINUTES);
  };

  // Competition Standings State
  const [competitionResults, setCompetitionResults] = useState<MonthArchive[]>(() =>
    propCompetitionResults && propCompetitionResults.length > 0
      ? propCompetitionResults
      : readCachedList(STORAGE_KEYS.STANDINGS, DEFAULT_MONTHLY_RESULTS, STORAGE_KEYS.LEGACY_STANDINGS, true)
  );

  useEffect(() => {
    if (propCompetitionResults) setCompetitionResults(propCompetitionResults);
  }, [propCompetitionResults]);

  const saveStandings = (updated: MonthArchive[]) => {
    setCompetitionResults(updated);
    if (onUpdateCompetitionResults) onUpdateCompetitionResults(updated);
    saveStandingsToServer(updated).catch((err) => console.error('Failed to sync standings to server:', err));
    writeCachedList(STORAGE_KEYS.STANDINGS, updated, SYNC_EVENTS.STANDINGS);
  };

  // Recipe Vault State
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    readCachedList(STORAGE_KEYS.RECIPES, CLUB_RECIPES)
  );

  useEffect(() => {
    fetchRecipes().then((serverRecipes) => {
      if (serverRecipes && serverRecipes.length > 0) {
        setRecipes(serverRecipes);
      }
    });
  }, []);

  const saveRecipes = (updated: Recipe[]) => {
    setRecipes(updated);
    saveRecipesToServer(updated).catch((err) => console.error('Failed to sync recipes to server:', err));
    writeCachedList(STORAGE_KEYS.RECIPES, updated, SYNC_EVENTS.RECIPES);
  };

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

            {/* Right: Quick Stats & Security Actions */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setPasswordChangeError(null);
                  setCurrentPasswordInput('');
                  setNewPasswordInput('');
                  setConfirmPasswordInput('');
                  setIsChangingPassword(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 hover:border-amber-600 transition-all cursor-pointer shadow-xs"
                title="Change master officer portal password"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Password</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-slate-300 hover:text-red-300 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/80 transition-all cursor-pointer shadow-xs"
                  title="Lock portal and log out of officer session"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Log Out</span>
                </button>
              )}

              <div className="h-5 w-px bg-slate-800 hidden lg:block" />

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
        {activeTab === 'minutes' && (
          <MinutesTab
            minutesList={minutesList}
            onSaveMinutes={saveMinutes}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTab
            scheduleList={scheduleList}
            activeMonthComp={activeMonthComp}
            onSaveSchedule={saveSchedule}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsTab
            competitionResults={competitionResults}
            onSaveStandings={saveStandings}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'roster' && (
          <RosterTab
            roster={roster}
            onUpdateRoster={onUpdateRoster}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'vault' && (
          <RecipeVaultTab
            recipes={recipes}
            onSaveRecipes={saveRecipes}
            showNotification={showNotification}
          />
        )}
      </main>

      {/* MODAL: CHANGE OFFICER PASSWORD */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-950/60 text-amber-400 rounded-lg border border-amber-800/40">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Change Officer Password
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update master password for the C.R.A.B.S. officer portal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter current officer password..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Minimum 4 characters..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {passwordChangeError && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerManagement;
