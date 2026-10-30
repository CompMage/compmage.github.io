import React from 'react';
import { Heart, ExternalLink, Mail, MapPin, Calendar, Shield } from 'lucide-react';

interface FooterProps {
  onNavClick?: (id: string) => void;
  onOpenOfficerModal: () => void;
  onOpenOfficerPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOfficerModal, onOpenOfficerPortal }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Tier: Brand, Heavy Seas Host Thanks, and Guild Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Club Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
                alt="C.R.A.B.S. Logo"
                className="w-10 h-10 object-contain filter drop-shadow-sm"
              />
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  C.R.A.B.S.
                </span>
                <span className="text-xs text-slate-300 font-semibold tracking-wide uppercase block">
                  Chesapeake Real Ale Brewers Society
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-sm">
              C.R.A.B.S. is a homebrewing club that has been meeting regularly since 1981. We brew (and sample) anything from hop drenched pale ales, face puckering sours to the most delicate meads. Our friendly competitions get you feedback on your creations. Meet us at our next meeting and bring your homebrew or favorite commercial brew inspirations.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs sm:text-sm text-slate-200">
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
                className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span className="underline-offset-2 hover:underline">crabsbrew@googlegroups.com</span>
              </a>
            </div>
          </div>

          {/* Col 2: Heavy Seas Thanks */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Heart className="w-3.5 h-3.5 fill-amber-300" />
              <span>Special Thanks to Our Host</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Heavy Seas Brewery (Purple Room)
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Warmest thanks to Hugh Sisson and the entire crew at <strong className="text-white font-semibold">Heavy Seas Brewery</strong> for hosting our monthly meetings in the <strong className="text-white font-semibold">Purple Room</strong>. (Go to the back of the taproom past the bathrooms or ask the bartender).
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Heavy+Seas+Beer+4615+Hollins+Ferry+Rd+Halethorpe+MD+21227"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://www.heavyseasbeer.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>heavyseasbeer.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Maryland Homebrewers Guild */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block">
              Affiliation
            </span>
            <h4 className="text-base font-bold text-white">
              The Maryland Homebrewers Guild
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              C.R.A.B.S. is an active member club of <strong className="text-white font-semibold">The Free State Homebrew Club Guild</strong> (Maryland Homebrewers Guild), connecting homebrewers across Maryland through state-wide competitions and shared craft knowledge.
            </p>
            <div className="pt-1">
              <a
                href="https://mdhomebrewers.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-300 hover:text-red-200 transition-colors"
              >
                <span>Visit Maryland Homebrewers Guild</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Officer Roster, Portal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOfficerModal}
              className="text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-slate-300" />
              <span>Officer Roster</span>
            </button>
            {onOpenOfficerPortal && (
              <>
                <span className="text-slate-700">·</span>
                <button
                  onClick={onOpenOfficerPortal}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Officers Management Portal</span>
                </button>
              </>
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
