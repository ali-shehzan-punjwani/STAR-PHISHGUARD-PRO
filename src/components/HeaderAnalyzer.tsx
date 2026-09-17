import React, { useState } from 'react';
import { HeaderAnalysisResult } from '../types';
import { analyzeHeaders } from '../utils/headerAnalyzer';
import { RiskBadge } from './RiskBadge';
import { SAMPLE_HEADERS } from '../data/samples';
import {
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const HeaderAnalyzer: React.FC = () => {
  const [headerText, setHeaderText] = useState('');
  const [result, setResult] = useState<HeaderAnalysisResult | null>(null);
  const [technicalOpen, setTechnicalOpen] = useState(false);

  const handleAnalyze = (contentToAnalyze?: string) => {
    const target = (contentToAnalyze ?? headerText).trim();
    if (!target) return;
    const res = analyzeHeaders(target);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
    setHeaderText('');
    setTechnicalOpen(false);
  };

  return (
    <div id="header-analyzer-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>📧 Check Email Headers</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Detect sender spoofing, display name deception, and email authentication failures (SPF/DKIM).
        </p>
      </div>

      {/* Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-5">
        <div>
          <label htmlFor="header-input-textarea" className="block text-sm font-bold text-slate-900 mb-2">
            Paste Email Headers
          </label>
          <textarea
            id="header-input-textarea"
            rows={7}
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            placeholder="Paste email headers here (From:, Reply-To:, Received:, Authentication-Results:)..."
            className="w-full rounded-xl border border-slate-300 p-4 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-hidden transition-all resize-y"
          />
        </div>

        {/* Sample Headers */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold">Try sample:</span>
          {SAMPLE_HEADERS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setHeaderText(sample.content);
                handleAnalyze(sample.content);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          id="analyze-headers-btn"
          disabled={!headerText.trim()}
          onClick={() => handleAnalyze()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm shadow-sm hover:shadow transition-all"
        >
          <Search className="w-4 h-4" />
          <span>🔍 Analyze Headers</span>
        </button>
      </div>

      {/* Results */}
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

            {/* Simple Address Comparison */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  From (Visible Sender)
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 break-all block">
                  {result.fromAddress}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${result.hasMismatch ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reply-To (Actual Destination)
                  </span>
                  {result.hasMismatch && (
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                      Mismatch
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 break-all block">
                  {result.replyToAddress}
                </span>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-800">
                {result.simpleExplanation}
              </p>
            </div>

            {/* Reasons list */}
            {result.reasons.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Detected Observations:
                </h4>
                <ul className="space-y-1.5">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-slate-400 font-bold select-none">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expandable Technical Headers */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                id="toggle-headers-technical-btn"
                onClick={() => setTechnicalOpen(!technicalOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              >
                <span>{technicalOpen ? '▲' : '▼'} Raw Header Records ({result.technicalHeaders.length})</span>
                {technicalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {technicalOpen && (
                <div className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs font-mono max-h-72 overflow-y-auto">
                  {result.technicalHeaders.map((hdr, idx) => (
                    <div key={idx} className="border-b border-slate-800 pb-1.5">
                      <span className="text-indigo-400 font-bold">{hdr.key}:</span>{' '}
                      <span className="text-slate-300 break-all">{hdr.value}</span>
                    </div>
                  ))}
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
                <span>Analyze Another Header</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
