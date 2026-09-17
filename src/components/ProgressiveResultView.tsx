import React, { useState } from 'react';
import {
  EmailAnalysisResult,
  RiskLevel
} from '../types';
import { RiskBadge } from './RiskBadge';
import { TechnicalAccordion } from './TechnicalAccordion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileDown,
  Printer,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Info
} from 'lucide-react';

interface ProgressiveResultViewProps {
  result: EmailAnalysisResult;
  onReset?: () => void;
  onViewReport?: (result: EmailAnalysisResult) => void;
}

export const ProgressiveResultView: React.FC<ProgressiveResultViewProps> = ({
  result,
  onReset,
  onViewReport
}) => {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number, level: RiskLevel) => {
    if (level === 'HIGH') return 'text-rose-600';
    if (level === 'MEDIUM') return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getMeterBg = (level: RiskLevel) => {
    if (level === 'HIGH') return 'bg-rose-500';
    if (level === 'MEDIUM') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const copyAdvice = () => {
    const lines = [
      `STAR PhishGuard Assessment: ${result.verdictTitle}`,
      `Risk Score: ${result.riskScore}/100 (${result.riskLevel})`,
      '',
      '--- RECOMMENDED ACTIONS ---',
      ...result.actions.map(a => `${a.type === 'dont' ? '❌' : '✅'} ${a.text}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="progressive-result-card" className="space-y-6 animate-fadeIn">
      {/* =========================================================================
          LEVEL 1 — SIMPLE RESULT
          Is this email dangerous?
          ========================================================================= */}
      <div
        id="level-1-simple-result"
        className={`rounded-2xl border p-6 md:p-8 bg-white shadow-sm transition-all ${
          result.riskLevel === 'HIGH'
            ? 'border-rose-200 ring-4 ring-rose-50/50'
            : result.riskLevel === 'MEDIUM'
            ? 'border-amber-200 ring-4 ring-amber-50/50'
            : 'border-emerald-200 ring-4 ring-emerald-50/50'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level={result.riskLevel} size="lg" />
              <span className="text-xs text-slate-500 font-medium">
                {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {result.verdictTitle}
            </h2>
            {result.subject && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                <span className="font-semibold text-slate-700">Subject:</span> {result.subject}
              </p>
            )}
            {result.fileName && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                  <span>📄</span>
                  <span>{result.fileName}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-200/70 text-blue-900 font-extrabold">
                    {result.fileFormat?.toUpperCase() || 'EML'}
                  </span>
                </span>
                {result.attachments && result.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <span>📎</span>
                    <span>{result.attachments.length} attachment{result.attachments.length > 1 ? 's' : ''} extracted</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Risk Score Display */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 self-start md:self-auto">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Risk Score
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-3xl font-black ${getScoreColor(result.riskScore, result.riskLevel)}`}>
                  {result.riskScore}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
              <div
                className={`absolute inset-0 rounded-full border-4 ${
                  result.riskLevel === 'HIGH' ? 'border-rose-500' : result.riskLevel === 'MEDIUM' ? 'border-amber-500' : 'border-emerald-500'
                }`}
                style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }}
              />
              {result.riskLevel === 'HIGH' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              ) : result.riskLevel === 'MEDIUM' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Safe (0)</span>
            <span>Suspicious (50)</span>
            <span>High Risk (100)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getMeterBg(result.riskLevel)}`}
              style={{ width: `${result.riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEVEL 2 — WHY
          Why did STAR PhishGuard flag this email?
          ========================================================================= */}
      <div id="level-2-why-flagged" className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Why did STAR PhishGuard flag this?</span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Plain-English explanation of identified warning indicators:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.reasons.map((reason) => (
            <div
              key={reason.id}
              className={`p-4 rounded-xl border transition-all ${
                reason.severity === 'high'
                  ? 'border-rose-200 bg-rose-50/40 text-slate-800'
                  : reason.severity === 'medium'
                  ? 'border-amber-200 bg-amber-50/40 text-slate-800'
                  : 'border-emerald-200 bg-emerald-50/40 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 select-none">
                  {reason.severity === 'high' ? '⚠️' : reason.severity === 'medium' ? '⚠️' : '✅'}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{reason.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          LEVEL 3 — WHAT TO DO (MOST IMPORTANT SECTION)
          What should you do?
          ========================================================================= */}
      <div
        id="level-3-what-should-i-do"
        className="rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/40 to-white p-6 md:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-blue-100">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>🛡️ What should you do?</span>
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Clear security guidance for anyone with no technical background:
            </p>
          </div>

          <button
            type="button"
            id="copy-advice-checklist-btn"
            onClick={copyAdvice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Checklist</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {result.actions.map((action) => (
            <div
              key={action.id}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                action.type === 'dont'
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {action.type === 'dont' ? (
                  <XCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <span
                  className={`text-sm font-bold block ${
                    action.type === 'dont' ? 'text-rose-900' : 'text-emerald-950'
                  }`}
                >
                  {action.text}
                </span>
                {action.description && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {action.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          LEVEL 4 — TECHNICAL DETAILS (EXPANDABLE)
          How did the system reach this conclusion?
          ========================================================================= */}
      <TechnicalAccordion
        technical={result.technical}
        title="Technical Analysis"
      />

      {/* Quick Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        {onReset && (
          <button
            type="button"
            id="scan-another-email-btn"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all focus:ring-2 focus:ring-slate-900/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another Email</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {onViewReport && (
            <button
              type="button"
              id="view-full-report-btn"
              onClick={() => onViewReport(result)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-xs"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              <span>Generate Report</span>
            </button>
          )}

          <button
            type="button"
            id="print-analysis-btn"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
