import React, { useState } from 'react';
import { AppSettings } from '../types';
import {
  Settings,
  Shield,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Info
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults
}) => {
  const [newDomain, setNewDomain] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSensitivityChange = (sensitivity: AppSettings['sensitivity']) => {
    onUpdateSettings({ ...settings, sensitivity });
    showNotification();
  };

  const handleToggleSound = () => {
    onUpdateSettings({ ...settings, enableSoundAlerts: !settings.enableSoundAlerts });
    showNotification();
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!clean || settings.whitelistedDomains.includes(clean)) return;
    onUpdateSettings({
      ...settings,
      whitelistedDomains: [...settings.whitelistedDomains, clean]
    });
    setNewDomain('');
    showNotification();
  };

  const handleRemoveDomain = (domain: string) => {
    onUpdateSettings({
      ...settings,
      whitelistedDomains: settings.whitelistedDomains.filter(d => d !== domain)
    });
    showNotification();
  };

  const showNotification = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  return (
    <div id="settings-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>⚙️ Settings</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure detection sensitivity and trusted domain preferences.
          </p>
        </div>

        {savedAlert && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      {/* Sensitivity Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Detection Sensitivity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust how aggressively the heuristic engine flags potential pressure indicators:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              { id: 'conservative', title: 'Conservative', desc: 'Fewer warnings, flags only definitive threats' },
              { id: 'balanced', title: 'Balanced (Recommended)', desc: 'Standard business baseline protection' },
              { id: 'aggressive', title: 'High Security', desc: 'Strict inspection, flags all external domains' }
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleSensitivityChange(mode.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                settings.sensitivity === mode.id
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`text-xs font-extrabold block ${settings.sensitivity === mode.id ? 'text-blue-900' : 'text-slate-800'}`}>
                {mode.title}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1 leading-snug">
                {mode.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trusted Domains Whitelist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Trusted Internal Domains
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Domains listed here are recognized as verified corporate or partner services:
          </p>
        </div>

        <form onSubmit={handleAddDomain} className="flex gap-2">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="e.g. yourcompany.com"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
          />
          <button
            type="submit"
            disabled={!newDomain.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Domain</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {settings.whitelistedDomains.map((domain) => (
            <span
              key={domain}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800"
            >
              <span>{domain}</span>
              <button
                type="button"
                onClick={() => handleRemoveDomain(domain)}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Reset Defaults */}
      <div className="pt-4 flex justify-between items-center text-xs text-slate-500">
        <span>STAR PhishGuard v2.4.0 (Client Build)</span>
        <button
          type="button"
          onClick={onResetDefaults}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Defaults</span>
        </button>
      </div>
    </div>
  );
};
