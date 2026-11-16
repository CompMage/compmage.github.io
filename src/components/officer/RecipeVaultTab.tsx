import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, Award, BookOpen, Trash2, X } from 'lucide-react';
import { CLUB_RECIPES } from '../../data/mockRecipes';
import { Recipe } from '../../types';

interface RecipeVaultTabProps {
  recipes: Recipe[];
  onSaveRecipes: (updated: Recipe[]) => void;
  showNotification: (msg: string) => void;
}

export const RecipeVaultTab: React.FC<RecipeVaultTabProps> = ({
  recipes,
  onSaveRecipes,
  showNotification
}) => {
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState('all');
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    const q = recipeSearch.toLowerCase();
    return recipes.filter((r) => {
      const matchCat = recipeCategoryFilter === 'all' || r.category === recipeCategoryFilter;
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.brewer.toLowerCase().includes(q) ||
        r.style.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [recipes, recipeSearch, recipeCategoryFilter]);

  const handleRemoveRecipe = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the recipe "${name}" from the Vault? This will permanently remove it from the public recipe archive.`)) {
      onSaveRecipes(recipes.filter((r) => r.id !== id));
      if (viewingRecipe?.id === id) setViewingRecipe(null);
      showNotification(`Recipe "${name}" was removed from the Vault.`);
    }
  };

  const handleResetDefaultRecipes = () => {
    if (window.confirm('Reset all Recipe Vault recipes back to club defaults?')) {
      onSaveRecipes(CLUB_RECIPES);
      showNotification('Recipe Vault reset to defaults.');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Recipe Archive Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Recipe Vault Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Review all member recipes currently in the vault. You have full authority to inspect formulas and remove recipes from the live site.
            </p>
          </div>

          <button
            onClick={handleResetDefaultRecipes}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            title="Restore default recipe list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Filter toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              placeholder="Search recipes by name, brewer, style..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'real-ale', label: 'Real Ale' },
              { id: 'ipa', label: 'IPA' },
              { id: 'stout', label: 'Stout' },
              { id: 'wheat-farmhouse', label: 'Wheat/Farmhouse' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setRecipeCategoryFilter(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  recipeCategoryFilter === c.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((r) => (
            <div
              key={r.id}
              className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-colors shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded">
                    {r.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{r.abv} ABV</span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">{r.name}</h3>
                <p className="text-xs text-slate-400">
                  Brewed by <strong className="text-slate-200">{r.brewer}</strong>
                </p>
                <p className="text-xs text-slate-300 font-medium">{r.style}</p>

                {r.award && (
                  <p className="text-[11px] text-amber-300 flex items-center gap-1 line-clamp-1">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{r.award}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingRecipe(r)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Formula</span>
                </button>

                <button
                  onClick={() => handleRemoveRecipe(r.id, r.name)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-red-400 hover:text-red-200 hover:bg-red-950/60 border border-red-900/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove recipe from Vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: VIEW RECIPE IN OFFICER PORTAL */}
      {viewingRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingRecipe(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {viewingRecipe.style}
              </span>
              <h3 className="text-2xl font-black text-white">
                {viewingRecipe.name}
              </h3>
              <p className="text-xs text-slate-400">
                Formulation by <strong>{viewingRecipe.brewer}</strong> · Batch Size: {viewingRecipe.batchSize}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">OG</span>
                <span className="font-mono font-bold text-white">{viewingRecipe.og}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">FG</span>
                <span className="font-mono font-bold text-white">{viewingRecipe.fg}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">ABV</span>
                <span className="font-mono font-bold text-amber-400">{viewingRecipe.abv}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">IBU</span>
                <span className="font-mono font-bold text-red-400">{viewingRecipe.ibu}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 block">Fermentables:</span>
                <ul className="space-y-1 text-slate-400">
                  {viewingRecipe.fermentables.map((f, i) => (
                    <li key={i} className="flex justify-between border-b border-slate-800 py-0.5">
                      <span>{f.name}</span>
                      <span className="font-mono text-slate-300">{f.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 block">Hop Schedule:</span>
                <ul className="space-y-1 text-slate-400">
                  {viewingRecipe.hops.map((h, i) => (
                    <li key={i} className="flex justify-between border-b border-slate-800 py-0.5">
                      <span>{h.name} ({h.time})</span>
                      <span className="font-mono text-slate-300">{h.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleRemoveRecipe(viewingRecipe.id, viewingRecipe.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 hover:text-white bg-red-950/70 hover:bg-red-900 border border-red-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from Vault</span>
              </button>

              <button
                onClick={() => setViewingRecipe(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
