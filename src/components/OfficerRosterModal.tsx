import React, { useState } from 'react';
import { X, Shield, Download, Trash2, Mail, Users, Check, AlertCircle } from 'lucide-react';
import { MemberRegistration } from '../types';

interface OfficerRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: MemberRegistration[];
  onClearRoster: () => void;
}

export const OfficerRosterModal: React.FC<OfficerRosterModalProps> = ({
  isOpen,
  onClose,
  roster,
  onClearRoster
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredRoster = roster.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to CSV Function
  const exportToCSV = () => {
    if (roster.length === 0) return;

    const headers = [
      'Member ID',
      'Registration Date',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Membership Type',
      'Dues ($)',
      'Payment Method',
      'Brewing Experience',
      'Equipment',
      'Attended Meeting',
      'Family Members Count',
      'Family Details'
    ];

    const rows = roster.map((m) => {
      const familyDetail = m.familyMembers
        .map((f) => `${f.name} (${f.relationship}: ${f.email})`)
        .join('; ');

      return [
        `"${m.id}"`,
        `"${new Date(m.createdAt).toLocaleDateString()}"`,
        `"${m.firstName}"`,
        `"${m.lastName}"`,
        `"${m.email}"`,
        `"${m.phone || ''}"`,
        `"${m.isFamily ? 'Family' : 'Individual'}"`,
        m.duesAmount,
        `"${m.paymentMethod === 'paypal' ? 'PayPal' : 'Cash at Meeting'}"`,
        `"${m.brewingExperience}"`,
        `"${m.equipment}"`,
        `"${m.attendedMeeting}"`,
        m.familyMembers.length,
        `"${familyDetail}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CRABS_Membership_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-red-700 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Club Officer Membership Roster
              </h3>
              <p className="text-xs text-slate-500">
                President: Joe O'Keefe · VP: Chris Hermance · Treasurer: Rob Kiernan · Secretary: Ben Schwalb · Guild Rep: Tom Flavinh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              disabled={roster.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, email, or member ID..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3 shrink-0 font-medium">
            <span>Total Enrolled: <strong className="text-slate-900 font-mono">{roster.length}</strong></span>
            <span>Total Dues: <strong className="text-red-600 font-mono font-bold">${roster.reduce((acc, m) => acc + m.duesAmount, 0)}</strong></span>
          </div>
        </div>

        {/* Member List Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
          {filteredRoster.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No member registrations recorded yet</p>
              <p>When prospective members submit the sign-up form, they will appear in this roster.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Name & Email</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Experience & Gear</th>
                  <th className="py-2.5 px-3">Family Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {member.id}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="text-[10px] text-slate-400">
                          {member.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.isFamily
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {member.isFamily ? 'Family ($40)' : 'Individual ($25)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.paymentMethod === 'paypal'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {member.paymentMethod === 'paypal' ? 'PayPal Online' : 'Cash at Meeting'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{member.brewingExperience}</div>
                      <div className="text-[10px] text-slate-500">{member.equipment}</div>
                    </td>
                    <td className="py-3 px-3">
                      {member.familyMembers.length > 0 ? (
                        <div className="space-y-0.5">
                          {member.familyMembers.map((fm, idx) => (
                            <div key={idx} className="text-[10px] text-slate-600">
                              <strong>{fm.name}</strong> ({fm.relationship})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
          {roster.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the local roster? Make sure you have exported to CSV first.')) {
                  onClearRoster();
                }
              }}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Roster Data</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
          >
            Close Officer Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
