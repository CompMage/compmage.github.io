import React, { useState } from 'react';
import { Calculator, ExternalLink, Flame, Droplets, Info, Sparkles, RefreshCw, Check, Scale, ArrowRightLeft, HelpCircle } from 'lucide-react';

export const BrewingTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'abv' | 'strike' | 'brix'>('abv');

  // ABV Calculator State
  const [og, setOg] = useState<number>(1.054);
  const [fg, setFg] = useState<number>(1.012);

  // Strike Water Calculator State
  const [grainWeight, setGrainWeight] = useState<number>(11.5);
  const [targetMashTemp, setTargetMashTemp] = useState<number>(152);
  const [grainTemp, setGrainTemp] = useState<number>(68);
  const [waterGrainRatio, setWaterGrainRatio] = useState<number>(1.35); // qt/lb
  const [tunLoss, setTunLoss] = useState<number>(2.0); // deg F

  // Brix to SG Converter State
  const [brixMode, setBrixMode] = useState<'preferment' | 'postferment'>('preferment');
  const [brixInput, setBrixInput] = useState<number>(13.5);
  const [wcf, setWcf] = useState<number>(1.04); // Wort correction factor (1.04 for beer wort, 1.00 for pure sugar/wine)
  const [origBrix, setOrigBrix] = useState<number>(13.5);
  const [currentBrix, setCurrentBrix] = useState<number>(6.5);

  // Calculate ABV
  const calculateAbv = () => {
    if (og <= fg || og <= 1.0) {
      return { standard: 0, alternate: 0, attenuation: 0, calories: 0 };
    }
    const standard = (og - fg) * 131.25;
    // Palmer Alternate equation for high gravity brews
    const alternate = (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
    const attenuation = ((og - fg) / (og - 1.0)) * 100;
    // Calorie approximation per 12oz (355ml)
    const calories = Math.max(0, (1881.22 * (og - fg)) + (3550.0 * (fg - 1.0)));

    return {
      standard: Number(standard.toFixed(2)),
      alternate: Number(alternate.toFixed(2)),
      attenuation: Number(attenuation.toFixed(1)),
      calories: Math.round(calories)
    };
  };

  // Calculate Strike Water
  const calculateStrikeWater = () => {
    // Formula: Tw = (0.2 / r) * (Tm - Tg) + Tm + TunLoss
    const r = waterGrainRatio;
    const strikeTemp = (0.2 / r) * (targetMashTemp - grainTemp) + targetMashTemp + tunLoss;
    const totalQuarts = grainWeight * r;
    const totalGallons = totalQuarts / 4;

    return {
      strikeTemp: Number(strikeTemp.toFixed(1)),
      totalQuarts: Number(totalQuarts.toFixed(2)),
      totalGallons: Number(totalGallons.toFixed(2))
    };
  };

  // Calculate Brix to Specific Gravity (Pre-fermentation unfermented wort/must)
  const calculateBrixToSg = () => {
    const validWcf = wcf > 0 ? wcf : 1.0;
    const correctedBrix = brixInput / validWcf;
    
    // Standard ASBC formula used by Brewer's Friend
    const denom = 258.6 - ((correctedBrix / 258.2) * 227.1);
    const sg = denom !== 0 ? 1 + (correctedBrix / denom) : 1.0;
    const plato = correctedBrix;
    const baume = sg > 0 ? 145 - (145 / sg) : 0;
    const potentialAbv = Math.max(0, (sg - 1.0) * 131.25);
    const ruleOfThumbSg = 1 + (correctedBrix * 4) / 1000;

    return {
      sg: Number(sg.toFixed(3)),
      plato: Number(plato.toFixed(1)),
      baume: Number(baume.toFixed(1)),
      potentialAbv: Number(potentialAbv.toFixed(2)),
      ruleOfThumbSg: Number(ruleOfThumbSg.toFixed(3)),
      correctedBrix: Number(correctedBrix.toFixed(2))
    };
  };

  // Calculate Refractometer with Alcohol (During/Post-fermentation)
  const calculateRefractometerAlcohol = () => {
    const validWcf = wcf > 0 ? wcf : 1.0;
    const ob = origBrix / validWcf;
    const cb = currentBrix / validWcf;

    // Estimated Original Gravity from initial Brix
    const ogDenom = 258.6 - ((ob / 258.2) * 227.1);
    const ogEst = ogDenom !== 0 ? 1 + (ob / ogDenom) : 1.0;

    // Sean Terrill's Refractometer Final Gravity correction formula
    const fgEst = 1.0 - (0.004493 * ob) + (0.011774 * cb) + (0.00027581 * Math.pow(ob, 2)) - (0.0012717 * Math.pow(cb, 2)) - (0.00000728 * Math.pow(ob, 3)) + (0.000063293 * Math.pow(cb, 3));
    
    const validFg = Math.max(0.990, Math.min(ogEst, fgEst));
    const abv = Math.max(0, (ogEst - validFg) * 131.25);
    const attenuation = ogEst > 1.0 ? Math.max(0, Math.min(100, ((ogEst - validFg) / (ogEst - 1.0)) * 100)) : 0;

    return {
      og: Number(ogEst.toFixed(3)),
      fg: Number(validFg.toFixed(3)),
      abv: Number(abv.toFixed(2)),
      attenuation: Number(attenuation.toFixed(1))
    };
  };

  const abvResults = calculateAbv();
  const strikeResults = calculateStrikeWater();
  const brixResults = calculateBrixToSg();
  const refractometerResults = calculateRefractometerAlcohol();

  return (
    <section id="tools" className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-red-600">
              Club Brewhouse Utilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Brewing Calculators & Reference
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Fast, reliable in-app calculations for your brewday, backed with direct reference links to 
              Brewer's Friend tools.
            </p>
          </div>

          {/* Tool Segmented Switch */}
          <div className="flex flex-wrap items-center p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0 gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTool('abv')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTool === 'abv'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>ABV Calculator</span>
            </button>

            <button
              onClick={() => setActiveTool('strike')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTool === 'strike'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Strike Water Temp</span>
            </button>

            <button
              onClick={() => setActiveTool('brix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTool === 'brix'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Brix to SG Converter</span>
            </button>
          </div>
        </div>

        {/* ABV Calculator Panel */}
        {activeTool === 'abv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Alcohol by Volume & Attenuation
                </span>
                <span className="text-xs text-slate-400 font-mono">Formula: Standard & Palmer</span>
              </div>

              {/* OG Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Original Gravity (OG)
                  </label>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {og.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.020"
                  max="1.120"
                  step="0.001"
                  value={og}
                  onChange={(e) => setOg(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex gap-2 pt-1">
                  {[1.040, 1.050, 1.065, 1.080].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setOg(preset)}
                      className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-mono"
                    >
                      {preset.toFixed(3)}
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.001"
                    min="1.000"
                    max="1.150"
                    value={og}
                    onChange={(e) => setOg(parseFloat(e.target.value) || 1.0)}
                    className="ml-auto w-20 px-2 py-0.5 text-xs font-mono text-right border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* FG Input */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Final Gravity (FG)
                  </label>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {fg.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.990"
                  max="1.040"
                  step="0.001"
                  value={fg}
                  onChange={(e) => setFg(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex gap-2 pt-1">
                  {[1.008, 1.010, 1.014, 1.018].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFg(preset)}
                      className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-mono"
                    >
                      {preset.toFixed(3)}
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.001"
                    min="0.990"
                    max="1.050"
                    value={fg}
                    onChange={(e) => setFg(parseFloat(e.target.value) || 1.0)}
                    className="ml-auto w-20 px-2 py-0.5 text-xs font-mono text-right border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* Outbound Link Box to Brewer's Friend ABV Calculator */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Need plato conversions, refractometer correction, or hydrometer temp calibration?
                </span>
                <a
                  href="https://www.brewersfriend.com/abv-calculator/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline shrink-0"
                >
                  <span>Open Brewer's Friend ABV Calculator</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Calculated Strength
              </span>

              <div className="p-6 rounded-xl bg-slate-900 text-white space-y-2 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Alcohol By Volume
                </span>
                <div className="text-5xl font-black text-amber-400 font-mono tabular-nums">
                  {abvResults.standard}%
                </div>
                <p className="text-xs text-slate-400">
                  Alternate Palmer Formula: <span className="font-mono text-white font-bold">{abvResults.alternate}%</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block">Apparent Attenuation</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {abvResults.attenuation}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block">Est. Calories / 12 oz</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {abvResults.calories} kcal
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Flavor Profile & Character:</p>
                <p>
                  {abvResults.standard < 4.0 && 'Light, delicate session ale with high drinkability.'}
                  {abvResults.standard >= 4.0 && abvResults.standard <= 5.5 && 'Classic pub strength real ale with balanced malt presence and pleasant finish.'}
                  {abvResults.standard > 5.5 && abvResults.standard <= 7.5 && 'Robust craft standard. Moderate warming alcohol with assertive grain foundation.'}
                  {abvResults.standard > 7.5 && 'High-gravity brew. Rich ethanol warmth, suitable for cellar conditioning or cask dry hopping.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Strike Water Calculator Panel (The Fixed Calculator) */}
        {activeTool === 'strike' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mash Strike Water Temperature
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Fixed Link & Formula
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Thermodynamic Balance</span>
              </div>

              {/* Tun Fix Notice */}
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Fix for the Strike Water Calculator:</span>
                </p>
                <p className="text-amber-800 leading-relaxed">
                  The original legacy link had broken scripts. The official, working Brewer's Friend mash infusion tool is located at <code className="bg-white/70 px-1 py-0.5 rounded font-mono font-bold">brewersfriend.com/mash/</code>. You can use our real-time in-app calculator below or click the direct link to open Brewer's Friend.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Grain Weight */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Grain Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    value={grainWeight}
                    onChange={(e) => setGrainWeight(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                  />
                </div>

                {/* Target Mash Temp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Mash Temp (°F)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="140"
                    max="165"
                    value={targetMashTemp}
                    onChange={(e) => setTargetMashTemp(parseFloat(e.target.value) || 140)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                  />
                </div>

                {/* Initial Grain Temp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Grain Temp (°F)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="32"
                    max="95"
                    value={grainTemp}
                    onChange={(e) => setGrainTemp(parseFloat(e.target.value) || 68)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Room temperature dry grain</span>
                </div>

                {/* Water-to-Grain Ratio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Water-to-Grain Ratio (qt/lb)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="2.5"
                    value={waterGrainRatio}
                    onChange={(e) => setWaterGrainRatio(parseFloat(e.target.value) || 1.25)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Standard range: 1.25 - 1.50</span>
                </div>
              </div>

              {/* Mash Tun Thermal Loss */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Mash Tun Pre-heating / Thermal Loss (°F)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-800">+{tunLoss}°F</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.5"
                  value={tunLoss}
                  onChange={(e) => setTunLoss(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <span className="text-[11px] text-slate-500">
                  Compensates for cooler/kettle temperature absorption before stirring in grain.
                </span>
              </div>

              {/* Outbound Link to Fixed Brewer's Friend Mash Calculator */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Looking for multi-step infusions or decoction rests?
                </span>
                <a
                  href="https://www.brewersfriend.com/mash/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline shrink-0"
                >
                  <span>Open Brewer's Friend Mash Calculator (Fixed)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Strike Water Target
              </span>

              <div className="p-6 rounded-xl bg-slate-900 text-white space-y-2 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Strike Water Temperature
                </span>
                <div className="text-5xl font-black text-amber-400 font-mono tabular-nums">
                  {strikeResults.strikeTemp}°F
                </div>
                <p className="text-xs text-slate-400">
                  Heat your strike water to this temperature before dough-in
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block">Strike Water Volume</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {strikeResults.totalGallons} Gal
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">({strikeResults.totalQuarts} Quarts)</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 block">Target Mash Profile</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {targetMashTemp}°F
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {targetMashTemp < 150 ? 'High Fermentability' : targetMashTemp <= 153 ? 'Balanced Body' : 'Full & Sweet'}
                  </span>
                </div>
              </div>

              {/* Mash Profiles Quick Reference */}
              <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-800">Saccharification Rest Quick Targets:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>148°F–150°F:</span>
                    <span className="text-slate-500 font-medium">Dry & Crisp (Saisons, West Coast IPAs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>152°F–154°F:</span>
                    <span className="text-slate-500 font-medium">Medium Body (Bitters, Pale Ales, Browns)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>156°F–158°F:</span>
                    <span className="text-slate-500 font-medium">Full & Chewy (Stouts, Scottish Ales, Milds)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brix to Specific Gravity Calculator Panel */}
        {activeTool === 'brix' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Brix & Refractometer Converter
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Convert Brix (°Bx) to Specific Gravity (SG)
                  </h3>
                </div>
                
                {/* Sub-mode switcher */}
                <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setBrixMode('preferment')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                      brixMode === 'preferment'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Unfermented Wort
                  </button>
                  <button
                    onClick={() => setBrixMode('postferment')}
                    className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                      brixMode === 'postferment'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    With Alcohol Present
                  </button>
                </div>
              </div>

              {brixMode === 'preferment' ? (
                /* MODE 1: UNFERMENTED WORT CONVERSION */
                <div className="space-y-6">
                  {/* Brix Input Slider & Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Refractometer / Hydrometer Brix (°Bx)
                      </label>
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {brixInput.toFixed(1)}° Brix
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.0"
                      max="35.0"
                      step="0.1"
                      value={brixInput}
                      onChange={(e) => setBrixInput(parseFloat(e.target.value) || 0)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                      {[
                        { b: 10.0, label: '10.0° (Session)' },
                        { b: 12.0, label: '12.0° (Standard)' },
                        { b: 14.5, label: '14.5° (IPA)' },
                        { b: 18.0, label: '18.0° (Bock)' },
                        { b: 24.0, label: '24.0° (Barleywine)' }
                      ].map((preset) => (
                        <button
                          key={preset.b}
                          type="button"
                          onClick={() => setBrixInput(preset.b)}
                          className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono"
                        >
                          {preset.label}
                        </button>
                      ))}
                      <div className="ml-auto flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0.0"
                          max="40.0"
                          value={brixInput}
                          onChange={(e) => setBrixInput(parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-0.5 text-xs font-mono text-right border border-slate-300 rounded"
                        />
                        <span className="text-xs font-mono text-slate-500">°Bx</span>
                      </div>
                    </div>
                  </div>

                  {/* Wort Correction Factor (WCF) */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>Wort Correction Factor (WCF)</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            (Default: 1.04 for beer wort)
                          </span>
                        </label>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Refractometers are calibrated for pure sucrose. Proteins and hop compounds in malt wort skew readings slightly higher (~4%).
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setWcf(1.04)}
                          className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                            wcf === 1.04 ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          1.04 (Beer)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWcf(1.00)}
                          className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                            wcf === 1.00 ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          1.00 (Sugar/Wine)
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          min="0.90"
                          max="1.20"
                          value={wcf}
                          onChange={(e) => setWcf(parseFloat(e.target.value) || 1.0)}
                          className="w-16 px-1.5 py-1 text-xs font-mono text-right border border-slate-300 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Rule of thumb note */}
                  <div className="flex items-start gap-2 p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg text-xs text-amber-900">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Brewer's Rule of Thumb:</span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Multiply Brix by 4 to get approximate gravity points. For example, {brixInput}° Brix × 4 ≈ {Math.round(brixInput * 4)} gravity points ({brixResults.ruleOfThumbSg} SG). Our calculator applies the full non-linear ASBC polynomial formula for exact precision.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODE 2: REFRACTOMETER DURING/AFTER FERMENTATION (ALCOHOL CORRECTION) */
                <div className="space-y-6">
                  <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-700" />
                      <span>Refractometer Alcohol Correction (Sean Terrill Formula)</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Ethanol has a different refractive index than sugar and water, making uncorrected refractometer readings appear artificially high during and after fermentation. Enter your original reading and current reading to get your true Final Gravity (FG) and ABV.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Original Brix */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Original Brix (°Bx) / OG Reading
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="5.0"
                        max="35.0"
                        value={origBrix}
                        onChange={(e) => setOrigBrix(parseFloat(e.target.value) || 5.0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                      />
                      <span className="text-[10px] text-slate-400">Pre-fermentation wort reading</span>
                    </div>

                    {/* Current/Final Brix */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current / Final Refractometer Brix (°Bx)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="25.0"
                        value={currentBrix}
                        onChange={(e) => setCurrentBrix(parseFloat(e.target.value) || 1.0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono"
                      />
                      <span className="text-[10px] text-slate-400">Sample from fermenter / finished beer</span>
                    </div>
                  </div>

                  {/* WCF for Post-ferment */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700">Wort Correction Factor (WCF):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Recommended: 1.04</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.95"
                        max="1.15"
                        value={wcf}
                        onChange={(e) => setWcf(parseFloat(e.target.value) || 1.04)}
                        className="w-16 px-2 py-0.5 text-xs font-mono text-right border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Outbound Link to Brewer's Friend Brix Converter */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Looking for winemaking charts, Plato tables, or hydrometer temp calibration?
                </span>
                <a
                  href="https://www.brewersfriend.com/brix-converter/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 hover:underline shrink-0"
                >
                  <span>Open Brewer's Friend Brix Converter</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  {brixMode === 'preferment' ? 'Calculated Specific Gravity' : 'Corrected Gravity & ABV'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">ASBC Standard</span>
              </div>

              {brixMode === 'preferment' ? (
                <>
                  {/* Primary SG Result */}
                  <div className="p-6 rounded-xl bg-slate-900 text-white space-y-2 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Specific Gravity (SG)
                    </span>
                    <div className="text-5xl font-black text-amber-400 font-mono tabular-nums">
                      {brixResults.sg.toFixed(3)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Corrected Brix: <span className="font-mono text-white font-bold">{brixResults.correctedBrix}°Bx</span> (WCF {wcf})
                    </p>
                  </div>

                  {/* Equivalent Density Scales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-xs text-slate-500 block">Degrees Plato</span>
                      <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                        {brixResults.plato}°P
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">German / Czech standard</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-xs text-slate-500 block">Degrees Baumé</span>
                      <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                        {brixResults.baume}°Bé
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">Traditional scale</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Potential ABV (if fermented to 1.000):</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {brixResults.potentialAbv}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-600 font-medium">Quick 4x Estimate:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {brixResults.ruleOfThumbSg.toFixed(3)} SG
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Corrected FG Result */}
                  <div className="p-6 rounded-xl bg-slate-900 text-white space-y-2 text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Corrected Final Gravity (FG)
                    </span>
                    <div className="text-5xl font-black text-amber-400 font-mono tabular-nums">
                      {refractometerResults.fg.toFixed(3)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Corrected for ethanol optical distortion
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-xs text-slate-500 block">Actual ABV</span>
                      <span className="text-2xl font-black text-red-600 font-mono tabular-nums">
                        {refractometerResults.abv}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Alcohol By Volume</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                      <span className="text-xs text-slate-500 block">Apparent Attenuation</span>
                      <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                        {refractometerResults.attenuation}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Yeast Conversion</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. Original Gravity (OG):</span>
                      <span className="font-mono font-bold text-slate-900">{refractometerResults.og.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Uncorrected Reading:</span>
                      <span className="font-mono text-slate-700">{currentBrix}° Bx (raw)</span>
                    </div>
                  </div>
                </>
              )}

              {/* Reference tip */}
              <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                <p className="font-semibold text-slate-700">Refractometer Tip:</p>
                <p className="leading-relaxed">
                  Always calibrate your refractometer to 0.0° Brix with distilled water before measuring. On brew day, let hot wort drops cool on the prism for 30 seconds before closing the plate to prevent thermal refraction drift.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
