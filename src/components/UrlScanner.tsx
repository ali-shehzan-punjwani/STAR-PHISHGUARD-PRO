import React, { useState } from 'react';
import { UrlAnalysisResult } from '../types';
import { analyzeUrl } from '../utils/urlAnalyzer';
import { RiskBadge } from './RiskBadge';
import { SAMPLE_URLS } from '../data/samples';
import {
  Link2,
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export const UrlScanner: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [technicalOpen, setTechnicalOpen] = useState(false);

  const handleCheckUrl = (urlToCheck?: string) => {
    const target = (urlToCheck ?? inputUrl).trim();
    if (!target) return;
    const res = analyzeUrl(target);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
    setInputUrl('');
    setTechnicalOpen(false);
  };

  return (
    <div id="url-scanner-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>🔗 Check a Link</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Inspect a suspicious web address to see if it leads to a phishing portal or malicious domain.
        </p>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-5">
        <div>
          <label htmlFor="url-input-box" className="block text-sm font-bold text-slate-900 mb-2">
            Paste URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              id="url-input-box"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste a suspicious URL here (e.g., https://example-login.xyz/auth)..."
              className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-hidden transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckUrl();
              }}
            />
          </div>
        </div>

        {/* Sample URLs */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold">Try sample:</span>
          {SAMPLE_URLS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputUrl(sample.url);
                handleCheckUrl(sample.url);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Button */}
        <button
          type="button"
          id="check-url-btn"
          disabled={!inputUrl.trim()}
          onClick={() => handleCheckUrl()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm shadow-sm hover:shadow transition-all"
        >
          <Search className="w-4 h-4" />
          <span>🔍 Check URL</span>
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-5 animate-fadeIn">
          <div
            className={`rounded-2xl border p-6 md:p-8 bg-white shadow-sm ${
              result.riskLevel === 'HIGH'
                ? 'border-rose-200 ring-4 ring-rose-50/50'
                : result.riskLevel === 'MEDIUM'
                ? 'border-amber-200 ring-4 ring-amber-50/50'
                : 'border-emerald-200 ring-4 ring-emerald-50/50'
            }`}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <RiskBadge level={result.riskLevel} size="lg" />
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {result.verdictTitle}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase">Risk Score</div>
                <div className="text-2xl font-black text-slate-900">{result.riskScore}/100</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 break-all mb-4">
                {result.url}
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Reasons & Findings:
              </h4>
              <ul className="space-y-2">
                {result.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-rose-500 font-bold select-none">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expandable Technical URL Analysis */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                id="toggle-url-technical-btn"
                onClick={() => setTechnicalOpen(!technicalOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              >
                <span>{technicalOpen ? '▲' : '▼'} Technical URL Analysis</span>
                {technicalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {technicalOpen && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs text-slate-700 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Domain Host:</span>
                    <span className="font-bold text-slate-900">{result.technical.domain}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Protocol & Encryption:</span>
                    <span className={result.technical.isHttps ? 'text-emerald-700' : 'text-rose-600 font-bold'}>
                      {result.technical.protocol.toUpperCase()} ({result.technical.isHttps ? 'Encrypted' : 'Unencrypted'})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Estimated Domain Age:</span>
                    <span className="text-slate-800">{result.technical.domainAgeEstimate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Blacklist Feed Queries:</span>
                    <span className="text-slate-800">
                      {result.technical.blacklistsMatched} / {result.technical.blacklistsChecked} threat feeds matched
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">IP Host Format:</span>
                    <span className="text-slate-800">{result.technical.ipAddressHost ? 'Yes (Suspicious)' : 'No (Standard DNS)'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Another Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
