import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Hash, Link2, ShieldCheck, AlertCircle } from 'lucide-react';
import { TechnicalAnalysisData } from '../types';

interface TechnicalAccordionProps {
  technical: TechnicalAnalysisData;
  title?: string;
}

export const TechnicalAccordion: React.FC<TechnicalAccordionProps> = ({
  technical,
  title = 'Technical Analysis'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="technical-analysis-accordion"
      className="mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
    >
      <button
        type="button"
        id="toggle-technical-accordion-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-slate-50/80 hover:bg-slate-100/80 transition-colors border-b border-transparent focus:outline-hidden"
      >
        <div className="flex items-center gap-2.5 text-slate-700 font-semibold text-sm">
          <Cpu className="w-4 h-4 text-slate-500" />
          <span>{isOpen ? '▲' : '▼'} {title}</span>
          <span className="text-xs text-slate-500 font-normal ml-2">
            (ML confidence, indicators & model weights)
          </span>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-white text-sm text-slate-700 border-t border-slate-100 animate-fadeIn">
          {/* ML Classifier Confidence Scores */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Machine Learning Ensemble Outputs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-slate-700">Logistic Regression Confidence</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(technical.logisticRegressionConfidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${technical.logisticRegressionConfidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">TF-IDF N-gram token weight vector calculation</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-slate-700">Multi-Layer Perceptron (MLP)</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(technical.mlpConfidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-600 h-full rounded-full transition-all"
                    style={{ width: `${technical.mlpConfidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Dense non-linear pattern classification</p>
              </div>
            </div>
          </div>

          {/* Extracted Indicators Table */}
          {technical.extractedIndicators && technical.extractedIndicators.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> Extracted Indicators
              </h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Indicator Category</th>
                      <th className="px-3.5 py-2.5">Extracted Value</th>
                      <th className="px-3.5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {technical.extractedIndicators.map((ind, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3.5 py-2.5 font-medium text-slate-900">{ind.name}</td>
                        <td className="px-3.5 py-2.5 text-slate-600">{ind.value}</td>
                        <td className="px-3.5 py-2.5">
                          {ind.status === 'clean' && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              <ShieldCheck className="w-3 h-3" /> Clean
                            </span>
                          )}
                          {ind.status === 'suspicious' && (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              <AlertCircle className="w-3 h-3" /> Warning
                            </span>
                          )}
                          {ind.status === 'danger' && (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              <AlertCircle className="w-3 h-3" /> Triggered
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Triggered Keywords */}
          {technical.keywordTriggers && technical.keywordTriggers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Triggered Vocabulary Tokens
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {technical.keywordTriggers.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected URLs */}
          {technical.detectedUrls && technical.detectedUrls.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> Embedded Hyperlinks ({technical.detectedUrls.length})
              </h4>
              <div className="space-y-1.5">
                {technical.detectedUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 break-all"
                  >
                    {url}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
