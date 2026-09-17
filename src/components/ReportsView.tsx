import React, { useState } from 'react';
import { EmailAnalysisResult } from '../types';
import { RiskBadge } from './RiskBadge';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface ReportsViewProps {
  currentReport?: EmailAnalysisResult | null;
  history: EmailAnalysisResult[];
  onSelectReport: (report: EmailAnalysisResult) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentReport,
  history,
  onSelectReport
}) => {
  const activeReport = currentReport || (history.length > 0 ? history[0] : null);
  const [copied, setCopied] = useState(false);

  const downloadTextReport = () => {
    if (!activeReport) return;
    const content = `=====================================================
STAR PhishGuard - Cybersecurity Assessment Report
Generated: ${new Date(activeReport.timestamp).toLocaleString()}
Incident Reference ID: ${activeReport.id}
=====================================================

Email Subject:
${activeReport.subject || 'N/A'}

Sender:
${activeReport.sender || 'Unknown'}

Verdict:
${activeReport.riskLevel} RISK (${activeReport.verdictTitle})

Risk Score:
${activeReport.riskScore} / 100

Main Reasons:
${activeReport.reasons.map(r => `• ${r.title}: ${r.description}`).join('\n')}

Recommended Actions:
${activeReport.actions.map(a => `[${a.type === 'dont' ? 'DO NOT' : 'DO'}] ${a.text}`).join('\n')}

Technical Metadata:
- Logistic Regression Confidence: ${(activeReport.technical.logisticRegressionConfidence * 100).toFixed(1)}%
- MLP Confidence: ${(activeReport.technical.mlpConfidence * 100).toFixed(1)}%
- Detected Hyperlinks: ${activeReport.technical.detectedUrls.join(', ') || 'None'}

=====================================================
STAR PhishGuard AI Phishing Prevention & Detection
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Security_Report_${activeReport.id}.txt`;
    link.click();
  };

  const copyReportSummary = () => {
    if (!activeReport) return;
    const summary = `STAR PhishGuard Security Report\nEmail: ${activeReport.subject}\nVerdict: ${activeReport.riskLevel} RISK (${activeReport.riskScore}/100)\nRecommended Action: Do not interact with this email.`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeReport) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Reports Generated Yet</h2>
        <p className="text-xs text-slate-500 mt-1">
          Scan an email or link first to generate an official security assessment report.
        </p>
      </div>
    );
  }

  return (
    <div id="reports-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📑 Security Report</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official summary document for IT helpdesk, security incident reporting, or records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="download-report-btn"
            onClick={downloadTextReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Selector if multiple history items */}
      {history.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">Select Scan:</span>
          {history.slice(0, 5).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectReport(item)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all ${
                item.id === activeReport.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.subject || item.verdictTitle}
            </button>
          ))}
        </div>
      )}

      {/* Official Security Report Card */}
      <div
        id="printable-security-report"
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 print:border-none print:shadow-none"
      >
        {/* Report Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base">STAR PhishGuard</span>
              <span className="text-xs text-slate-500 block">Incident Security Assessment</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Ref: <span className="font-mono font-bold text-slate-800">{activeReport.id}</span></div>
            <div>{new Date(activeReport.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Core Report Sections according to spec #14 */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Email Subject / Target
            </span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {activeReport.subject || 'Password Reset / Security Notice'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Verdict
              </span>
              <div className="mt-1">
                <RiskBadge level={activeReport.riskLevel} size="md" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Risk Score
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {activeReport.riskScore} <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Main Reasons:
            </span>
            <ul className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {activeReport.reasons.map((r, idx) => (
                <li key={idx} className="text-xs font-medium text-slate-800 flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{r.title}:</strong> {r.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Recommended Action:
            </span>
            <div className={`p-4 rounded-xl border font-bold text-sm ${
              activeReport.riskLevel === 'HIGH'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : activeReport.riskLevel === 'MEDIUM'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              {activeReport.riskLevel === 'HIGH'
                ? '🚨 Do not interact with this email. Do not click links, open attachments, or reply to sender.'
                : activeReport.riskLevel === 'MEDIUM'
                ? '⚠️ Exercise caution. Verify the sender through an official trusted phone number or portal.'
                : '✅ Safe to proceed with normal caution.'}
            </div>
          </div>
        </div>

        {/* Report Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyReportSummary}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Summary Copied' : 'Copy Summary Text'}</span>
          </button>

          <button
            type="button"
            onClick={downloadTextReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
