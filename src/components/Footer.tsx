import React from 'react';
import { Beer, Heart, ExternalLink, Mail, MapPin, Calendar, Shield, Download } from 'lucide-react';

interface FooterProps {
  onNavClick: (id: string) => void;
  onOpenOfficerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenOfficerModal }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Tier: Brand, Heavy Seas Host Thanks, and Guild Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          
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
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase block">
                  Chesapeake Real Ale Brewers Society
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              C.R.A.B.S. is a homebrewing club that has been meeting regularly since 1981. We brew (and sample) anything from hop drenched pale ales, face puckering sours to the most delicate meads. Our friendly competitions get you feedback on your creations. Meet us at our next meeting and bring your homebrew or favorite commercial brew inspirations.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Heavy Seas Brewery (Purple Room) · Halethorpe, MD
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                3rd Wednesday Monthly @ 7:00 PM
              </span>
            </div>
          </div>

          {/* Col 2: Heavy Seas Thanks (Explicit Requirement) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Heart className="w-3.5 h-3.5 fill-amber-400" />
              <span>Special Thanks to Our Host</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Heavy Seas Brewery (Purple Room)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Warmest thanks to Hugh Sisson and the entire crew at <strong>Heavy Seas Brewery</strong> for hosting our monthly meetings in the <strong>Purple Room</strong>. (Go to the back of the taproom past the bathrooms or ask the bartender).
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Heavy+Seas+Beer+4615+Hollins+Ferry+Rd+Halethorpe+MD+21227"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
              >
                <MapPin className="w-3 h-3" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://www.heavyseasbeer.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>heavyseasbeer.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Maryland Homebrewers Guild (Explicit Requirement) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 block">
              Affiliation
            </span>
            <h4 className="text-base font-bold text-white">
              The Maryland Homebrewers Guild
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              C.R.A.B.S. is an active member club of <strong>The Free State Homebrew Club Guild</strong> (Maryland Homebrewers Guild), connecting homebrewers across Maryland through state-wide competitions and shared craft knowledge.
            </p>
            <div className="pt-1">
              <a
                href="https://mdhomebrewers.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                <span>Visit Maryland Homebrewers Guild</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>


        {/* Bottom Tier: Quick Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavClick('about')} className="hover:text-white transition-colors">
              About & Meetings
            </button>
            <button onClick={() => onNavClick('competitions')} className="hover:text-white transition-colors">
              Competitions
            </button>
            <button onClick={() => onNavClick('join')} className="hover:text-white transition-colors">
              Join C.R.A.B.S.
            </button>
            <button onClick={() => onNavClick('tools')} className="hover:text-white transition-colors">
              Brewing Tools
            </button>
            <button onClick={() => onNavClick('vault')} className="hover:text-white transition-colors">
              Recipe Vault
            </button>
            <button onClick={onOpenOfficerModal} className="hover:text-white transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Officer Roster</span>
            </button>
            <a
              href="./crabs-brew-iis-deploy.zip"
              download="crabs-brew-iis-deploy.zip"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-400 font-medium"
              title="Download production bundle and web.config for IIS"
            >
              <Download className="w-3 h-3 text-amber-500" />
              <span>IIS Package (.zip)</span>
            </a>
          </div>

          <div className="text-center sm:text-right">
            <p>© 1981–{new Date().getFullYear()} Chesapeake Real Ale Brewers Society (<a href="https://crabsbrew.org/" className="underline hover:text-slate-300">crabsbrew.org</a>). All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
