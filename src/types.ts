export type PageId =
  | 'dashboard'
  | 'analyze-email'
  | 'url-scanner'
  | 'email-headers'
  | 'attachment-check'
  | 'model-performance'
  | 'history'
  | 'reports'
  | 'security-tips'
  | 'settings';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ReasonItem {
  id: string;
  iconType: 'warning' | 'alert' | 'info' | 'check';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ActionItem {
  id: string;
  type: 'dont' | 'do';
  text: string;
  description?: string;
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  status: 'clean' | 'suspicious' | 'danger';
}

export interface TechnicalAnalysisData {
  logisticRegressionConfidence: number; // e.g. 0.93
  mlpConfidence: number; // e.g. 0.91
  ensembleScore: number;
  extractedIndicators: TechnicalIndicator[];
  detectedUrls: string[];
  entropyScore?: number;
  keywordTriggers: string[];
  brandDetected?: string;
  headerAnomalies?: string[];
  rawDetails?: Record<string, any>;
}

export interface EmailAnalysisResult {
  id: string;
  timestamp: string;
  subject?: string;
  sender?: string;
  snippet: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictTitle: string; // e.g. "🚨 High Risk Phishing Email"
  reasons: ReasonItem[];
  actions: ActionItem[];
  technical: TechnicalAnalysisData;
  sourceType: 'email' | 'url' | 'header' | 'attachment';
  fileName?: string;
  fileFormat?: 'eml' | 'msg' | 'txt';
  attachments?: {
    name: string;
    size?: number;
    type?: string;
    extension?: string;
  }[];
  parsedHeaders?: Record<string, string>;
  rawHeaders?: string;
}

export interface UrlAnalysisResult {
  id: string;
  timestamp: string;
  url: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verdictTitle: string;
  reasons: string[];
  actions: ActionItem[];
  technical: {
    domain: string;
    protocol: string;
    isHttps: boolean;
    domainAgeEstimate: string;
    hasLoginKeywords: boolean;
    hasLookalikeCharacters: boolean;
    ipAddressHost: boolean;
    redirectCount: number;
    blacklistsChecked: number;
    blacklistsMatched: number;
  };
}

export interface HeaderAnalysisResult {
  id: string;
  timestamp: string;
  fromAddress: string;
  replyToAddress: string;
  returnPath: string;
  subject: string;
  spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkimStatus: 'PASS' | 'FAIL' | 'NONE';
  dmarcStatus: 'PASS' | 'FAIL' | 'NONE';
  hasMismatch: boolean;
  riskLevel: RiskLevel;
  riskScore: number;
  verdictTitle: string;
  simpleExplanation: string;
  reasons: string[];
  technicalHeaders: {
    key: string;
    value: string;
  }[];
}

export interface AttachmentAnalysisResult {
  id: string;
  timestamp: string;
  fileName: string;
  fileSizeFormatted: string;
  fileType: string;
  extension: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verdictTitle: string;
  reasons: string[];
  actions: ActionItem[];
  technical: {
    isExecutable: boolean;
    isMacroEnabled: boolean;
    isArchive: boolean;
    hasDoubleExtension: boolean;
    mimeType: string;
    simulatedSha256: string;
    entropy: number;
  };
}

export interface SecurityTip {
  id: string;
  icon: string;
  title: string;
  summary: string;
  advice: string;
  example: string;
}

export interface QuizQuestion {
  id: number;
  emailSubject: string;
  emailSender: string;
  emailBody: string;
  isPhishing: boolean;
  explanation: string;
  clues: string[];
}

export interface AppSettings {
  sensitivity: 'conservative' | 'balanced' | 'aggressive';
  enableSoundAlerts: boolean;
  saveHistoryLocally: boolean;
  whitelistedDomains: string[];
}
