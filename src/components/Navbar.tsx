import React, { useState } from 'react';
import { Beer, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenOfficerModal?: () => void;
  rosterCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About & Meetings' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'minutes', label: 'Minutes' },
    { id: 'tools', label: 'Brewing Tools' },
    { id: 'vault', label: 'Recipe Vault' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark & Bottle Cap Icon */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg p-1"
          >
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
                alt="C.R.A.B.S. Logo"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-red-700 transition-colors whitespace-nowrap">
                C.R.A.B.S.
              </span>
              <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase whitespace-nowrap">
                Chesapeake Real Ale Brewers Society
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold transition-colors whitespace-nowrap relative py-2 ${
                  activeTab === item.id
                    ? 'text-red-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('join')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all duration-150 active:scale-95 whitespace-nowrap"
            >
              <Beer className="w-4 h-4" />
              <span>Join C.R.A.B.S.</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('join')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
            >
              <Beer className="w-4 h-4" />
              <span>Join C.R.A.B.S.</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
