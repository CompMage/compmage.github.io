import React from 'react';
import { ExternalLink, Users, MessageCircle, Mail, Globe, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

export const SocialMediaSection: React.FC = () => {
  return (
    <section id="social" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header with Bubble Badge */}
        <div className="max-w-3xl space-y-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200/60">
              <Share2 className="w-3.5 h-3.5 text-red-600" />
              <span>Social Media & Community</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connect with C.R.A.B.S. Online
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Stay plugged in with fellow Maryland homebrewers between monthly Heavy Seas gatherings. Join our active Facebook discussion group, swap recipe critiques, arrange bottle shares, and get real-time club announcements.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Featured Card: Facebook Group (Primary) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-blue-500/30 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-500 transition-all">
            {/* Ambient accent background glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-100 transition-all" />

            <div className="space-y-6 relative z-10">
              {/* Header Badge & Facebook Logo */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Official Facebook Group</span>
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  500+ Local Brewers
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>C.R.A.B.S. Homebrew Group</span>
                </h3>
                <p className="text-xs sm:text-sm font-mono text-slate-500 mt-1">
                  facebook.com/groups/crabshomebrew/
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Our Facebook group is the active digital clubhouse for C.R.A.B.S. members and Maryland homebrewers. Whether you are seeking emergency brew day yeast advice, showcasing a new kegerator build, organizing festival carpools, or discussing regional competitions, this is where the daily conversation happens.
              </p>

              {/* Group Features Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Brew day photo shares & gear troubleshooting</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Real-time meeting reminders & venue changes</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Maryland Guild festival tickets & carpools</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Member-to-member bottle and hop swaps</span>
                </div>
              </div>
            </div>

            {/* Direct CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <span className="text-xs text-slate-500">
                Open to all members, alumni, and prospective homebrewers.
              </span>
              <a
                href="https://www.facebook.com/groups/crabshomebrew/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-sm hover:shadow transition-all group-hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Join C.R.A.B.S. on Facebook</span>
                <ExternalLink className="w-4 h-4 text-blue-200" />
              </a>
            </div>
          </div>

          {/* Secondary Channels Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Club Google Group / Listserv */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all flex-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200/60">
                  <Mail className="w-3.5 h-3.5 text-red-600" />
                  <span>Official Listserv</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">Google Groups</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  C.R.A.B.S. Mailing List
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  crabsbrew@googlegroups.com
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Official club announcements, monthly meeting agendas, minutes releases, and competition drop-off notices sent directly to your email inbox.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:crabsbrew@googlegroups.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Message to crabsbrew@googlegroups.com</span>
                </a>
              </div>
            </div>

            {/* Official Website & Guild Link */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all flex-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>Charter Guild Partner</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">Maryland Guild</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Maryland Homebrewers Guild
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  mdhomebrewers.com
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                C.R.A.B.S. is an active charter member of the Maryland Homebrewers Guild, collaborating on MASHOUT, Guild Holiday Parties, and state-wide competitions.
              </p>
              <div className="pt-2">
                <a
                  href="https://mdhomebrewers.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  <span>Visit mdhomebrewers.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
