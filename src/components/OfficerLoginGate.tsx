import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfficerLoginGateProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const OfficerLoginGate: React.FC<OfficerLoginGateProps> = ({ onSuccess, onBackToSite }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedPassword = localStorage.getItem('crabs_officer_password_v1') || 'crabs1981';

    if (password.trim() === storedPassword.trim()) {
      setIsSuccess(true);
      try {
        sessionStorage.setItem('crabs_officer_authenticated', 'true');
      } catch (err) {
        console.error('sessionStorage error', err);
      }
      setTimeout(() => {
        onSuccess();
      }, 350);
    } else {
      setError('Incorrect officer password. Please verify credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Top Branding & Return Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
            <span>Return to Site</span>
          </button>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Protected Area</span>
          </span>
        </div>

        {/* Center Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner mx-auto p-2.5">
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/crabs_altcolor_caponly_1000_909266e9.png`}
              alt="C.R.A.B.S. Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Officer Portal Access
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Administrative access for C.R.A.B.S. club officers. Enter password to manage meeting minutes, competition flights, and member records.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="officer-password" className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Officer Password</span>
              </span>
            </label>

            <div className="relative">
              <input
                id="officer-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter club officer password..."
                className="w-full pl-3.5 pr-11 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-950/60 border border-green-800 text-xs text-green-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>Authentication verified. Unlocking portal...</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSuccess || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Unlock Officer Portal</span>
          </button>
        </form>

        {/* Footer info & Default reminder */}
        <div className="pt-2 border-t border-slate-800/80 text-center space-y-1">
          <p className="text-[11px] text-slate-500">
            Default initial password: <code className="text-slate-300 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">crabs1981</code>
          </p>
          <p className="text-[10px] text-slate-500">
            Session remains unlocked until this browser tab is closed or you log out.
          </p>
        </div>

      </div>
    </div>
  );
};
