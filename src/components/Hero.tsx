import React from 'react';
import { Beer, MapPin, ArrowRight, Award } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onToolsClick?: () => void;
  onCompetitionsClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onCompetitionsClick }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-white border-b border-slate-200">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Chesapeake Real Ale <br className="hidden sm:inline" />
                <span className="text-red-600">Brewers Society</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 max-w-2xl font-normal leading-relaxed">
                C.R.A.B.S. is a homebrewing club that has been meeting regularly since 1981. We brew (and sample) anything from hop drenched pale ales, face puckering sours to the most delicate meads. Our friendly competitions get you feedback on your creations. Meet us at our next meeting and bring your homebrew or favorite commercial brew inspirations.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onJoinClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <Beer className="w-5 h-5" />
                <span>Join C.R.A.B.S. Today</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {onCompetitionsClick && (
                <button
                  onClick={onCompetitionsClick}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all border border-slate-300/80 whitespace-nowrap"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Competitions Schedule</span>
                </button>
              )}
            </div>

            {/* Quick Proof Metrics / Club Pillars */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-slate-900">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">1981</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Est. in Baltimore</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-600 tracking-tight font-mono tabular-nums">40+</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Years of Homebrewing</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Heavy Seas</p>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Monthly Meeting Spot</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Emblem & Bottle Cap Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-amber-100 rounded-3xl blur-2xl opacity-70 -z-10" />

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
                    alt="CRABS Chesapeake Real Ale Brewers Society Bottle Cap Logo"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded">
                      Monthly Gathering
                    </span>
                    <span className="text-xs text-slate-600 font-mono">7:00 PM EST</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Heavy Seas Brewery Taproom
                    </h3>
                    <p className="text-xs text-slate-600">
                      Halethorpe, MD · 3rd Wednesday Monthly
                    </p>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Heavy+Seas+Beer+4615+Hollins+Ferry+Rd+Halethorpe+MD+21227"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>4615 Hollins Ferry Rd, Halethorpe (Google Maps)</span>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Bring your homebrew for sensory feedback!</span>
                    <span className="font-semibold text-slate-800">Guests Welcome</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
