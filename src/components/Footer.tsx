import React from 'react';
import { Mail, MapPin, Calendar, Shield } from 'lucide-react';

interface FooterProps {
  onNavClick?: (id: string) => void;
  onOpenOfficerModal?: () => void;
  onOpenOfficerPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOfficerPortal }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        
        {/* Full-width Club Identity & Description stretched across above the footer */}
        <div className="pb-10 border-b border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
                alt="C.R.A.B.S. Logo"
                className="w-12 h-12 object-contain filter drop-shadow-sm shrink-0"
              />
              <div>
                <span className="text-2xl font-black tracking-tight text-white block">
                  C.R.A.B.S.
                </span>
                <span className="text-xs text-slate-300 font-semibold tracking-wide uppercase block">
                  Chesapeake Real Ale Brewers Society
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>Heavy Seas Brewery (Purple Room) · Halethorpe, MD</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>3rd Wednesday Monthly @ 7:00 PM</span>
              </span>
              <a
                href="mailto:crabsbrew@googlegroups.com"
                className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span className="underline-offset-2 hover:underline">crabsbrew@googlegroups.com</span>
              </a>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed w-full">
            C.R.A.B.S. is a homebrewing club that has been meeting regularly since 1981. We brew (and sample) anything from hop drenched pale ales, face puckering sours to the most delicate meads. Our friendly competitions get you feedback on your creations. Meet us at our next meeting and bring your homebrew or favorite commercial brew inspirations.
          </p>
        </div>

        {/* Bottom Tier: Officers Portal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div>
            {onOpenOfficerPortal && (
              <button
                onClick={onOpenOfficerPortal}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Officers Management Portal</span>
              </button>
            )}
          </div>

          <div className="text-center sm:text-right">
            <p className="text-slate-300">© 1981–{new Date().getFullYear()} Chesapeake Real Ale Brewers Society (<a href="https://crabsbrew.org/" className="underline text-slate-200 hover:text-white">crabsbrew.org</a>). All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
