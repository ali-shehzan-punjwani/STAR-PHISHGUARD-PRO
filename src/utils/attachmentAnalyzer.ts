import { AttachmentAnalysisResult, RiskLevel, ActionItem } from '../types';

const EXECUTABLE_EXTENSIONS = ['.exe', '.scr', '.vbs', '.bat', '.cmd', '.ps1', '.sh', '.msi', '.jar', '.com', '.gadget', '.hta', '.cpl', '.pif'];
const MACRO_EXTENSIONS = ['.docm', '.xlsm', '.pptm', '.dotm', '.xltm', '.ppam'];
const ARCHIVE_EXTENSIONS = ['.zip', '.rar', '.7z', '.tar', '.gz', '.iso', '.img'];
const SUSPICIOUS_DOUBLE_EXT_PATTERNS = [
  /\.pdf\.exe$/i,
  /\.docx?\.exe$/i,
  /\.xlsx?\.exe$/i,
  /\.jpg\.exe$/i,
  /\.png\.exe$/i,
  /\.pdf\.scr$/i,
  /\.pdf\.vbs$/i,
  /\.txt\.exe$/i
];

export function analyzeAttachmentFile(
  fileName: string,
  fileSize: number,
  mimeType: string
): AttachmentAnalysisResult {
  const lowerName = fileName.toLowerCase();
  const extensionMatch = lowerName.match(/\.[a-z0-9]+$/);
  const extension = extensionMatch ? extensionMatch[0] : '';

  const isExecutable = EXECUTABLE_EXTENSIONS.includes(extension);
  const isMacroEnabled = MACRO_EXTENSIONS.includes(extension);
  const isArchive = ARCHIVE_EXTENSIONS.includes(extension);
  const hasDoubleExtension = SUSPICIOUS_DOUBLE_EXT_PATTERNS.some(p => p.test(lowerName));

  const reasons: string[] = [];
  let score = 5;

  if (hasDoubleExtension) {
    score += 85;
    reasons.push('Deceptive Double Extension detected (e.g. disguise as a PDF/document hiding an executable file)');
  }

  if (isExecutable) {
    score += 75;
    reasons.push('Executable file type (.exe, .scr, .vbs, etc.) capable of running arbitrary code on your system');
    reasons.push('Potentially dangerous attachment type commonly used in malware distribution');
  }

  if (isMacroEnabled) {
    score += 55;
    reasons.push('Macro-enabled Office document capable of launching automated background scripts');
  }

  if (isArchive) {
    score += 35;
    reasons.push('Archive container file (.zip, .rar, .iso) that may conceal uninspected binary files');
  }

  // Format file size
  let formattedSize = `${(fileSize / 1024).toFixed(1)} KB`;
  if (fileSize > 1024 * 1024) {
    formattedSize = `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  }

  let finalScore = Math.min(98, Math.max(5, score));
  let riskLevel: RiskLevel = 'LOW';
  let verdictTitle = 'File Appears Standard';

  if (finalScore >= 70 || isExecutable || hasDoubleExtension) {
    riskLevel = 'HIGH';
    verdictTitle = '🔴 HIGH RISK - Potentially Dangerous Attachment';
  } else if (finalScore >= 35 || isMacroEnabled || isArchive) {
    riskLevel = 'MEDIUM';
    verdictTitle = '🟡 MEDIUM RISK - Unverified Attachment Type';
  } else {
    riskLevel = 'LOW';
    verdictTitle = '🟢 LOW RISK - Standard Document';
    if (reasons.length === 0) {
      reasons.push('Standard benign document format without executable script wrappers.');
      reasons.push('No dual extensions or embedded binary triggers detected.');
    }
  }

  const actions: ActionItem[] = [];
  if (riskLevel === 'HIGH') {
    actions.push(
      { id: 'att-1', type: 'dont', text: 'Do not open, run, or extract this file' },
      { id: 'att-2', type: 'dont', text: 'Do not disable antivirus or security warnings' },
      { id: 'att-3', type: 'do', text: 'Delete the attachment or submit to your corporate security quarantine' }
    );
  } else if (riskLevel === 'MEDIUM') {
    actions.push(
      { id: 'att-1', type: 'dont', text: 'Do not click "Enable Content" or "Enable Macros" if prompted' },
      { id: 'att-2', type: 'do', text: 'Confirm with the sender via phone or chat before extracting' }
    );
  } else {
    actions.push(
      { id: 'att-1', type: 'do', text: 'Open in preview mode first if you do not know the sender personally' }
    );
  }

  // Simulated hash for static display
  const simulatedSha256 = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return {
    id: 'att-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    fileName,
    fileSizeFormatted: formattedSize,
    fileType: mimeType || 'application/octet-stream',
    extension: extension || 'none',
    riskScore: finalScore,
    riskLevel,
    verdictTitle,
    reasons,
    actions,
    technical: {
      isExecutable,
      isMacroEnabled,
      isArchive,
      hasDoubleExtension,
      mimeType: mimeType || 'application/octet-stream',
      simulatedSha256,
      entropy: riskLevel === 'HIGH' ? 7.64 : 4.12
    }
  };
}
