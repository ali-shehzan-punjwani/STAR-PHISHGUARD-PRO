import React, { useState } from 'react';
import { EmailAnalysisResult, RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';
import {
  History,
  Search,
  Download,
  Trash2,
  ChevronRight,
  Eye,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface HistoryViewProps {
  history: EmailAnalysisResult[];
  onSelectResult: (result: EmailAnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');

  const filtered = history.filter((item) => {
    const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
    const matchesSearch =
      (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verdictTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Verdict', 'Risk Level', 'Score', 'Subject', 'Snippet'];
    const rows = history.map((item) => [
      `"${item.id}"`,
      `"${new Date(item.timestamp).toLocaleString()}"`,
      `"${item.verdictTitle.replace(/"/g, '""')}"`,
      `"${item.riskLevel}"`,
      item.riskScore,
      `"${(item.subject || '').replace(/"/g, '""')}"`,
      `"${item.snippet.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `star_phishguard_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="history-view" className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📜 Scan History</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review past email and link security assessments stored in this session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                type="button"
                id="export-csv-btn"
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                id="clear-history-btn"
                onClick={onClearHistory}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:text-rose-600 hover:border-rose-300 text-slate-600 text-xs font-bold transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scans by keyword or subject..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                riskFilter === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No scans found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || riskFilter !== 'ALL'
              ? 'Try changing your search or filter settings.'
              : 'Scan an email to start building your investigation history.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <RiskBadge level={item.riskLevel} size="sm" />
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Score {item.riskScore}/100
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.subject || item.verdictTitle}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {item.snippet}
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold self-end sm:self-center shrink-0">
                <Eye className="w-4 h-4" />
                <span>View Analysis</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
