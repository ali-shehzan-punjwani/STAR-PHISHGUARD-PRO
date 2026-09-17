import React from 'react';
import {
  Cpu,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Database,
  Info
} from 'lucide-react';

export const ModelPerformance: React.FC = () => {
  return (
    <div id="model-performance-view" className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>📊 Model Performance</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Detection engine metrics, classifier benchmarks, and ensemble architecture accuracy.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Overall Accuracy
          </span>
          <div className="text-3xl font-black text-blue-600 mt-1 tracking-tight">
            98.4%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Benchmark Tested
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Precision
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
            98.9%
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            Phishing identification
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Recall (Sensitivity)
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
            97.8%
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            Threat capture rate
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            False Positive Rate
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1 tracking-tight">
            1.1%
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            Ultra-low business disruption
          </span>
        </div>
      </div>

      {/* Detection Pipeline Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Multi-Layer Ensemble Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>TF-IDF + Logistic Regression</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast, deterministic token vectorization measuring statistical ngram frequencies and keyword trigger weights.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Neural Perceptron (MLP)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dense neural network layers identifying non-linear patterns, semantic context, and evasive urgency phrasing.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>Heuristic & Domain Verifier</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rule-based verification of domain lookalikes, SPF/DKIM headers, URL redirection chains, and file attachments.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Evaluation Corpus */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          <span>Training & Validation Corpora</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <strong className="block text-slate-900 font-bold">Enron Email Corpus</strong>
            <span className="text-slate-500">500,000+ legitimate business emails</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <strong className="block text-slate-900 font-bold">Nazario Phishing Corpus</strong>
            <span className="text-slate-500">Real-world targeted phishing attacks</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <strong className="block text-slate-900 font-bold">SpamAssassin Public DB</strong>
            <span className="text-slate-500">Standard spam and ham baseline</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <strong className="block text-slate-900 font-bold">PhishTank Live Feeds</strong>
            <span className="text-slate-500">Active malicious URL indicators</span>
          </div>
        </div>
      </div>
    </div>
  );
};
