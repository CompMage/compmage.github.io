import React, { useState } from 'react';
import { Beer, CheckCircle2, DollarSign, Mail, Plus, Trash2, Printer, ArrowRight, ShieldCheck, CreditCard, Users, HelpCircle } from 'lucide-react';
import { MemberRegistration, FamilyMember } from '../types';

interface JoinSectionProps {
  onMemberRegistered: (member: MemberRegistration) => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ onMemberRegistered }) => {
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [brewingExperience, setBrewingExperience] = useState('1-3 years');
  const [equipment, setEquipment] = useState('All-Grain BIAB');
  const [attendedMeeting, setAttendedMeeting] = useState<'yes' | 'no' | 'first_time'>('first_time');
  
  // Family Membership Toggle & Members
  const [isFamily, setIsFamily] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cash_at_meeting'>('paypal');

  // Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMember, setSubmittedMember] = useState<MemberRegistration | null>(null);

  // Experience Options
  const experienceOptions = [
    'Just starting out / Never brewed',
    'Under 1 year (New to the hobby)',
    '1-3 years (Casual brewer)',
    '3-5 years (Regular homebrewer)',
    '5-10 years (Advanced brewer)',
    '10+ years (Homebrew veteran / Pro)'
  ];

  // Equipment Options
  const equipmentOptions = [
    'Not brewing yet / Interested in learning',
    'Extract / Partial Mash (Kitchen Stovetop)',
    'All-Grain BIAB (Brew in a Bag)',
    '3-Vessel All-Grain (Coolers / Keggle)',
    'All-in-One Electric System (Grainfather / Anvil / Clawhammer)',
    'Cider, Mead, or Wild Fermenter'
  ];

  // Add Family Member Field
  const handleAddFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        id: 'fam_' + Math.random().toString(36).substring(2, 9),
        name: '',
        email: '',
        relationship: 'Spouse / Partner'
      }
    ]);
  };

  const handleUpdateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const handleRemoveFamilyMember = (index: number) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updated);
  };

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (isFamily) {
      familyMembers.forEach((fm, idx) => {
        if (!fm.name.trim()) {
          newErrors[`fam_name_${idx}`] = 'Family member name is required';
        }
        if (!fm.email.trim()) {
          newErrors[`fam_email_${idx}`] = 'Family member email is required';
        } else if (!/\S+@\S+\.\S+/.test(fm.email)) {
          newErrors[`fam_email_${idx}`] = 'Invalid email address';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const duesAmount = isFamily ? 40 : 25;
    const newMember: MemberRegistration = {
      id: 'CRABS-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      brewingExperience,
      equipment,
      attendedMeeting,
      isFamily,
      familyMembers: isFamily ? familyMembers : [],
      paymentMethod,
      duesAmount,
      status: 'pending'
    };

    // Save to LocalStorage
    try {
      const existingRoster = JSON.parse(localStorage.getItem('crabs_member_roster_v1') || '[]');
      existingRoster.unshift(newMember);
      localStorage.setItem('crabs_member_roster_v1', JSON.stringify(existingRoster));
    } catch (err) {
      console.error('Error saving to local storage', err);
    }

    onMemberRegistered(newMember);
    setSubmittedMember(newMember);
    setIsSubmitted(true);
  };

  // Mailto Generator
  const generateMailtoLink = (member: MemberRegistration) => {
    const subject = encodeURIComponent(`CRABS Membership Registration: ${member.firstName} ${member.lastName} (${member.id})`);
    const bodyLines = [
      `Hello CRABS Officers & Treasurer,`,
      ``,
      `Here is a new membership registration for the Chesapeake Real Ale Brewers Society:`,
      `----------------------------------------`,
      `Member ID: ${member.id}`,
      `Name: ${member.firstName} ${member.lastName}`,
      `Email: ${member.email}`,
      `Phone: ${member.phone || 'Not provided'}`,
      `Membership Tier: ${member.isFamily ? 'Family Membership ($40/yr)' : 'Individual Membership ($25/yr)'}`,
      `Brewing Experience: ${member.brewingExperience}`,
      `Brewing Equipment: ${member.equipment}`,
      `Attended a Meeting?: ${member.attendedMeeting}`,
      `Payment Method: ${member.paymentMethod === 'paypal' ? 'PayPal Online' : 'Cash at Next Meeting'}`,
      `Annual Dues: $${member.duesAmount}.00`,
      ``
    ];

    if (member.isFamily && member.familyMembers.length > 0) {
      bodyLines.push(`Family Members Registered:`);
      member.familyMembers.forEach((fm, i) => {
        bodyLines.push(`  ${i + 1}. ${fm.name} (${fm.relationship}) - ${fm.email}`);
      });
      bodyLines.push(``);
    }

    bodyLines.push(`Registered on: ${new Date(member.createdAt).toLocaleString()}`);
    bodyLines.push(`Looking forward to brewing with everyone!`);

    return `mailto:treasurer@crabsbrew.org?subject=${subject}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedMember(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIsFamily(false);
    setFamilyMembers([]);
    setErrors({});
  };

  return (
    <section id="join" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-red-600">
            Membership Registration
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Join C.R.A.B.S. Today
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Become a part of Maryland's historic cask ale and homebrewing society. 
            Enjoy monthly bottle shares, technical workshops, guild access, and great fellowship.
          </p>
        </div>

        {/* Confirmation Screen */}
        {isSubmitted && submittedMember ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in">
            <div className="text-center space-y-3 pb-6 border-b border-slate-200">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                Member ID: {submittedMember.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Welcome to C.R.A.B.S., {submittedMember.firstName}!
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your registration has been saved to the club roster. Please review your confirmation receipt and dues payment details below.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-500">Official Membership Receipt</span>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(submittedMember.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 text-xs">Primary Member:</span>
                  <p className="font-bold text-slate-900">{submittedMember.firstName} {submittedMember.lastName}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Email Address:</span>
                  <p className="font-bold text-slate-900">{submittedMember.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Membership Type:</span>
                  <p className="font-bold text-slate-900">
                    {submittedMember.isFamily ? 'Family Membership' : 'Individual Membership'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Annual Dues:</span>
                  <p className="font-bold text-red-600 font-mono text-base">
                    ${submittedMember.duesAmount}.00 / year
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Brewing Experience:</span>
                  <p className="font-medium text-slate-700">{submittedMember.brewingExperience}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Brewing Setup:</span>
                  <p className="font-medium text-slate-700">{submittedMember.equipment}</p>
                </div>
              </div>

              {/* Family Members Sub-table */}
              {submittedMember.isFamily && submittedMember.familyMembers.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Enrolled Family Members:</span>
                  <div className="mt-2 space-y-1">
                    {submittedMember.familyMembers.map((fm, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded">
                        <span className="font-medium text-slate-800">{fm.name} ({fm.relationship})</span>
                        <span className="text-slate-500 font-mono">{fm.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Status / Note */}
              <div className="p-4 rounded-lg bg-red-50/70 border border-red-100 text-xs sm:text-sm text-slate-800 space-y-1.5">
                <span className="font-bold text-red-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Payment Method: {submittedMember.paymentMethod === 'paypal' ? 'PayPal Online Payment' : 'Cash at Club Meeting'}
                </span>
                {submittedMember.paymentMethod === 'paypal' ? (
                  <p className="text-slate-600">
                    To complete your registration online, please send <strong>${submittedMember.duesAmount}.00</strong> via PayPal to <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-bold font-mono">treasurer@crabsbrew.org</code> (or click the PayPal button below). Include your Member ID <span className="font-mono font-bold">({submittedMember.id})</span> in the payment note.
                  </p>
                ) : (
                  <p className="text-slate-600">
                    Bring <strong>${submittedMember.duesAmount}.00 in cash</strong> to the next monthly meeting on the 3rd Wednesday at Heavy Seas Brewery. Give it to the Club Treasurer to receive your receipt and membership sticker.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <div className="flex flex-wrap gap-3">
                <a
                  href={generateMailtoLink(submittedMember)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>Email Registration to Officers</span>
                </a>

                {submittedMember.paymentMethod === 'paypal' && (
                  <a
                    href="https://www.paypal.com/signin"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Open PayPal to Send ${submittedMember.duesAmount}</span>
                  </a>
                )}

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 underline"
              >
                Register Another Member
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Sign-Up Form */
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* Membership Tier Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Membership Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFamily(false);
                    setFamilyMembers([]);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    !isFamily
                      ? 'border-red-600 bg-white shadow-sm ring-2 ring-red-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Individual Membership</span>
                    <span className="text-base font-extrabold text-red-600 font-mono">$25 / yr</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Single member with full voting privileges, meeting access, and guild competition eligibility.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFamily(true);
                    if (familyMembers.length === 0) {
                      handleAddFamilyMember();
                    }
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    isFamily
                      ? 'border-red-600 bg-white shadow-sm ring-2 ring-red-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-red-600" />
                      Family Membership
                    </span>
                    <span className="text-base font-extrabold text-red-600 font-mono">$40 / yr</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Includes spouse, partner, or co-habiting adult family members under one household dues plan.
                  </p>
                </button>
              </div>
            </div>

            {/* Member Contact Information */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Member Information (Name & Email Required)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 ${
                      errors.firstName ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-red-600'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Smith"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 ${
                      errors.lastName ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-red-600'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. brewer@example.com"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-red-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 410-555-0199"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Family Members Sub-Form */}
            {isFamily && (
              <div className="space-y-4 pt-4 border-t border-slate-200 bg-red-50/40 p-4 rounded-xl border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-red-900 block">
                      Family Members Included in Membership
                    </label>
                    <p className="text-xs text-slate-600">
                      Add your family member(s) with their contact information and relationship.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                {familyMembers.map((fam, index) => (
                  <div key={fam.id} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Family Member #{index + 1}</span>
                      {familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFamilyMember(index)}
                          className="text-xs text-slate-400 hover:text-red-600 p-1"
                          title="Remove family member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={fam.name}
                          onChange={(e) => handleUpdateFamilyMember(index, 'name', e.target.value)}
                          placeholder="e.g. Jane Smith"
                          className={`w-full px-2.5 py-2 bg-slate-50 border rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600 ${
                            errors[`fam_name_${index}`] ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors[`fam_name_${index}`] && (
                          <p className="text-[10px] text-red-600 mt-0.5">{errors[`fam_name_${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={fam.email}
                          onChange={(e) => handleUpdateFamilyMember(index, 'email', e.target.value)}
                          placeholder="e.g. jane@example.com"
                          className={`w-full px-2.5 py-2 bg-slate-50 border rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600 ${
                            errors[`fam_email_${index}`] ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors[`fam_email_${index}`] && (
                          <p className="text-[10px] text-red-600 mt-0.5">{errors[`fam_email_${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          Relationship
                        </label>
                        <select
                          value={fam.relationship}
                          onChange={(e) => handleUpdateFamilyMember(index, 'relationship', e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option value="Spouse / Partner">Spouse / Partner</option>
                          <option value="Adult Child (21+)">Adult Child (21+)</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Co-Habiting Household">Other Household Member</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Brewing Background Questions */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Brewing Background & Experience
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    How long have you been brewing?
                  </label>
                  <select
                    value={brewingExperience}
                    onChange={(e) => setBrewingExperience(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    {experienceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What do you brew on? (Equipment)
                  </label>
                  <select
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-red-600"
                  >
                    {equipmentOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Have you attended a C.R.A.B.S. meeting yet?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    attendedMeeting === 'yes' ? 'border-red-600 bg-white ring-1 ring-red-600 text-slate-900' : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="attended"
                      checked={attendedMeeting === 'yes'}
                      onChange={() => setAttendedMeeting('yes')}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span>Yes, attended a meeting</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    attendedMeeting === 'first_time' ? 'border-red-600 bg-white ring-1 ring-red-600 text-slate-900' : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="attended"
                      checked={attendedMeeting === 'first_time'}
                      onChange={() => setAttendedMeeting('first_time')}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span>Planning to attend next meeting</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    attendedMeeting === 'no' ? 'border-red-600 bg-white ring-1 ring-red-600 text-slate-900' : 'border-slate-200 bg-white text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="attended"
                      checked={attendedMeeting === 'no'}
                      onChange={() => setAttendedMeeting('no')}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span>Not yet / Joining online first</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Dues & Payment Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Annual Dues & Payment Selection
                </label>
                <span className="text-sm font-extrabold text-red-600 font-mono">
                  Total Dues: ${isFamily ? '40' : '25'}.00
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PayPal Option */}
                <div
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-red-600 bg-white shadow-sm ring-2 ring-red-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#0070BA]" />
                      Pay Online via PayPal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                    Submit your registration, then send <strong>${isFamily ? '40' : '25'}</strong> to <span className="font-mono font-semibold text-slate-800">treasurer@crabsbrew.org</span> via PayPal with your name in the payment notes.
                  </p>
                </div>

                {/* Cash at Meeting Option */}
                <div
                  onClick={() => setPaymentMethod('cash_at_meeting')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_at_meeting'
                      ? 'border-red-600 bg-white shadow-sm ring-2 ring-red-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash_at_meeting'}
                      onChange={() => setPaymentMethod('cash_at_meeting')}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Pay Cash at Monthly Meeting
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                    See our Club Treasurer (Rob Kiernan) in person during any monthly gathering at Heavy Seas Brewery to pay cash and receive your membership card.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span>By submitting, you agree to receive club updates and meeting agendas.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <Beer className="w-5 h-5" />
                <span>Submit Membership Registration</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
