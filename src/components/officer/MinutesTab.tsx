import React, { useState, useMemo } from 'react';
import { FileText, Plus, Trash2, Edit3, Check, Search } from 'lucide-react';
import { SimpleMeetingNote } from '../../data/defaultMinutes';

interface MinutesTabProps {
  minutesList: SimpleMeetingNote[];
  onSaveMinutes: (updated: SimpleMeetingNote[]) => void;
  showNotification: (msg: string) => void;
}

export const MinutesTab: React.FC<MinutesTabProps> = ({
  minutesList,
  onSaveMinutes,
  showNotification
}) => {
  const [isAddingMonth, setIsAddingMonth] = useState<boolean>(false);
  const [newMonthName, setNewMonthName] = useState<string>('');
  const [newMonthDate, setNewMonthDate] = useState<string>('');
  const [newMonthNotes, setNewMonthNotes] = useState<string>('');
  const [editingMinuteId, setEditingMinuteId] = useState<string | null>(null);
  const [editNotesBuffer, setEditNotesBuffer] = useState<string>('');
  const [minutesSearch, setMinutesSearch] = useState<string>('');

  const filteredMinutes = useMemo(() => {
    const q = minutesSearch.toLowerCase();
    return minutesList.filter(
      (m) => m.month.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q)
    );
  }, [minutesList, minutesSearch]);

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
    onSaveMinutes(updated);
    setIsAddingMonth(false);
    setNewMonthName('');
    setNewMonthDate('');
    setNewMonthNotes('');
    showNotification(`Added "${newEntry.month}" to meeting minutes archive.`);
  };

  const handleDeleteMonth = (id: string, monthName: string) => {
    if (window.confirm(`Delete meeting minutes for "${monthName}"? This will remove it from the public site.`)) {
      const updated = minutesList.filter((m) => m.id !== id);
      onSaveMinutes(updated);
      showNotification(`Deleted meeting minutes for "${monthName}".`);
    }
  };

  const handleSaveEditedNotes = (id: string) => {
    const updated = minutesList.map((m) => (m.id === id ? { ...m, notes: editNotesBuffer } : m));
    onSaveMinutes(updated);
    setEditingMinuteId(null);
    showNotification('Saved updated meeting notes.');
  };

  return (
    <>
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

      {/* MODAL: ADD MONTH */}
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
    </>
  );
};
