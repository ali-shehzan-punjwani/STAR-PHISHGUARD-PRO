import { HeaderAnalysisResult, RiskLevel } from '../types';

export function analyzeHeaders(rawHeaders: string): HeaderAnalysisResult {
  const lines = rawHeaders.split(/\r?\n/);
  const headerMap: Record<string, string> = {};

  let currentKey = '';
  for (const line of lines) {
    if (/^[A-Za-z0-9-]+:/.test(line)) {
      const colonIndex = line.indexOf(':');
      currentKey = line.substring(0, colonIndex).trim().toLowerCase();
      headerMap[currentKey] = line.substring(colonIndex + 1).trim();
    } else if (currentKey && /^\s+/.test(line)) {
      headerMap[currentKey] += ' ' + line.trim();
    }
  }

  const from = headerMap['from'] || 'Not specified';
  const replyTo = headerMap['reply-to'] || headerMap['replyto'] || from;
  const returnPath = headerMap['return-path'] || 'Not specified';
  const subject = headerMap['subject'] || 'No Subject';
  const authResults = (headerMap['authentication-results'] || headerMap['received-spf'] || '').toLowerCase();

  // Extract email addresses
  const extractEmail = (str: string) => {
    const match = str.match(/<([^>]+)>/) || str.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1].toLowerCase() : str.toLowerCase();
  };

  const fromEmail = extractEmail(from);
  const replyToEmail = extractEmail(replyTo);
  const returnPathEmail = extractEmail(returnPath);

  const fromDomain = fromEmail.includes('@') ? fromEmail.split('@')[1] : '';
  const replyToDomain = replyToEmail.includes('@') ? replyToEmail.split('@')[1] : '';

  const hasMismatch = fromDomain !== '' && replyToDomain !== '' && fromDomain !== replyToDomain;

  // Determine SPF / DKIM / DMARC
  let spfStatus: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE' = 'NONE';
  if (authResults.includes('spf=pass') || authResults.includes('pass (spf')) spfStatus = 'PASS';
  else if (authResults.includes('spf=fail') || authResults.includes('fail (spf')) spfStatus = 'FAIL';
  else if (authResults.includes('spf=softfail')) spfStatus = 'SOFTFAIL';

  let dkimStatus: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
  if (authResults.includes('dkim=pass')) dkimStatus = 'PASS';
  else if (authResults.includes('dkim=fail')) dkimStatus = 'FAIL';

  let dmarcStatus: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
  if (authResults.includes('dmarc=pass')) dmarcStatus = 'PASS';
  else if (authResults.includes('dmarc=fail')) dmarcStatus = 'FAIL';

  const reasons: string[] = [];
  let score = 10;

  if (hasMismatch) {
    score += 45;
    reasons.push(`The Reply-To address (${replyToEmail}) does not match the visible sender domain (${fromDomain}). Replies will secretly go to a different recipient.`);
  }

  if (spfStatus === 'FAIL') {
    score += 30;
    reasons.push('SPF Authentication Failed: The sending server IP is not authorized by the claimed domain owner.');
  }

  if (dkimStatus === 'FAIL') {
    score += 25;
    reasons.push('DKIM Digital Signature Failed: Message body or headers may have been tampered with in transit.');
  }

  if (dmarcStatus === 'FAIL') {
    score += 20;
    reasons.push('DMARC Policy Failed: Domain rejects unauthorized senders.');
  }

  let finalScore = Math.min(95, Math.max(10, score));
  let riskLevel: RiskLevel = 'LOW';
  let verdictTitle = 'Headers Verified';
  let simpleExplanation = 'The email sender information matches and passes digital authentication checks.';

  if (finalScore >= 70 || (hasMismatch && spfStatus === 'FAIL')) {
    riskLevel = 'HIGH';
    verdictTitle = '⚠️ Sender Spoofing / Impersonation Detected';
    simpleExplanation = `The visible sender appears as ${fromDomain}, but replies and email routing point to an unrelated address (${replyToDomain}).`;
  } else if (finalScore >= 35 || hasMismatch) {
    riskLevel = 'MEDIUM';
    verdictTitle = '⚠️ Possible Sender Mismatch';
    simpleExplanation = 'The Reply-To address does not match the sender. Exercise caution before replying.';
  } else {
    riskLevel = 'LOW';
    verdictTitle = '✅ Valid & Authenticated Headers';
    simpleExplanation = 'Authentication records (SPF/DKIM) match the legitimate sender domain.';
    if (reasons.length === 0) {
      reasons.push('Sender and reply addresses match identically.');
      reasons.push('Email server hops and routing signatures verified.');
    }
  }

  const technicalHeaders = Object.entries(headerMap).map(([key, value]) => ({
    key: key.toUpperCase(),
    value
  }));

  return {
    id: 'hdr-' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    fromAddress: from,
    replyToAddress: replyTo,
    returnPath,
    subject,
    spfStatus,
    dkimStatus,
    dmarcStatus,
    hasMismatch,
    riskLevel,
    riskScore: finalScore,
    verdictTitle,
    simpleExplanation,
    reasons,
    technicalHeaders
  };
}
