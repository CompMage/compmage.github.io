import React, { useState } from 'react';
import { Beer, Search, Filter, BookOpen, Plus, X, Award, ExternalLink, Printer, ChevronRight, Trash2, FileText, Sparkles, Check } from 'lucide-react';
import { CLUB_RECIPES } from '../data/mockRecipes';
import { Recipe } from '../types';

export const RecipeVault: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(CLUB_RECIPES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Submit Modal Expanded State
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newBrewerName, setNewBrewerName] = useState('');
  const [newStyle, setNewStyle] = useState('Ordinary & Best Bitter (BJCP 11B)');
  const [newCategory, setNewCategory] = useState<'real-ale' | 'ipa' | 'stout' | 'wheat-farmhouse' | 'lager-specialty'>('real-ale');
  const [newBatchSize, setNewBatchSize] = useState('5.5 Gallons');
  const [newAward, setNewAward] = useState('');

  // Vitals
  const [newOg, setNewOg] = useState('1.044');
  const [newFg, setNewFg] = useState('1.011');
  const [newAbv, setNewAbv] = useState('4.3%');
  const [newIbu, setNewIbu] = useState('32');
  const [newSrm, setNewSrm] = useState('11');

  // Dynamic Fermentables (Grist) lines
  const [newFermentables, setNewFermentables] = useState<{ name: string; amount: string }[]>([
    { name: 'Maris Otter Pale Ale Malt', amount: '7.5 lbs' },
    { name: 'Crystal 60L', amount: '0.75 lbs' },
    { name: 'Victory Malt', amount: '0.5 lbs' },
    { name: 'Torrified Wheat', amount: '0.25 lbs' }
  ]);

  // Dynamic Hop Schedule lines
  const [newHops, setNewHops] = useState<{ name: string; amount: string; time: string; use: string }[]>([
    { name: 'East Kent Goldings', amount: '1.25 oz', time: '60 min', use: 'Boil' },
    { name: 'Fuggle', amount: '0.75 oz', time: '15 min', use: 'Boil' },
    { name: 'East Kent Goldings', amount: '0.5 oz', time: 'Flameout', use: 'Whirlpool' }
  ]);

  // Yeast Culture, Mash & Fermentation Profiles
  const [newYeast, setNewYeast] = useState('Wyeast 1968 London ESB / Imperial A09 Pub');
  const [newMashTemp, setNewMashTemp] = useState('153°F (67°C) for 60 min');
  const [newFermentationTemp, setNewFermentationTemp] = useState('66°F for 10 days, secondary cask fining with isinglass');

  // Note section at the bottom
  const [newNotes, setNewNotes] = useState('');

  // Fermentables line handlers
  const addFermentableLine = () => {
    setNewFermentables([...newFermentables, { name: '', amount: '' }]);
  };

  const updateFermentableLine = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...newFermentables];
    updated[index][field] = value;
    setNewFermentables(updated);
  };

  const removeFermentableLine = (index: number) => {
    if (newFermentables.length > 1) {
      setNewFermentables(newFermentables.filter((_, i) => i !== index));
    }
  };

  // Hop Schedule line handlers
  const addHopLine = () => {
    setNewHops([...newHops, { name: '', amount: '', time: '60 min', use: 'Boil' }]);
  };

  const updateHopLine = (index: number, field: 'name' | 'amount' | 'time' | 'use', value: string) => {
    const updated = [...newHops];
    updated[index][field] = value;
    setNewHops(updated);
  };

  const removeHopLine = (index: number) => {
    if (newHops.length > 1) {
      setNewHops(newHops.filter((_, i) => i !== index));
    }
  };

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'real-ale', label: 'Real Ale & Bitters' },
    { id: 'ipa', label: 'IPAs & Hoppy' },
    { id: 'stout', label: 'Stouts & Porters' },
    { id: 'wheat-farmhouse', label: 'Wheat & Farmhouse' }
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.brewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName.trim() || !newBrewerName.trim()) return;

    // Filter out completely blank lines
    const cleanFermentables = newFermentables.filter((f) => f.name.trim() !== '');
    const cleanHops = newHops.filter((h) => h.name.trim() !== '');

    const formattedAbv = newAbv.trim().includes('%') ? newAbv.trim() : `${newAbv.trim()}%`;

    const createdRecipe: Recipe = {
      id: 'custom_' + Date.now(),
      name: newRecipeName.trim(),
      brewer: newBrewerName.trim(),
      style: newStyle.trim() || 'Ordinary & Best Bitter (BJCP 11B)',
      category: newCategory,
      og: newOg.trim() || '1.044',
      fg: newFg.trim() || '1.011',
      abv: formattedAbv,
      ibu: parseInt(newIbu) || 32,
      srm: parseInt(newSrm) || 11,
      batchSize: newBatchSize.trim() || '5.5 Gallons',
      award: newAward.trim() || undefined,
      description: newNotes.trim() || 'Formulated by C.R.A.B.S. member for the club Recipe Vault.',
      notes: newNotes.trim() || undefined,
      fermentables: cleanFermentables.length > 0 ? cleanFermentables : [{ name: 'Maris Otter Pale Ale Malt', amount: '8.0 lbs' }],
      hops: cleanHops.length > 0 ? cleanHops : [{ name: 'East Kent Goldings', amount: '1.25 oz', time: '60 min', use: 'Boil' }],
      yeast: newYeast.trim() || 'Wyeast 1968 London ESB / Imperial A09 Pub',
      mashTemp: newMashTemp.trim() || '153°F (67°C) for 60 min',
      fermentationTemp: newFermentationTemp.trim() || '66°F for 10-14 days',
      caskConditioned: newCategory === 'real-ale'
    };

    setRecipes([createdRecipe, ...recipes]);
    setSubmittedMessage(`Recipe "${createdRecipe.name}" by ${createdRecipe.brewer} successfully added to the Vault!`);
    
    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setSubmittedMessage(null);
      // Automatically open the newly submitted recipe modal so user sees it presented
      setActiveRecipe(createdRecipe);
      
      // Reset inputs to clean defaults
      setNewRecipeName('');
      setNewBrewerName('');
      setNewNotes('');
      setNewAward('');
    }, 1200);
  };

  return (
    <section id="vault" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Member Archive (Preview / Placeholder)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              C.R.A.B.S. Member Recipe Vault
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A curated collection of tried-and-true recipes brewed, perfected, and shared by club members. 
              From cask-conditioned British session bitters to bold American Double IPAs.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 text-red-400" />
            <span>Submit a Recipe</span>
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search style, brewer, beer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setActiveRecipe(recipe)}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                    {recipe.style}
                  </span>
                  {recipe.caskConditioned && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                      Cask Ale
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                  {recipe.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  Brewed by <span className="text-slate-800">{recipe.brewer}</span>
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ABV</span>
                    <span className="font-bold text-slate-900 font-mono">{recipe.abv}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">IBU</span>
                    <span className="font-bold text-slate-900 font-mono">{recipe.ibu}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">OG</span>
                    <span className="font-bold text-slate-900 font-mono">{recipe.og}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SRM</span>
                    <span className="font-bold text-amber-700 font-mono">{recipe.srm}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>View Brew Sheet</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recipe Detail Modal */}
        {activeRecipe && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveRecipe(null)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  {activeRecipe.style}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {activeRecipe.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Recipe formulation by <strong>{activeRecipe.brewer}</strong> · Batch Size: {activeRecipe.batchSize}
                </p>
              </div>

              {activeRecipe.award && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{activeRecipe.award}</span>
                </div>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Original Gravity</span>
                  <span className="font-bold font-mono text-slate-900">{activeRecipe.og}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Final Gravity</span>
                  <span className="font-bold font-mono text-slate-900">{activeRecipe.fg}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Alcohol</span>
                  <span className="font-bold font-mono text-red-600">{activeRecipe.abv}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Bitterness</span>
                  <span className="font-bold font-mono text-slate-900">{activeRecipe.ibu} IBU</span>
                </div>
              </div>

              {/* Grain Bill & Hops Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Fermentables */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                    Fermentables (Grist)
                  </h4>
                  <ul className="space-y-1.5">
                    {activeRecipe.fermentables.map((grain, idx) => (
                      <li key={idx} className="flex justify-between items-center py-0.5">
                        <span className="text-slate-800">{grain.name}</span>
                        <span className="font-mono font-bold text-slate-600">{grain.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hops */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                    Hop Schedule
                  </h4>
                  <ul className="space-y-1.5">
                    {activeRecipe.hops.map((hop, idx) => (
                      <li key={idx} className="flex justify-between items-center py-0.5">
                        <span className="text-slate-800">{hop.name} ({hop.time})</span>
                        <span className="font-mono font-bold text-slate-600">{hop.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mash & Yeast Specifications */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Yeast Culture:</span>
                  <span className="font-mono text-slate-900 font-medium">{activeRecipe.yeast}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Mash Profile:</span>
                  <span className="font-mono text-slate-900 font-medium">{activeRecipe.mashTemp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Fermentation:</span>
                  <span className="font-mono text-slate-900 font-medium">{activeRecipe.fermentationTemp}</span>
                </div>
              </div>

              {/* Note Section at the Bottom */}
              {(activeRecipe.notes || activeRecipe.description) && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Brewer's Notes & Formulation Tips</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeRecipe.notes || activeRecipe.description}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Brewday Sheet</span>
                </button>
                <button
                  onClick={() => setActiveRecipe(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                >
                  Close Recipe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Recipe Expanded Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Member Contributions
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Submit a Recipe to the Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your complete recipe formulation so it appears on the official C.R.A.B.S. brewday sheet.
                </p>
              </div>

              {submittedMessage ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold text-center flex flex-col items-center gap-2">
                  <Check className="w-6 h-6 text-emerald-600" />
                  <span>{submittedMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleRecipeSubmit} className="space-y-6 text-xs">
                  {/* General Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
                      Recipe Header Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Recipe Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newRecipeName}
                          onChange={(e) => setNewRecipeName(e.target.value)}
                          placeholder="e.g. Patapsco Cask Best Bitter"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Brewer Name / Handle <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newBrewerName}
                          onChange={(e) => setNewBrewerName(e.target.value)}
                          placeholder="e.g. Dave &quot;The Caskmaster&quot; Miller"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Style & BJCP Category
                        </label>
                        <input
                          type="text"
                          value={newStyle}
                          onChange={(e) => setNewStyle(e.target.value)}
                          placeholder="e.g. Ordinary & Best Bitter (BJCP 11B)"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Club Category
                          </label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="w-full px-2 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs bg-white"
                          >
                            <option value="real-ale">Real Ale & Bitters</option>
                            <option value="ipa">IPAs & Hoppy</option>
                            <option value="stout">Stouts & Porters</option>
                            <option value="wheat-farmhouse">Wheat & Farmhouse</option>
                            <option value="lager-specialty">Lager & Specialty</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Batch Size
                          </label>
                          <input
                            type="text"
                            value={newBatchSize}
                            onChange={(e) => setNewBatchSize(e.target.value)}
                            placeholder="5.5 Gallons"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Competition Award / Recognition (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAward}
                        onChange={(e) => setNewAward(e.target.value)}
                        placeholder="e.g. Gold Medal - Maryland State Homebrew Championship (Real Ale Category)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* Vitals Bar Inputs */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
                      Recipe Vitals (OG / FG / ABV / IBU)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Original Gravity</label>
                        <input
                          type="text"
                          value={newOg}
                          onChange={(e) => setNewOg(e.target.value)}
                          placeholder="1.044"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Final Gravity</label>
                        <input
                          type="text"
                          value={newFg}
                          onChange={(e) => setNewFg(e.target.value)}
                          placeholder="1.011"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Alcohol (ABV)</label>
                        <input
                          type="text"
                          value={newAbv}
                          onChange={(e) => setNewAbv(e.target.value)}
                          placeholder="4.3%"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-xs bg-white font-bold text-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Bitterness (IBU)</label>
                        <input
                          type="text"
                          value={newIbu}
                          onChange={(e) => setNewIbu(e.target.value)}
                          placeholder="32"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two Columns: Fermentables (Grist) & Hop Schedule with Add Lines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FERMENTABLES COLUMN */}
                    <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          Fermentables (Grist)
                        </span>
                        <button
                          type="button"
                          onClick={addFermentableLine}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-white px-2 py-0.5 rounded border border-red-200 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Line</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {newFermentables.map((grain, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={grain.name}
                              onChange={(e) => updateFermentableLine(idx, 'name', e.target.value)}
                              placeholder="e.g. Maris Otter Pale Ale Malt"
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-800"
                            />
                            <input
                              type="text"
                              value={grain.amount}
                              onChange={(e) => updateFermentableLine(idx, 'amount', e.target.value)}
                              placeholder="7.5 lbs"
                              className="w-24 px-2 py-1.5 border border-slate-300 rounded-md font-mono font-bold text-xs bg-white text-slate-700 text-right"
                            />
                            <button
                              type="button"
                              onClick={() => removeFermentableLine(idx)}
                              disabled={newFermentables.length <= 1}
                              aria-label="Remove line"
                              className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HOP SCHEDULE COLUMN */}
                    <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          Hop Schedule
                        </span>
                        <button
                          type="button"
                          onClick={addHopLine}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-white px-2 py-0.5 rounded border border-red-200 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Line</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {newHops.map((hop, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={hop.name}
                              onChange={(e) => updateHopLine(idx, 'name', e.target.value)}
                              placeholder="e.g. East Kent Goldings"
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-800"
                            />
                            <input
                              type="text"
                              value={hop.time}
                              onChange={(e) => updateHopLine(idx, 'time', e.target.value)}
                              placeholder="60 min"
                              className="w-24 px-2 py-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-600 text-center"
                            />
                            <input
                              type="text"
                              value={hop.amount}
                              onChange={(e) => updateHopLine(idx, 'amount', e.target.value)}
                              placeholder="1.25 oz"
                              className="w-20 px-2 py-1.5 border border-slate-300 rounded-md font-mono font-bold text-xs bg-white text-slate-700 text-right"
                            />
                            <button
                              type="button"
                              onClick={() => removeHopLine(idx)}
                              disabled={newHops.length <= 1}
                              aria-label="Remove line"
                              className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Yeast, Mash & Fermentation */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
                      Yeast, Mash & Fermentation Parameters
                    </h4>
                    
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Yeast Culture</label>
                        <input
                          type="text"
                          value={newYeast}
                          onChange={(e) => setNewYeast(e.target.value)}
                          placeholder="e.g. Wyeast 1968 London ESB / Imperial A09 Pub"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mash Profile</label>
                          <input
                            type="text"
                            value={newMashTemp}
                            onChange={(e) => setNewMashTemp(e.target.value)}
                            placeholder="e.g. 153°F (67°C) for 60 min"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fermentation Profile</label>
                          <input
                            type="text"
                            value={newFermentationTemp}
                            onChange={(e) => setNewFermentationTemp(e.target.value)}
                            placeholder="e.g. 66°F for 10 days, secondary cask fining with isinglass"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Note Section at the Bottom */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Brewer's Notes & Formulation Tips (Bottom Note Section)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Add water profile notes, cask dry hopping techniques, carbonation levels, or sensory recommendations..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                    <p className="text-[11px] text-slate-400">
                      These notes will be displayed in the highlighted notes box at the bottom of the recipe card.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm text-xs transition-all"
                    >
                      Submit Recipe to Vault
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
