import React, { useState, useRef } from 'react';
import { AttachmentAnalysisResult } from '../types';
import { analyzeAttachmentFile } from '../utils/attachmentAnalyzer';
import { RiskBadge } from './RiskBadge';
import { SAMPLE_ATTACHMENTS } from '../data/samples';
import {
  Paperclip,
  UploadCloud,
  File,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const AttachmentCheck: React.FC = () => {
  const [result, setResult] = useState<AttachmentAnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    const res = analyzeAttachmentFile(file.name, file.size, file.type);
    setResult(res);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSample = (sample: typeof SAMPLE_ATTACHMENTS[0]) => {
    const simulatedSize = sample.size.includes('MB') ? 1.4 * 1024 * 1024 : 420 * 1024;
    const res = analyzeAttachmentFile(sample.name, simulatedSize, sample.type);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="attachment-check-view" className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>📎 Check an Attachment</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Inspect file extensions, macro indicators, and disguised executable payloads before opening.
        </p>
      </div>

      {/* Static Analysis Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-bold block text-amber-950 mb-0.5">Static Inspection Notice</strong>
          STAR PhishGuard performs static analysis only and does not execute uploaded files.
        </div>
      </div>

      {/* Upload Box */}
      {!result ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all bg-white ${
              dragOver
                ? 'border-blue-600 bg-blue-50/40 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
              id="attachment-file-input"
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Drag and drop an attachment here, or click to browse
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports .pdf, .exe, .xlsm, .docm, .zip, .iso, .vbs, and other email attachments
            </p>
          </div>

          {/* Sample Attachments to test */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Or test with sample attachment types:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_ATTACHMENTS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSample(s)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {s.note}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
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

            {/* File Info */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">File:</span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {result.fileName}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-slate-600">
                {result.fileSizeFormatted}
              </div>
            </div>

            {/* Why? Reasons */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Why did STAR PhishGuard flag this file?
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

            {/* What to do */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Recommended Actions:
              </h4>
              <div className="space-y-2">
                {result.actions.map((act) => (
                  <div
                    key={act.id}
                    className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-semibold ${
                      act.type === 'dont'
                        ? 'bg-rose-50/70 text-rose-900 border border-rose-200'
                        : 'bg-emerald-50/70 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {act.type === 'dont' ? (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span>{act.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Static Disclaimer Reminder */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>SHA-256 Hash: <code className="text-slate-700">{result.technical.simulatedSha256.substring(0, 16)}...</code></span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Another Attachment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
