import { MemberRegistration } from '../types';

export const DEFAULT_ROSTER: MemberRegistration[] = [
  {
    id: 'CRABS-1981',
    createdAt: new Date('2026-10-15T14:30:00Z').toISOString(),
    firstName: 'David',
    lastName: 'Miller',
    email: 'dmiller@example.com',
    phone: '410-555-0142',
    brewingExperience: '10+ years (Homebrew veteran / Pro)',
    equipment: '3-Vessel All-Grain (Coolers / Keggle)',
    attendedMeeting: 'yes',
    isFamily: false,
    familyMembers: [],
    paymentMethod: 'paypal',
    duesAmount: 25,
    status: 'verified'
  },
  {
    id: 'CRABS-2048',
    createdAt: new Date('2026-10-28T18:15:00Z').toISOString(),
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.brews@example.com',
    brewingExperience: '3-5 years (Regular homebrewer)',
    equipment: 'All-in-One Electric System (Grainfather / Anvil / Clawhammer)',
    attendedMeeting: 'first_time',
    isFamily: true,
    familyMembers: [
      {
        id: 'fam_1',
        name: 'Alex Rostova',
        email: 'alex.rostov@example.com',
        relationship: 'Spouse / Partner'
      }
    ],
    paymentMethod: 'cash_at_meeting',
    duesAmount: 40,
    status: 'pending'
  }
];
