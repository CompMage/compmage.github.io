import React, { useState } from 'react';
import { Calendar, RefreshCw, CheckCircle2, Edit3, Check, X, Save } from 'lucide-react';
import { MonthlyComp, DEFAULT_ANNUAL_SCHEDULE } from '../../data/competitionSchedule';

interface ScheduleTabProps {
  scheduleList: MonthlyComp[];
  activeMonthComp: MonthlyComp | undefined;
  onSaveSchedule: (updated: MonthlyComp[]) => void;
  showNotification: (msg: string) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  scheduleList,
  activeMonthComp,
  onSaveSchedule,
  showNotification
}) => {
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

    onSaveSchedule(updated);
    setEditingMonth(null);
    showNotification(`Updated competition schedule for ${editingMonth.month}.`);
  };

  const handleQuickSetActiveMonth = (monthName: string) => {
    const updated = scheduleList.map((m) => ({
      ...m,
      isCurrentMonth: m.month === monthName
    }));
    onSaveSchedule(updated);
    showNotification(`Set ${monthName} as the active spotlight month on the public site.`);
  };

  const handleResetScheduleDefaults = () => {
    if (window.confirm('Reset all 12 competition months back to club default schedule and guidelines?')) {
      onSaveSchedule(DEFAULT_ANNUAL_SCHEDULE);
      showNotification('Reset competition schedule to official defaults.');
    }
  };

  return (
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
  );
};
