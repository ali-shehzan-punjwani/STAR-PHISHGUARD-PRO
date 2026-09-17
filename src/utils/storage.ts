import { EmailAnalysisResult, AppSettings } from '../types';
import { SAMPLE_EMAILS } from '../data/samples';
import { analyzeEmailText } from './analyzer';

const STORAGE_KEY_HISTORY = 'star_phishguard_history_v1';
const STORAGE_KEY_SETTINGS = 'star_phishguard_settings_v1';
const STORAGE_KEY_STATS = 'star_phishguard_stats_v1';

export interface AppStats {
  emailsAnalyzed: number;
  phishingDetected: number;
  highRisk: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  sensitivity: 'balanced',
  enableSoundAlerts: false,
  saveHistoryLocally: true,
  whitelistedDomains: ['microsoft.com', 'google.com', 'apple.com', 'amazon.com']
};

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getStoredHistory(): EmailAnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      const items = JSON.parse(raw);
      if (Array.isArray(items) && items.length > 0) return items;
    }
  } catch (e) {
    console.error('Failed to load history', e);
  }

  // Pre-seed with realistic initial scans for demo
  const initialHistory = [
    analyzeEmailText(SAMPLE_EMAILS[0].content),
    analyzeEmailText(SAMPLE_EMAILS[1].content),
    analyzeEmailText(SAMPLE_EMAILS[3].content)
  ];
  saveStoredHistory(initialHistory);
  return initialHistory;
}

export function saveStoredHistory(history: EmailAnalysisResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export function addHistoryItem(item: EmailAnalysisResult): void {
  const list = getStoredHistory();
  const updated = [item, ...list.filter(h => h.id !== item.id)].slice(0, 50);
  saveStoredHistory(updated);

  // Update stats
  incrementStats(item.riskLevel);
}

export function getStoredStats(): AppStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  return {
    emailsAnalyzed: 127,
    phishingDetected: 48,
    highRisk: 31
  };
}

export function incrementStats(level: 'LOW' | 'MEDIUM' | 'HIGH'): void {
  const stats = getStoredStats();
  stats.emailsAnalyzed += 1;
  if (level === 'HIGH' || level === 'MEDIUM') {
    stats.phishingDetected += 1;
  }
  if (level === 'HIGH') {
    stats.highRisk += 1;
  }
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}
