import React, { useState, useRef, useEffect } from 'react';
import { EmailAnalysisResult } from '../types';
import { analyzeEmailText, AnalyzeEmailOptions } from '../utils/analyzer';
import { addHistoryItem } from '../utils/storage';
import { ProgressiveResultView } from './ProgressiveResultView';
import { SAMPLE_EMAILS, SAMPLE_EML_DATA } from '../data/samples';
import {
  parseEmailFile,
  parseEmlContent,
  ParsedEmailResult
} from '../utils/emailFileParser';
import {
  Search,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  FileCode,
  Paperclip,
  ShieldAlert,
  ShieldCheck,
  Download,
  Eye,
  Code,
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface AnalyzeEmailProps {
  initialContent?: string;
  onViewReport?: (result: EmailAnalysisResult) => void;
}

export const AnalyzeEmail: React.FC<AnalyzeEmailProps> = ({
  initialContent,
  onViewReport
}) => {
  const [emailText, setEmailText] = useState(initialContent || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResult | null>(null);
  const [parsedEmail, setParsedEmail] = useState<ParsedEmailResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'headers' | 'raw'>('preview');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dragCounterRef = useRef<number>(0);

  // If initial content changes from external trigger (e.g. Dashboard sample click)
  useEffect(() => {
    if (initialContent) {
      setEmailText(initialContent);
      handleAnalyze(initialContent);
    }
  }, [initialContent]);

  const handleAnalyze = (textToAnalyze?: string, options?: AnalyzeEmailOptions) => {
    const content = (textToAnalyze ?? emailText).trim();
    if (!content) return;

    setAnalyzing(true);
    setTimeout(() => {
      const opts: AnalyzeEmailOptions = options || {
        fileName: parsedEmail?.fileName,
        fileFormat: parsedEmail?.fileFormat,
        attachments: parsedEmail?.attachments,
        parsedHeaders: parsedEmail?.headers,
        rawHeaders: parsedEmail?.rawHeaders
      };
      const res = analyzeEmailText(content, opts);
      setResult(res);
      addHistoryItem(res);
      setAnalyzing(false);
    }, 450);
  };

  // Process a dropped or selected File (.eml, .msg, .txt)
  const processFile = async (file: File) => {
    setErrorMessage(null);
    setParsing(true);

    try {
      const parsed = await parseEmailFile(file);
      setParsedEmail(parsed);
      setEmailText(parsed.fullAssembledText);
      setActiveTab('preview');

      // Auto-analyze upon automated parsing completion for instantaneous feedback
      handleAnalyze(parsed.fullAssembledText, {
        fileName: parsed.fileName,
        fileFormat: parsed.fileFormat,
        attachments: parsed.attachments,
        parsedHeaders: parsed.headers,
        rawHeaders: parsed.rawHeaders
      });
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(
        `Failed to parse ${file.name}. Ensure it is a valid .eml or .msg file.`
      );
    } finally {
      setParsing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input value so same file can be re-uploaded if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop event handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'eml' || ext === 'msg' || ext === 'txt') {
        processFile(file);
      } else {
        setErrorMessage(
          `"${file.name}" is not a supported email file format. Please drop a .eml, .msg, or .txt file.`
        );
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setEmailText('');
    setParsedEmail(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const loadSample = (sampleText: string) => {
    setParsedEmail(null);
    setErrorMessage(null);
    setEmailText(sampleText);
    handleAnalyze(sampleText);
  };

  const loadSampleEml = () => {
    setErrorMessage(null);
    setParsing(true);
    setTimeout(() => {
      const parsed = parseEmlContent(
        SAMPLE_EML_DATA.content,
        SAMPLE_EML_DATA.fileName,
        SAMPLE_EML_DATA.content.length
      );
      setParsedEmail(parsed);
      setEmailText(parsed.fullAssembledText);
      setActiveTab('preview');
      setParsing(false);
      handleAnalyze(parsed.fullAssembledText, {
        fileName: parsed.fileName,
        fileFormat: parsed.fileFormat,
        attachments: parsed.attachments,
        parsedHeaders: parsed.headers,
        rawHeaders: parsed.rawHeaders
      });
    }, 300);
  };

  const downloadTestEml = () => {
    const blob = new Blob([SAMPLE_EML_DATA.content], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = SAMPLE_EML_DATA.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="analyze-email-view" className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔍 Analyze Email</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Drop <code className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold">.eml</code> or{' '}
            <code className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold">.msg</code> files directly
            for automated header and content extraction, or paste message text.
          </p>
        </div>

        {/* Quick Sample Selector */}
        {!result && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold">Quick Samples:</span>
            <button
              type="button"
              id="load-sample-eml-btn"
              onClick={loadSampleEml}
              className="text-xs px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Sample .EML</span>
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_EMAILS[0].content)}
              className="text-xs px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold transition-colors"
            >
              Suspension
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_EMAILS[1].content)}
              className="text-xs px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 font-semibold transition-colors"
            >
              Payroll Lure
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input for .eml, .msg, .txt */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".eml,.msg,.txt,message/rfc822,application/vnd.ms-outlook"
        className="hidden"
        id="email-file-upload-input"
      />

      {/* Primary Input Container */}
      {!result ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6 relative transition-all"
        >
          {/* Error message banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* DRAG AND DROP ZONE */}
          <div
            id="email-drag-drop-zone"
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all relative select-none ${
              isDragging
                ? 'border-blue-600 bg-blue-50/80 ring-4 ring-blue-100 scale-[1.01] shadow-md'
                : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70 bg-slate-50/40'
            }`}
          >
            {parsing ? (
              <div className="py-6 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Parsing Email Headers & Content...
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Extracting RFC 822 headers, decoding MIME body parts, and scanning attachments
                  </p>
                </div>
              </div>
            ) : isDragging ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-blue-900">
                  Drop your email file here
                </h3>
                <p className="text-xs text-blue-700 font-semibold">
                  Instant header extraction & content analysis will trigger automatically
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
                    <span>Drop your .eml or .msg file here</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1">
                    Drag and drop raw email files for automated header and content parsing, or click to browse.
                  </p>
                </div>

                {/* Accepted format badges */}
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-mono font-bold shadow-2xs">
                    .EML (MIME RFC 822)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-mono font-bold shadow-2xs">
                    .MSG (Outlook Item)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-mono font-bold shadow-2xs">
                    .TXT (Plain Text)
                  </span>
                </div>

                {/* Quick actions inside dropzone */}
                <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
                  <button
                    type="button"
                    id="browse-email-files-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse Files</span>
                  </button>

                  <button
                    type="button"
                    id="try-sample-eml-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSampleEml();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>Load Sample .EML</span>
                  </button>

                  <button
                    type="button"
                    id="download-test-eml-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTestEml();
                    }}
                    title="Download a test .eml file to your computer to test drag-and-drop"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Test .EML</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PARSED EMAIL FILE CARD (If a file was dropped/uploaded) */}
          {parsedEmail && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {parsedEmail.fileName}
                      </h4>
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {parsedEmail.fileFormat}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {(parsedEmail.fileSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Automated Header and Content Extraction Succeeded</span>
                    </span>
                  </div>
                </div>

                {/* View Tabs */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('headers')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'headers'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Headers ({Object.keys(parsedEmail.headers).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('raw')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'raw'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Raw Stream
                  </button>
                </div>
              </div>

              {/* Tab 1: Summary of Extracted Email Elements */}
              {activeTab === 'preview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Extracted Subject
                      </span>
                      <span className="text-slate-900 font-bold block truncate">
                        {parsedEmail.subject}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Extracted Sender (From)
                      </span>
                      <span className="text-slate-900 font-semibold block truncate">
                        {parsedEmail.sender}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Reply-To Address
                        </span>
                        {parsedEmail.hasReplyToMismatch && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>MISMATCH</span>
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-semibold block truncate ${
                          parsedEmail.hasReplyToMismatch
                            ? 'text-rose-700 font-bold'
                            : 'text-slate-900'
                        }`}
                      >
                        {parsedEmail.replyTo}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                        Authentication Check
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            parsedEmail.authentication.spf === 'FAIL'
                              ? 'bg-rose-100 text-rose-800'
                              : parsedEmail.authentication.spf === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          SPF: {parsedEmail.authentication.spf || 'N/A'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            parsedEmail.authentication.dkim === 'FAIL'
                              ? 'bg-rose-100 text-rose-800'
                              : parsedEmail.authentication.dkim === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          DKIM: {parsedEmail.authentication.dkim || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Attachments Alert */}
                  {parsedEmail.attachments && parsedEmail.attachments.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-900">
                        <Paperclip className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                          {parsedEmail.attachments.length} Embedded Attachment
                          {parsedEmail.attachments.length > 1 ? 's' : ''} Extracted from MIME
                          parts:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsedEmail.attachments.map((att, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-amber-300 text-xs font-mono font-bold text-slate-800"
                          >
                            <span>📎</span>
                            <span>{att.name}</span>
                            {att.size ? (
                              <span className="text-[10px] text-slate-500 font-sans">
                                ({(att.size / 1024).toFixed(0)} KB)
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Parsed Headers Table */}
              {activeTab === 'headers' && (
                <div className="bg-white rounded-lg border border-slate-200 p-3 max-h-56 overflow-y-auto font-mono text-xs space-y-1.5">
                  {Object.entries(parsedEmail.headers).length > 0 ? (
                    Object.entries(parsedEmail.headers).map(([k, v], idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-start gap-1 py-1 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-bold text-slate-700 sm:w-44 shrink-0 uppercase text-[11px]">
                          {k}:
                        </span>
                        <span className="text-slate-900 break-all">{v}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No RFC 822 headers were found in this file.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Raw Source Stream */}
              {activeTab === 'raw' && (
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 max-h-56 overflow-y-auto text-[11px] font-mono whitespace-pre-wrap">
                  {parsedEmail.rawHeaders || parsedEmail.fullAssembledText}
                </pre>
              )}
            </div>
          )}

          {/* MANUAL TEXTAREA / EDITABLE CONTENT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="email-input-textarea"
                className="block text-sm font-bold text-slate-900"
              >
                {parsedEmail ? 'Extracted Message Content' : 'Or Paste Email Text Directly'}
              </label>

              {emailText.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setEmailText('');
                    setParsedEmail(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              id="email-input-textarea"
              ref={textareaRef}
              rows={7}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email text here, or drop a .eml / .msg file into the dropzone above..."
              className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 font-sans transition-all outline-hidden resize-y min-h-[160px]"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              id="analyze-email-submit-btn"
              disabled={!emailText.trim() || analyzing || parsing}
              onClick={() => handleAnalyze()}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-extrabold shadow-md hover:shadow-lg shadow-blue-200 transition-all focus:ring-4 focus:ring-blue-100"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Email Security...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>🔍 Analyze Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Render Progressive Disclosure Result View (Levels 1 to 4) */
        <ProgressiveResultView
          result={result}
          onReset={handleReset}
          onViewReport={onViewReport}
        />
      )}
    </div>
  );
};
