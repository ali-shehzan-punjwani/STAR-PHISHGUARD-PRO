import React from 'react';
import { PageId } from '../types';
import { Menu, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onOpenMobile: () => void;
  onQuickScan: () => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle?: string }> = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of email protection' },
  'analyze-email': { title: 'Analyze Email', subtitle: 'Inspect suspicious messages' },
  'url-scanner': { title: 'URL Scanner', subtitle: 'Check suspicious web links' },
  'email-headers': { title: 'Email Headers', subtitle: 'Detect sender spoofing & authentication' },
  'attachment-check': { title: 'Attachment Check', subtitle: 'Inspect file safety statically' },
  'model-performance': { title: 'Model Performance', subtitle: 'AI & classifier metrics' },
  'history': { title: 'Scan History', subtitle: 'Previous email and link investigations' },
  'reports': { title: 'Security Reports', subtitle: 'Generated assessment records' },
  'security-tips': { title: 'Security Tips', subtitle: 'Everyday cybersecurity best practices' },
  'settings': { title: 'Settings', subtitle: 'Preferences and protection options' },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobile,
  onQuickScan
}) => {
  const current = PAGE_TITLES[currentPage] || { title: 'STAR PhishGuard' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          id="mobile-sidebar-toggle-btn"
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
            {current.title}
          </h1>
          {current.subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">
              {current.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Protection Online</span>
        </div>

        {currentPage !== 'analyze-email' && (
          <button
            type="button"
            onClick={onQuickScan}
            id="header-quick-analyze-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Email</span>
          </button>
        )}
      </div>
    </header>
  );
};
