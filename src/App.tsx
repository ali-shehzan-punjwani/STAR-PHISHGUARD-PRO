import React, { useState, useEffect } from 'react';
import { PageId, EmailAnalysisResult, AppSettings } from './types';
import {
  getStoredHistory,
  saveStoredHistory,
  getStoredSettings,
  saveStoredSettings,
  getStoredStats,
  clearAllHistory,
  AppStats
} from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AnalyzeEmail } from './components/AnalyzeEmail';
import { UrlScanner } from './components/UrlScanner';
import { HeaderAnalyzer } from './components/HeaderAnalyzer';
import { AttachmentCheck } from './components/AttachmentCheck';
import { ModelPerformance } from './components/ModelPerformance';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { SecurityTips } from './components/SecurityTips';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [history, setHistory] = useState<EmailAnalysisResult[]>([]);
  const [stats, setStats] = useState<AppStats>({ emailsAnalyzed: 127, phishingDetected: 48, highRisk: 31 });
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [analyzeEmailContent, setAnalyzeEmailContent] = useState<string>('');
  const [activeReport, setActiveReport] = useState<EmailAnalysisResult | null>(null);

  // Load persistent state on initial render
  useEffect(() => {
    const loadedHistory = getStoredHistory();
    setHistory(loadedHistory);
    setStats(getStoredStats());
    setSettings(getStoredSettings());
  }, []);

  const handleSelectPage = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSampleFromDashboard = (sampleContent: string) => {
    setAnalyzeEmailContent(sampleContent);
    setCurrentPage('analyze-email');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReport = (result: EmailAnalysisResult) => {
    setActiveReport(result);
    setCurrentPage('reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: EmailAnalysisResult) => {
    setActiveReport(item);
    setCurrentPage('reports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local scan history?')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      const defaults: AppSettings = {
        sensitivity: 'balanced',
        enableSoundAlerts: false,
        saveHistoryLocally: true,
        whitelistedDomains: ['microsoft.com', 'google.com', 'apple.com', 'amazon.com']
      };
      setSettings(defaults);
      saveStoredSettings(defaults);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">
      {/* Clean Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onQuickScan={() => {
            setAnalyzeEmailContent('');
            setCurrentPage('analyze-email');
          }}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentScans={history}
              onNavigate={handleSelectPage}
              onSelectSample={handleSelectSampleFromDashboard}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          )}

          {currentPage === 'analyze-email' && (
            <AnalyzeEmail
              initialContent={analyzeEmailContent}
              onViewReport={handleViewReport}
            />
          )}

          {currentPage === 'url-scanner' && <UrlScanner />}

          {currentPage === 'email-headers' && <HeaderAnalyzer />}

          {currentPage === 'attachment-check' && <AttachmentCheck />}

          {currentPage === 'model-performance' && <ModelPerformance />}

          {currentPage === 'history' && (
            <HistoryView
              history={history}
              onSelectResult={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView
              currentReport={activeReport}
              history={history}
              onSelectReport={(r) => setActiveReport(r)}
            />
          )}

          {currentPage === 'security-tips' && <SecurityTips />}

          {currentPage === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
}
