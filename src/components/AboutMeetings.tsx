import React from 'react';
import { Calendar, MapPin, Beer, Award, Users, ExternalLink, HeartHandshake, BookOpen, Sparkles } from 'lucide-react';

export const AboutMeetings: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-red-600">
            About The Society
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preserving Real Ale, Fostering Craft Brewing in Maryland
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The Chesapeake Real Ale Brewers Society (C.R.A.B.S.) was established in 1981 by a band of passionate 
            Baltimore brewers. For over four decades, our members have promoted traditional cask conditioning, 
            recipe experimentation, and homebrew education across the Free State.
          </p>
        </div>

        {/* 3 Pillar Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Beer className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real Ale & Cask Craft</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We champion traditional unpasteurized, unfiltered beer naturally carbonated in casks or bottles 
              and pulled through authentic beer engines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Monthly Sensory Shares</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every meeting is a friendly technical tasting. Bring your bottles or growlers to receive constructive, 
              BJCP-calibrated feedback from fellow club members.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Competitions & Guild</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Proud member of the Maryland Homebrewers Guild. We participate in state circuit competitions, 
              AHA events, and collaborative guild brews.
            </p>
          </div>
        </div>

        {/* Meeting & Host Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Meeting Details Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded">
                  Regular Meeting Schedule
                </span>
                <span className="text-xs font-mono text-slate-500">Every 3rd Wednesday</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  When & Where We Gather
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Club meetings take place on the <strong>3rd Wednesday of each month</strong> at <strong>7:00 PM</strong>. 
                  Meetings are informal, educational, and fun. Guests and newcomers are always welcome to attend before deciding to join!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Meeting Location</span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Heavy+Seas+Beer+4615+Hollins+Ferry+Rd+Halethorpe+MD+21227"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Directions in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    Heavy Seas Brewery
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Join us in the taproom; ask the bartender for directions to the club gathering area.
                  </p>
                  <p className="text-xs text-slate-500 font-mono pt-1">
                    4615 Hollins Ferry Rd, Halethorpe, MD 21227
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Typical Meeting Agenda</span>
                  <p className="text-sm font-semibold text-slate-900">Monthly Competition Flight & Sensory Share</p>
                  <p className="text-xs text-slate-600">Officer announcements, educational presentation, and member homebrew bottle sampling.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Tip: Feel free to bring 2-3 bottles of your latest homebrew or commercial inspiration!
              </span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Heavy+Seas+Beer+4615+Hollins+Ferry+Rd+Halethorpe+MD+21227"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Heavy Seas on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Partner & Community Gratitude Cards */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Bubble 1: Heavy Seas Card (Lightened) */}
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-100/70 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                    <span>Proud Host & Partner</span>
                  </span>
                </div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900">
                  Thank You, Heavy Seas Brewery!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A tremendous thank you to Hugh Sisson and the entire team at <strong>Heavy Seas Brewery</strong> for their longstanding hospitality in welcoming C.R.A.B.S. for our monthly club gatherings.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Halethorpe, Maryland</span>
                <a
                  href="https://www.heavyseasbeer.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
                >
                  <span>heavyseasbeer.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Bubble 2: Maryland Home Brew Card (Lightened) */}
            <div className="bg-gradient-to-br from-red-50/70 via-white to-red-50/30 border border-red-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-red-800 bg-red-100/70 border border-red-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
                    <HeartHandshake className="w-3.5 h-3.5 text-red-700" />
                    <span>Homebrew Supplies & Partner</span>
                  </span>
                </div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900">
                  Thank You, Maryland Home Brew!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A big thank you to the team at <strong>Maryland Home Brew</strong> for supporting C.R.A.B.S. and our regional brewing community with top-tier grains, hops, yeast cultures, gear, and friendly brewing expertise.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-red-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Columbia, Maryland</span>
                <a
                  href="https://www.mdhb.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 transition-colors"
                >
                  <span>mdhb.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Maryland Guild Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 tracking-wide uppercase">
                  Statewide Network
                </span>
                <a
                  href="https://mdhomebrewers.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  <span>mdhomebrewers.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                The Maryland Homebrewers Guild
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                C.R.A.B.S. is an active member club of <strong>The Free State Homebrew Club Guild</strong> (Maryland Homebrewers Guild), connecting homebrew clubs, brewers, and competitions throughout the state of Maryland.
              </p>
              <div className="pt-2">
                <a
                  href="https://mdhomebrewers.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-red-600 transition-colors"
                >
                  <span>Explore Guild Events & Competitions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Club Officers & Leadership */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-red-600">
                Club Leadership
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Current C.R.A.B.S. Officers
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Elected officers serving the Chesapeake Real Ale Brewers Society
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">President</span>
              <p className="text-sm font-bold text-slate-900">Joe O'Keefe</p>
              <p className="text-[11px] text-slate-500">Club Direction & Meetings</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Vice-President</span>
              <p className="text-sm font-bold text-slate-900">Chris Hermance</p>
              <p className="text-[11px] text-slate-500">Programs & Events</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Treasurer</span>
              <p className="text-sm font-bold text-slate-900">Rob Kiernan</p>
              <p className="text-[11px] text-slate-500">Dues & Finances</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Secretary</span>
              <p className="text-sm font-bold text-slate-900">Ben Schwalb</p>
              <p className="text-[11px] text-slate-500">Communications & Roster</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Guild Representative</span>
              <p className="text-sm font-bold text-slate-900">Tom Flavinh</p>
              <p className="text-[11px] text-slate-500">MD Homebrewers Guild Liaison</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
