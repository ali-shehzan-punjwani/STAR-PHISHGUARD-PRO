import React from 'react';
import { PageId, EmailAnalysisResult } from '../types';
import { AppStats } from '../utils/storage';
import { RiskBadge } from './RiskBadge';
import { SAMPLE_EMAILS } from '../data/samples';
import {
  Search,
  Mail,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Link2,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  stats: AppStats;
  recentScans: EmailAnalysisResult[];
  onNavigate: (page: PageId) => void;
  onSelectSample: (content: string) => void;
  onSelectHistoryItem: (item: EmailAnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentScans,
  onNavigate,
  onSelectSample,
  onSelectHistoryItem
}) => {
  return (
    <div id="dashboard-view" className="space-y-8 animate-fadeIn pb-12">
      {/* =========================================================================
          TOP HEADER SECTION
          ========================================================================= */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          STAR PhishGuard
        </h1>
        <p className="text-base sm:text-lg text-slate-500 mt-1 font-medium">
          AI-Powered Phishing Detection & Prevention
        </p>
        <p className="text-slate-400 mt-3 max-w-3xl text-sm sm:text-base leading-relaxed">
          Analyze suspicious emails, links, and attachments to identify potential phishing threats and understand what actions you should take next to stay safe.
        </p>
      </header>

      {/* =========================================================================
          GEOMETRIC BALANCE 12-COLUMN MAIN GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8-Column Zone */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Ready For Analysis Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xs">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ready for Analysis
            </h2>
            <p className="text-slate-500 mb-8 max-w-md text-sm sm:text-base">
              Paste an email or drag a file to get an immediate security risk assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center">
              <button
                type="button"
                id="dashboard-primary-analyze-btn"
                onClick={() => onNavigate('analyze-email')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 text-base sm:text-lg active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>🔍 Analyze an Email</span>
              </button>
              <button
                type="button"
                id="dashboard-secondary-url-btn"
                onClick={() => onNavigate('url-scanner')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm sm:text-base font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4 text-slate-500" />
                <span>Check a Link</span>
              </button>
            </div>
          </div>

          {/* 3 Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div
              id="stat-emails-analyzed"
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Emails Analyzed
              </p>
              <p className="text-4xl font-black text-slate-800 mt-2">
                {stats.emailsAnalyzed}
              </p>
            </div>

            <div
              id="stat-phishing-detected"
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Phishing Detected
              </p>
              <p className="text-4xl font-black text-red-500 mt-2">
                {stats.phishingDetected}
              </p>
            </div>

            <div
              id="stat-high-risk"
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-widest">
                High Risk Cases
              </p>
              <p className="text-4xl font-black text-orange-500 mt-2">
                {stats.highRisk}
              </p>
            </div>
          </div>

          {/* Quick Try Sample Scenarios */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Try a Quick Sample Scenario
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any scenario below to run an instant demonstration analysis:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_EMAILS.slice(0, 4).map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  id={`sample-card-${sample.id}`}
                  onClick={() => onSelectSample(sample.content)}
                  className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sample.category === 'phishing'
                            ? 'bg-red-500'
                            : sample.category === 'suspicious'
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {sample.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {sample.subject}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4-Column Live Alert & Guidance Sidebar Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-red-100 rounded-2xl overflow-hidden shadow-xl shadow-red-50/50">
            <div className="bg-red-500 p-5 text-white flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest text-xs">
                Last Alert Example
              </span>
              <span className="text-xs opacity-80">2m ago</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-red-600">
                  91 <span className="text-sm text-slate-400 font-medium">/ 100</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-red-600 font-bold text-sm">
                  🚨 HIGH RISK
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-sm">
                  Why is this flagged?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-0.5 text-sm select-none">⚠️</span>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Urgent Language:</span> The sender is pressuring you to act immediately.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-0.5 text-sm select-none">⚠️</span>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Suspicious Link:</span> Points to an unofficial fake domain.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 mt-0.5 text-sm select-none">⚠️</span>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Impersonation:</span> Sender address mismatches the claimed company.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  🛡️ What should I do?
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
                    <span>❌</span> Do not click links
                  </div>
                  <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
                    <span>❌</span> Do not reply
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold">
                    <span>✅</span> Report as Phishing
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('analyze-email')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs text-center block"
              >
                Scan Your Own Email Now
              </button>
            </div>
          </div>

          {/* Quick Link Scanner Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>Link & Attachment Checker</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Verify unknown domains or check attachments before downloading.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('url-scanner')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors text-center"
              >
                URL Scanner
              </button>
              <button
                type="button"
                onClick={() => onNavigate('attachment-check')}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors text-center"
              >
                Attachment Check
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RECENT SCANS TABLE
          ========================================================================= */}
      {recentScans.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Recent Email Analyses
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentScans.slice(0, 4).map((scan) => (
              <div
                key={scan.id}
                onClick={() => onSelectHistoryItem(scan)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2.5 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={scan.riskLevel} size="sm" />
                    <span className="text-xs text-slate-500">
                      Score: <strong className="text-slate-800">{scan.riskScore}/100</strong>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {scan.subject || scan.verdictTitle}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {scan.snippet}
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2 self-start sm:self-center">
                  <span>
                    {new Date(scan.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

