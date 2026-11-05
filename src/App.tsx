import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMeetings } from './components/AboutMeetings';
import { CompetitionSchedule } from './components/CompetitionSchedule';
import { JoinSection } from './components/JoinSection';
import { BrewingTools } from './components/BrewingTools';
import { RecipeVault } from './components/RecipeVault';
import { SocialMediaSection } from './components/SocialMediaSection';
import { OfficerRosterModal } from './components/OfficerRosterModal';
import { OfficerManagement } from './components/OfficerManagement';
import { OfficerLoginGate } from './components/OfficerLoginGate';
import { Footer } from './components/Footer';
import { MemberRegistration } from './types';
import { DEFAULT_MONTHLY_RESULTS, MonthArchive } from './data/competitionStandings';
import { DEFAULT_ANNUAL_SCHEDULE, MonthlyComp } from './data/competitionSchedule';
import { DEFAULT_ROSTER } from './data/defaultRoster';
import {
  fetchStandings,
  saveStandingsToServer,
  fetchSchedule,
  saveScheduleToServer,
  fetchRoster,
  saveRosterToServer
} from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'site' | 'officers'>(() => {
    return window.location.hash === '#officers' || window.location.hash === '#management' ? 'officers' : 'site';
  });
  const [isOfficerAuthenticated, setIsOfficerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('crabs_officer_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState<boolean>(false);
  const [roster, setRoster] = useState<MemberRegistration[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_member_roster_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ROSTER;
  });

  // Persistent competition results hoisted to root for live synchronization (reset for active season)
  const [competitionResults, setCompetitionResults] = useState<MonthArchive[]>(() => {
    try {
      localStorage.removeItem('crabs_competition_standings_v1'); // purge stale mock standings
      const stored = localStorage.getItem('crabs_competition_standings_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MONTHLY_RESULTS;
  });

  const handleUpdateCompetitionResults = (updated: MonthArchive[]) => {
    setCompetitionResults(updated);
    try {
      localStorage.setItem('crabs_competition_standings_v2', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-standings-updated'));
    } catch (e) {
      console.error(e);
    }
    saveStandingsToServer(updated);
  };

  // Persistent competition schedule hoisted to root for live synchronization
  const [competitionSchedule, setCompetitionSchedule] = useState<MonthlyComp[]>(() => {
    try {
      const stored = localStorage.getItem('crabs_competition_schedule_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ANNUAL_SCHEDULE;
  });

  const handleUpdateCompetitionSchedule = (updated: MonthlyComp[]) => {
    setCompetitionSchedule(updated);
    try {
      localStorage.setItem('crabs_competition_schedule_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('crabs-schedule-updated'));
    } catch (e) {
      console.error(e);
    }
    saveScheduleToServer(updated);
  };

  // Sync with full-stack server on mount so changes on any device are visible
  useEffect(() => {
    fetchStandings().then((serverStandings) => {
      if (serverStandings !== null) {
        setCompetitionResults(serverStandings);
      }
    });

    fetchSchedule().then((serverSchedule) => {
      if (serverSchedule !== null && serverSchedule.length > 0) {
        setCompetitionSchedule(serverSchedule);
      }
    });

    fetchRoster().then((serverRoster) => {
      if (serverRoster !== null) {
        setRoster(serverRoster);
      }
    });
  }, []);

  // Hash listener for direct navigation / bookmarks
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#officers' || window.location.hash === '#management') {
        setCurrentPage('officers');
      } else if (window.location.hash === '' || window.location.hash === '#') {
        setCurrentPage('site');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goToOfficerPortal = () => {
    setCurrentPage('officers');
    window.location.hash = 'officers';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToSite = () => {
    setCurrentPage('site');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOfficerLogout = () => {
    try {
      sessionStorage.removeItem('crabs_officer_authenticated');
    } catch {}
    setIsOfficerAuthenticated(false);
    returnToSite();
  };

  const handleMemberRegistered = async (newMember: MemberRegistration) => {
    let base = roster;
    try {
      const serverCurrent = await fetchRoster();
      if (serverCurrent && Array.isArray(serverCurrent)) {
        base = serverCurrent;
      }
    } catch {}

    const updated = [newMember, ...base.filter((m) => m.id !== newMember.id)];
    setRoster(updated);
    try {
      localStorage.setItem('crabs_member_roster_v1', JSON.stringify(updated));
    } catch {}
    saveRosterToServer(updated);
  };

  const handleUpdateRoster = (updated: MemberRegistration[]) => {
    setRoster(updated);
    try {
      localStorage.setItem('crabs_member_roster_v1', JSON.stringify(updated));
    } catch {}
    saveRosterToServer(updated);
  };

  const handleClearRoster = () => {
    setRoster([]);
    localStorage.removeItem('crabs_member_roster_v1');
    saveRosterToServer([]);
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== 'site') {
      setCurrentPage('site');
      window.location.hash = id;
    }
    setActiveTab(id);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  if (currentPage === 'officers') {
    if (!isOfficerAuthenticated) {
      return (
        <OfficerLoginGate
          onSuccess={() => setIsOfficerAuthenticated(true)}
          onBackToSite={returnToSite}
        />
      );
    }

    return (
      <OfficerManagement
        onBackToSite={returnToSite}
        onLogout={handleOfficerLogout}
        roster={roster}
        onUpdateRoster={handleUpdateRoster}
        competitionResults={competitionResults}
        onUpdateCompetitionResults={handleUpdateCompetitionResults}
        schedule={competitionSchedule}
        onUpdateSchedule={handleUpdateCompetitionSchedule}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900 selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOfficerModal={() => setIsOfficerModalOpen(true)}
        onOpenOfficerPortal={goToOfficerPortal}
        rosterCount={roster.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onJoinClick={() => scrollToSection('join')}
          onCompetitionsClick={() => scrollToSection('competitions')}
        />

        <AboutMeetings />

        <CompetitionSchedule
          competitionResults={competitionResults}
          schedule={competitionSchedule}
        />

        <JoinSection
          onMemberRegistered={handleMemberRegistered}
        />

        <SocialMediaSection />

        <BrewingTools />

        <RecipeVault />
      </main>

      {/* Footer */}
      <Footer
        onNavClick={scrollToSection}
        onOpenOfficerModal={() => setIsOfficerModalOpen(true)}
        onOpenOfficerPortal={goToOfficerPortal}
      />

      {/* Officer Roster Modal */}
      <OfficerRosterModal
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        roster={roster}
        onClearRoster={handleClearRoster}
        onUpdateRoster={handleUpdateRoster}
      />
    </div>
  );
}
