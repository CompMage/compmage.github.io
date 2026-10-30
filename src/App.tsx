import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMeetings } from './components/AboutMeetings';
import { CompetitionSchedule } from './components/CompetitionSchedule';
import { JoinSection } from './components/JoinSection';
import { BrewingTools } from './components/BrewingTools';
import { RecipeVault } from './components/RecipeVault';
import { OfficerRosterModal } from './components/OfficerRosterModal';
import { Footer } from './components/Footer';
import { MemberRegistration } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState<boolean>(false);
  const [roster, setRoster] = useState<MemberRegistration[]>([]);

  // Load persistent roster on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('crabs_member_roster_v1');
      if (stored) {
        setRoster(JSON.parse(stored));
      } else {
        // Initial seed sample so officers immediately see the roster layout
        const initialSeed: MemberRegistration[] = [
          {
            id: 'CRABS-1981',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
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
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
        setRoster(initialSeed);
        localStorage.setItem('crabs_member_roster_v1', JSON.stringify(initialSeed));
      }
    } catch (e) {
      console.error('Failed to load roster from localStorage', e);
    }
  }, []);

  const handleMemberRegistered = (newMember: MemberRegistration) => {
    setRoster((prev) => [newMember, ...prev]);
  };

  const handleClearRoster = () => {
    setRoster([]);
    localStorage.removeItem('crabs_member_roster_v1');
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900 selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOfficerModal={() => setIsOfficerModalOpen(true)}
        rosterCount={roster.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onJoinClick={() => scrollToSection('join')}
          onCompetitionsClick={() => scrollToSection('competitions')}
        />

        <AboutMeetings />

        <CompetitionSchedule />

        <JoinSection
          onMemberRegistered={handleMemberRegistered}
        />

        <BrewingTools />

        <RecipeVault />
      </main>

      {/* Footer */}
      <Footer
        onNavClick={scrollToSection}
        onOpenOfficerModal={() => setIsOfficerModalOpen(true)}
      />

      {/* Officer Roster Modal */}
      <OfficerRosterModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        roster={roster}
        onClearRoster={handleClearRoster}
      />
    </div>
  );
}
