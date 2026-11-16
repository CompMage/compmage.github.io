import React, { useState, useRef, useMemo } from 'react';
import { Upload, Download, Plus, Search, Check, Clock, Trash2 } from 'lucide-react';
import { MemberRegistration } from '../../types';
import {
  downloadRosterCSV,
  parseRosterCSVText,
  BREWING_EXPERIENCE_OPTIONS,
  STORAGE_KEYS,
  writeCachedList
} from '../../services/api';

interface RosterTabProps {
  roster: MemberRegistration[];
  onUpdateRoster: (newRoster: MemberRegistration[]) => void;
  showNotification: (msg: string) => void;
}

export const RosterTab: React.FC<RosterTabProps> = ({
  roster,
  onUpdateRoster,
  showNotification
}) => {
  const [rosterSearch, setRosterSearch] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberFirst, setNewMemberFirst] = useState('');
  const [newMemberLast, setNewMemberLast] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberType, setNewMemberType] = useState<'individual' | 'family'>('individual');
  const [newMemberExp, setNewMemberExp] = useState('3-5 years (Regular homebrewer)');
  const [newMemberEquip] = useState('All-in-One Electric System');
  const [newMemberStatus, setNewMemberStatus] = useState<'verified' | 'paid' | 'pending'>('verified');

  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const filteredRoster = useMemo(() => {
    const q = rosterSearch.toLowerCase();
    return roster.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [roster, rosterSearch]);

  const persistRoster = (updated: MemberRegistration[]) => {
    onUpdateRoster(updated);
    writeCachedList(STORAGE_KEYS.ROSTER, updated);
  };

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

    persistRoster([newMember, ...roster]);
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
    persistRoster(updated);
    showNotification('Updated member status.');
  };

  const handleUpdateMemberExperience = (id: string, newExp: string) => {
    const updated = roster.map((m) => (m.id === id ? { ...m, brewingExperience: newExp } : m));
    persistRoster(updated);
    showNotification('Updated brewer experience level.');
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (window.confirm(`Remove member "${name}" (${id}) from the active roster?`)) {
      persistRoster(roster.filter((m) => m.id !== id));
      showNotification(`Removed ${name} from roster.`);
    }
  };

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          showNotification('CSV file is empty.');
          return;
        }

        const newMembers = parseRosterCSVText(text);
        if (newMembers.length > 0) {
          const existingIds = new Set(roster.map((m) => m.id));
          const deduplicatedNew = newMembers.map((m) =>
            existingIds.has(m.id)
              ? { ...m, id: `CRABS-${Math.floor(1000 + Math.random() * 9000)}` }
              : m
          );
          persistRoster([...deduplicatedNew, ...roster]);
          showNotification(`Successfully imported ${deduplicatedNew.length} member(s) from CSV!`);
        } else {
          showNotification('No valid member records found in CSV.');
        }
      } catch (err: any) {
        console.error('Error importing CSV:', err);
        showNotification(err?.message || 'Failed to parse CSV file. Please verify CSV format.');
      }
    };

    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <>
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
            <input
              type="file"
              ref={csvInputRef}
              onChange={handleCSVFileChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => csvInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              title="Import members from CSV spreadsheet"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Import CSV</span>
            </button>
            <button
              onClick={() => downloadRosterCSV(roster, false)}
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
              <span>Add Member</span>
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
                      <td className="py-3 px-4">
                        <select
                          value={m.brewingExperience || '3-5 years (Regular homebrewer)'}
                          onChange={(e) => handleUpdateMemberExperience(m.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer w-full max-w-[210px] truncate"
                          title="Change brewer experience level"
                        >
                          {m.brewingExperience &&
                            !(BREWING_EXPERIENCE_OPTIONS as readonly string[]).includes(m.brewingExperience) && (
                              <option value={m.brewingExperience}>{m.brewingExperience}</option>
                            )}
                          {BREWING_EXPERIENCE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
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

      {/* MODAL: ADD MEMBER MANUALLY */}
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="verified">Verified / Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Brewing Experience Level</label>
                <select
                  value={newMemberExp}
                  onChange={(e) => setNewMemberExp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {BREWING_EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
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
    </>
  );
};
