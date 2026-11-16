import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMeetings } from './components/AboutMeetings';
import { CompetitionSchedule } from './components/CompetitionSchedule';
import { JoinSection } from './components/JoinSection';
import { BrewingTools } from './components/BrewingTools';
import { RecipeVault } from './components/RecipeVault';
import { SocialMediaSection } from './components/SocialMediaSection';
import { Footer } from './components/Footer';
import { MemberRegistration } from './types';
import { DEFAULT_MONTHLY_RESULTS, MonthArchive } from './data/competitionStandings';
import { DEFAULT_ANNUAL_SCHEDULE, MonthlyComp } from './data/competitionSchedule';
import { DEFAULT_ROSTER } from './data/defaultRoster';
import {
  STORAGE_KEYS,
  SYNC_EVENTS,
  readCachedList,
  writeCachedList,
  fetchStandings,
  saveStandingsToServer,
  fetchSchedule,
  saveScheduleToServer,
  fetchRoster,
  saveRosterToServer
} from './services/api';

// Code-split admin portal & modal chunks so public visitors don't download officer bundle upfront
const OfficerRosterModal = lazy(() =>
  import('./components/OfficerRosterModal').then((m) => ({ default: m.OfficerRosterModal }))
);
const OfficerManagement = lazy(() =>
  import('./components/OfficerManagement').then((m) => ({ default: m.OfficerManagement }))
);
const OfficerLoginGate = lazy(() =>
  import('./components/OfficerLoginGate').then((m) => ({ default: m.OfficerLoginGate }))
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'site' | 'officers'>(() => {
    return window.location.hash === '#officers' || window.location.hash === '#management' ? 'officers' : 'site';
  });
  const [isOfficerAuthenticated, setIsOfficerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.OFFICER_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState<boolean>(false);

  const [roster, setRoster] = useState<MemberRegistration[]>(() =>
    readCachedList(STORAGE_KEYS.ROSTER, DEFAULT_ROSTER, undefined, true)
  );

  // Persistent competition results hoisted to root for live synchronization
  const [competitionResults, setCompetitionResults] = useState<MonthArchive[]>(() =>
    readCachedList(STORAGE_KEYS.STANDINGS, DEFAULT_MONTHLY_RESULTS, STORAGE_KEYS.LEGACY_STANDINGS, true)
  );

  const handleUpdateCompetitionResults = (updated: MonthArchive[]) => {
    setCompetitionResults(updated);
    writeCachedList(STORAGE_KEYS.STANDINGS, updated, SYNC_EVENTS.STANDINGS);
    saveStandingsToServer(updated);
  };

  // Persistent competition schedule hoisted to root for live synchronization
  const [competitionSchedule, setCompetitionSchedule] = useState<MonthlyComp[]>(() =>
    readCachedList(STORAGE_KEYS.SCHEDULE, DEFAULT_ANNUAL_SCHEDULE)
  );

  const handleUpdateCompetitionSchedule = (updated: MonthlyComp[]) => {
    const nextSchedule = updated.length > 0 ? updated : DEFAULT_ANNUAL_SCHEDULE;
    setCompetitionSchedule(nextSchedule);
    writeCachedList(STORAGE_KEYS.SCHEDULE, nextSchedule, SYNC_EVENTS.SCHEDULE);
    saveScheduleToServer(nextSchedule);
  };

  // Sync with full-stack server in parallel on mount so changes on any device are visible
  useEffect(() => {
    Promise.all([fetchStandings(), fetchSchedule(), fetchRoster()]).then(
      ([serverStandings, serverSchedule, serverRoster]) => {
        if (serverStandings !== null) {
          setCompetitionResults(serverStandings);
        }
        if (serverSchedule !== null && serverSchedule.length > 0) {
          setCompetitionSchedule(serverSchedule);
        }
        if (serverRoster !== null) {
          setRoster(serverRoster);
        }
      }
    );
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
      sessionStorage.removeItem(STORAGE_KEYS.OFFICER_AUTH);
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
    writeCachedList(STORAGE_KEYS.ROSTER, updated);
    saveRosterToServer(updated);
  };

  const handleUpdateRoster = (updated: MemberRegistration[]) => {
    setRoster(updated);
    writeCachedList(STORAGE_KEYS.ROSTER, updated);
    saveRosterToServer(updated);
  };

  const handleClearRoster = () => {
    setRoster([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.ROSTER);
    } catch {}
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
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        {!isOfficerAuthenticated ? (
          <OfficerLoginGate
            onSuccess={() => setIsOfficerAuthenticated(true)}
            onBackToSite={returnToSite}
          />
        ) : (
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
        )}
      </Suspense>
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

      {/* Officer Roster Modal (lazy loaded only when opened) */}
      {isOfficerModalOpen && (
        <Suspense fallback={null}>
          <OfficerRosterModal
            isOpen={isOfficerModalOpen}
            onClose={() => setIsOfficerModalOpen(false)}
            roster={roster}
            onClearRoster={handleClearRoster}
            onUpdateRoster={handleUpdateRoster}
          />
        </Suspense>
      )}
    </div>
  );
}
