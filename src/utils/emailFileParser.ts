export interface ExtractedAttachment {
  name: string;
  size?: number;
  type?: string;
  extension?: string;
}

export interface ParsedEmailResult {
  fileName: string;
  fileSize: number;
  fileFormat: 'eml' | 'msg' | 'txt';
  subject: string;
  sender: string;
  senderEmail: string;
  senderName: string;
  replyTo: string;
  replyToEmail: string;
  to: string;
  date: string;
  body: string;
  rawHeaders: string;
  headers: Record<string, string>;
  attachments: ExtractedAttachment[];
  authentication: {
    spf?: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
    dkim?: 'PASS' | 'FAIL' | 'NONE';
    dmarc?: 'PASS' | 'FAIL' | 'NONE';
    details?: string;
  };
  hasReplyToMismatch: boolean;
  fullAssembledText: string;
}

// Decode RFC 2047 encoded words like =?UTF-8?B?....?= or =?ISO-8859-1?Q?....?=
export function decodeMimeHeaderWord(text: string): string {
  if (!text) return '';
  return text.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_, _charset, encoding, encodedText) => {
    try {
      const isBase64 = encoding.toUpperCase() === 'B';
      if (isBase64) {
        const bin = atob(encodedText.replace(/\s+/g, ''));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
      } else {
        // Quoted-printable word
        const qp = encodedText.replace(/_/g, ' ');
        return qp.replace(/=([0-9A-Fa-f]{2})/g, (__: string, hex: string) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      }
    } catch {
      return encodedText;
    }
  });
}

// Safely decode Quoted-Printable body parts
export function decodeQuotedPrintable(input: string): string {
  if (!input) return '';
  const unfolded = input.replace(/=\r?\n/g, '');
  return unfolded.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return `=${hex}`;
    }
  });
}

// Safely decode Base64 string to text
export function decodeBase64ToString(b64: string): string {
  try {
    const cleanB64 = b64.replace(/\s+/g, '');
    const bin = atob(cleanB64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return b64;
  }
}

// Strip HTML tags and entities to plain readable text
export function stripHtmlToText(html: string): string {
  if (!html) return '';
  let clean = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Collapse excessive blank lines
  return clean.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

// Extract email address inside brackets or raw string
export function extractEmailAddress(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/<([^>]+)>/);
  if (match && match[1]) {
    return match[1].trim().toLowerCase();
  }
  const emailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0].trim().toLowerCase() : raw.trim().toLowerCase();
}

// Extract display name from header (e.g. "Security Team" <security@domain.com>)
export function extractDisplayName(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/^"?([^"<]+)"?\s*</);
  if (match && match[1]) {
    return match[1].trim();
  }
  return raw.replace(/<[^>]+>/, '').trim();
}

// Extract boundaries from Content-Type header
function extractBoundary(contentType: string): string | null {
  const match = contentType.match(/boundary=["']?([^"';\s]+)["']?/i);
  return match ? match[1] : null;
}

// Parse Raw EML / RFC 822 Email Content
export function parseEmlContent(
  textContent: string,
  fileName: string,
  fileSize: number
): ParsedEmailResult {
  const normalized = textContent.replace(/\r\n/g, '\n');
  const headerBodySplit = normalized.indexOf('\n\n');

  let rawHeaders = '';
  let bodyContent = '';

  if (headerBodySplit !== -1) {
    rawHeaders = normalized.substring(0, headerBodySplit);
    bodyContent = normalized.substring(headerBodySplit + 2);
  } else {
    rawHeaders = normalized.substring(0, Math.min(normalized.length, 1200));
    bodyContent = normalized;
  }

  // Parse and unfold RFC 822 headers
  const headerLines = rawHeaders.split('\n');
  const unfoldedHeaders: string[] = [];
  for (const line of headerLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && unfoldedHeaders.length > 0) {
      unfoldedHeaders[unfoldedHeaders.length - 1] += ' ' + line.trim();
    } else {
      unfoldedHeaders.push(line);
    }
  }

  const headers: Record<string, string> = {};
  for (const line of unfoldedHeaders) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim().toLowerCase();
      const val = line.substring(colonIdx + 1).trim();
      headers[key] = decodeMimeHeaderWord(val);
    }
  }

  // Key Header Fields
  const subject = headers['subject'] || 'No Subject';
  const sender = headers['from'] || 'Unknown Sender';
  const senderEmail = extractEmailAddress(sender);
  const senderName = extractDisplayName(sender);

  const replyTo = headers['reply-to'] || '';
  const replyToEmail = replyTo ? extractEmailAddress(replyTo) : '';

  const senderDomain = senderEmail.includes('@') ? senderEmail.split('@')[1] : '';
  const replyToDomain = replyToEmail.includes('@') ? replyToEmail.split('@')[1] : '';
  const hasReplyToMismatch =
    senderDomain !== '' && replyToDomain !== '' && senderDomain !== replyToDomain;

  const to = headers['to'] || '';
  const date = headers['date'] || '';

  // Extract Authentication Results (SPF, DKIM, DMARC)
  const authResults = headers['authentication-results'] || '';
  const receivedSpf = headers['received-spf'] || '';
  const combinedAuth = `${authResults} ${receivedSpf}`.toLowerCase();

  let spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE' = 'NONE';
  if (combinedAuth.includes('spf=fail') || combinedAuth.includes('spf: fail')) spf = 'FAIL';
  else if (combinedAuth.includes('spf=softfail')) spf = 'SOFTFAIL';
  else if (combinedAuth.includes('spf=pass') || combinedAuth.includes('spf: pass')) spf = 'PASS';

  let dkim: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
  if (combinedAuth.includes('dkim=fail')) dkim = 'FAIL';
  else if (combinedAuth.includes('dkim=pass')) dkim = 'PASS';

  let dmarc: 'PASS' | 'FAIL' | 'NONE' = 'NONE';
  if (combinedAuth.includes('dmarc=fail')) dmarc = 'FAIL';
  else if (combinedAuth.includes('dmarc=pass')) dmarc = 'PASS';

  // Process MIME Body Parts & Attachments
  const contentType = headers['content-type'] || '';
  const boundary = extractBoundary(contentType);

  let extractedTextBody = '';
  let extractedHtmlBody = '';
  const attachments: ExtractedAttachment[] = [];

  if (boundary) {
    const parts = bodyContent.split(new RegExp(`--${boundary}(?:--)?`));
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (!trimmedPart) continue;

      const partSplit = trimmedPart.indexOf('\n\n');
      if (partSplit === -1) continue;

      const partHeadersStr = trimmedPart.substring(0, partSplit).toLowerCase();
      let partData = trimmedPart.substring(partSplit + 2).trim();

      // Check if this part is an attachment
      const isAttachment =
        partHeadersStr.includes('content-disposition: attachment') ||
        partHeadersStr.includes('filename=') ||
        partHeadersStr.includes('name=');

      const filenameMatch = partHeadersStr.match(/(?:filename|name)=["']?([^"';\r\n]+)["']?/i);
      if (isAttachment || filenameMatch) {
        const attName = filenameMatch ? filenameMatch[1].trim() : 'attachment.dat';
        const ext = attName.split('.').pop()?.toLowerCase();
        attachments.push({
          name: decodeMimeHeaderWord(attName),
          size: Math.round(partData.length * 0.75), // approximate byte size for base64
          extension: ext
        });
        continue;
      }

      // Check text or html part
      const isBase64 = partHeadersStr.includes('content-transfer-encoding: base64');
      const isQp = partHeadersStr.includes('content-transfer-encoding: quoted-printable');

      if (isBase64) {
        partData = decodeBase64ToString(partData);
      } else if (isQp) {
        partData = decodeQuotedPrintable(partData);
      }

      if (partHeadersStr.includes('text/plain')) {
        extractedTextBody += (extractedTextBody ? '\n' : '') + partData;
      } else if (partHeadersStr.includes('text/html')) {
        extractedHtmlBody += (extractedHtmlBody ? '\n' : '') + partData;
      }
    }
  } else {
    // Single part message
    const isBase64 = (headers['content-transfer-encoding'] || '').toLowerCase().includes('base64');
    const isQp = (headers['content-transfer-encoding'] || '')
      .toLowerCase()
      .includes('quoted-printable');

    if (isBase64) {
      bodyContent = decodeBase64ToString(bodyContent);
    } else if (isQp) {
      bodyContent = decodeQuotedPrintable(bodyContent);
    }

    if (contentType.toLowerCase().includes('text/html')) {
      extractedHtmlBody = bodyContent;
    } else {
      extractedTextBody = bodyContent;
    }
  }

  // Final clean body text
  let finalBody = extractedTextBody.trim();
  if (!finalBody && extractedHtmlBody) {
    finalBody = stripHtmlToText(extractedHtmlBody);
  } else if (!finalBody) {
    finalBody = bodyContent.trim();
  }

  // Assemble full readable format for display and deep threat analysis
  const fullAssembledText = [
    `From: ${sender}`,
    replyTo && replyTo !== sender ? `Reply-To: ${replyTo}` : '',
    to ? `To: ${to}` : '',
    date ? `Date: ${date}` : '',
    `Subject: ${subject}`,
    spf !== 'NONE' ? `Authentication-Results: spf=${spf.toLowerCase()} dkim=${dkim.toLowerCase()} dmarc=${dmarc.toLowerCase()}` : '',
    '',
    finalBody
  ]
    .filter(Boolean)
    .join('\n');

  return {
    fileName,
    fileSize,
    fileFormat: 'eml',
    subject,
    sender,
    senderEmail,
    senderName,
    replyTo,
    replyToEmail,
    to,
    date,
    body: finalBody,
    rawHeaders,
    headers,
    attachments,
    authentication: {
      spf,
      dkim,
      dmarc,
      details: combinedAuth || undefined
    },
    hasReplyToMismatch,
    fullAssembledText
  };
}

// Browser-native Compound File Binary (CFB) parser for Outlook .MSG files
// Zero external node dependencies, zero Buffer.prototype crashes
interface CfbEntry {
  name: string;
  type: number;
  startSector: number;
  size: number;
}

function parseCfbMsg(buffer: ArrayBuffer): {
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  replyTo?: string;
  bodyText?: string;
  bodyHtml?: string;
  headersStr?: string;
  attachments: ExtractedAttachment[];
  recipients: string[];
} {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // Check CFB magic bytes: D0 CF 11 E0 A1 B1 1A E1
  const isCfb =
    bytes.length >= 512 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 &&
    bytes[5] === 0xb1 &&
    bytes[6] === 0x1a &&
    bytes[7] === 0xe1;

  if (!isCfb) {
    throw new Error('Not a valid Compound File Binary format');
  }

  const sectorShift = view.getUint16(30, true);
  const sectorSize = 1 << sectorShift;
  const miniSectorShift = view.getUint16(32, true);
  const miniSectorSize = 1 << miniSectorShift;
  const numFatSectors = view.getUint32(44, true);
  const firstDirSector = view.getUint32(48, true);
  const firstMiniFatSector = view.getUint32(60, true);

  // Read DIFAT (first 109 entries in header starting at offset 76)
  const difat: number[] = [];
  for (let i = 0; i < 109 && difat.length < numFatSectors; i++) {
    const sec = view.getUint32(76 + i * 4, true);
    if (sec < 0xfffffffe) {
      difat.push(sec);
    }
  }

  // Read FAT table
  const fatTable: number[] = [];
  for (const fatSec of difat) {
    const offset = (fatSec + 1) * sectorSize;
    const count = sectorSize / 4;
    for (let j = 0; j < count; j++) {
      if (offset + j * 4 + 4 <= buffer.byteLength) {
        fatTable.push(view.getUint32(offset + j * 4, true));
      }
    }
  }

  // Sector chain traversal helper
  function getChain(startSector: number, table: number[]): number[] {
    const chain: number[] = [];
    let cur = startSector;
    while (cur >= 0 && cur < 0xfffffffe && chain.length < 20000) {
      chain.push(cur);
      cur = table[cur];
    }
    return chain;
  }

  // Read Mini FAT
  const miniFatTable: number[] = [];
  if (firstMiniFatSector < 0xfffffffe) {
    const miniFatChain = getChain(firstMiniFatSector, fatTable);
    for (const sec of miniFatChain) {
      const offset = (sec + 1) * sectorSize;
      const count = sectorSize / 4;
      for (let j = 0; j < count; j++) {
        if (offset + j * 4 + 4 <= buffer.byteLength) {
          miniFatTable.push(view.getUint32(offset + j * 4, true));
        }
      }
    }
  }

  // Read Directory Entries
  const dirChain = getChain(firstDirSector, fatTable);
  const dirBytes = new Uint8Array(dirChain.length * sectorSize);
  for (let i = 0; i < dirChain.length; i++) {
    const sec = dirChain[i];
    const offset = (sec + 1) * sectorSize;
    dirBytes.set(bytes.subarray(offset, offset + sectorSize), i * sectorSize);
  }

  const dirView = new DataView(dirBytes.buffer);
  const totalEntries = Math.floor(dirBytes.length / 128);
  const entries: CfbEntry[] = [];
  const utf16Decoder = new TextDecoder('utf-16le');
  const utf8Decoder = new TextDecoder('utf-8');

  for (let i = 0; i < totalEntries; i++) {
    const offset = i * 128;
    const nameLen = dirView.getUint16(offset + 64, true);
    if (nameLen <= 2) continue;

    const nameSlice = dirBytes.subarray(offset, offset + nameLen - 2);
    const name = utf16Decoder.decode(nameSlice);
    const type = dirView.getUint8(offset + 66);
    const startSector = dirView.getUint32(offset + 116, true);
    const size = dirView.getUint32(offset + 120, true);

    entries.push({ name, type, startSector, size });
  }

  // Root entry (entry 0) defines the Mini Stream
  const root = entries[0];
  let miniStreamBytes = new Uint8Array(0);
  if (root && root.startSector < 0xfffffffe) {
    const miniStreamChain = getChain(root.startSector, fatTable);
    miniStreamBytes = new Uint8Array(miniStreamChain.length * sectorSize);
    for (let i = 0; i < miniStreamChain.length; i++) {
      const sec = miniStreamChain[i];
      const offset = (sec + 1) * sectorSize;
      miniStreamBytes.set(bytes.subarray(offset, offset + sectorSize), i * sectorSize);
    }
  }

  // Helper to read data for a specific entry
  function readEntryData(entry: CfbEntry): Uint8Array {
    if (entry.size === 0) return new Uint8Array(0);

    if (entry.size < 4096 && miniFatTable.length > 0 && miniStreamBytes.length > 0) {
      // Read from Mini Stream
      const chain = getChain(entry.startSector, miniFatTable);
      const res = new Uint8Array(Math.min(entry.size, chain.length * miniSectorSize));
      let filled = 0;
      for (const mSec of chain) {
        if (filled >= entry.size) break;
        const offset = mSec * miniSectorSize;
        const chunk = Math.min(miniSectorSize, entry.size - filled);
        res.set(miniStreamBytes.subarray(offset, offset + chunk), filled);
        filled += chunk;
      }
      return res;
    } else {
      // Read from regular stream
      const chain = getChain(entry.startSector, fatTable);
      const res = new Uint8Array(Math.min(entry.size, chain.length * sectorSize));
      let filled = 0;
      for (const sec of chain) {
        if (filled >= entry.size) break;
        const offset = (sec + 1) * sectorSize;
        const chunk = Math.min(sectorSize, entry.size - filled);
        res.set(bytes.subarray(offset, offset + chunk), filled);
        filled += chunk;
      }
      return res;
    }
  }

  const result: {
    subject?: string;
    senderName?: string;
    senderEmail?: string;
    replyTo?: string;
    bodyText?: string;
    bodyHtml?: string;
    headersStr?: string;
    attachments: ExtractedAttachment[];
    recipients: string[];
  } = {
    attachments: [],
    recipients: []
  };

  // Inspect entries for Outlook tags
  // Pattern: __substg1.0_XXXXYYYY
  for (const entry of entries) {
    if (entry.name.includes('__substg1.0_')) {
      const tagPart = entry.name.split('__substg1.0_')[1];
      if (!tagPart || tagPart.length < 8) continue;

      const tagId = tagPart.substring(0, 4).toUpperCase();
      const typeId = tagPart.substring(4, 8).toUpperCase();
      const data = readEntryData(entry);

      // Decoded string helper
      const decodeStr = () => {
        if (typeId === '001F') {
          return utf16Decoder.decode(data).replace(/\0+$/, '');
        } else {
          return utf8Decoder.decode(data).replace(/\0+$/, '');
        }
      };

      if (tagId === '0037') {
        // PidTagSubject
        result.subject = decodeStr();
      } else if (tagId === '0C1A') {
        // PidTagSenderName
        result.senderName = decodeStr();
      } else if (tagId === '0C1F' || tagId === '0065') {
        // PidTagSenderEmailAddress / PidTagSentRepresentingEmailAddress
        const email = decodeStr();
        if (!result.senderEmail || email.includes('@')) {
          result.senderEmail = email;
        }
      } else if (tagId === '1000') {
        // PidTagBody
        result.bodyText = decodeStr();
      } else if (tagId === '1013') {
        // PidTagBodyHtml
        result.bodyHtml = decodeStr();
      } else if (tagId === '007D') {
        // PidTagTransportMessageHeaders
        result.headersStr = decodeStr();
      } else if (tagId === '3704' || tagId === '3707') {
        // PidTagAttachFilename / PidTagAttachLongFilename
        const filename = decodeStr();
        if (filename) {
          result.attachments.push({
            name: filename,
            size: entry.size,
            extension: filename.split('.').pop()?.toLowerCase()
          });
        }
      } else if (tagId === '3001' || tagId === '39FE') {
        // Recipient
        const recip = decodeStr();
        if (recip) result.recipients.push(recip);
      }
    }
  }

  return result;
}

// Fallback binary string scanner if non-standard or corrupt MSG file is provided
function fallbackParseBinaryFile(file: File, buffer: ArrayBuffer): ParsedEmailResult {
  const bytes = new Uint8Array(buffer);
  let asciiStr = '';
  // Scan chunks for printable characters
  for (let i = 0; i < Math.min(bytes.length, 100000); i++) {
    const b = bytes[i];
    if (b >= 32 && b <= 126) {
      asciiStr += String.fromCharCode(b);
    } else if (b === 10 || b === 13) {
      asciiStr += '\n';
    }
  }

  // Find emails and potential subject in binary strings
  const emails = asciiStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const senderEmail = emails[0] || 'unknown-sender@domain.com';
  const urls = asciiStr.match(/https?:\/\/[^\s<>"']+/g) || [];

  const fallbackBody = [
    `[Extracted binary content from ${file.name}]`,
    emails.length > 0 ? `Detected Email Addresses: ${Array.from(new Set(emails)).join(', ')}` : '',
    urls.length > 0 ? `Detected Links:\n${Array.from(new Set(urls)).join('\n')}` : '',
    '',
    asciiStr.substring(0, 1500)
  ]
    .filter(Boolean)
    .join('\n');

  return {
    fileName: file.name,
    fileSize: file.size,
    fileFormat: 'msg',
    subject: `Inspection of ${file.name}`,
    sender: senderEmail,
    senderEmail,
    senderName: '',
    replyTo: senderEmail,
    replyToEmail: senderEmail,
    to: '',
    date: new Date().toUTCString(),
    body: fallbackBody,
    rawHeaders: '',
    headers: {},
    attachments: [],
    authentication: { spf: 'NONE', dkim: 'NONE', dmarc: 'NONE' },
    hasReplyToMismatch: false,
    fullAssembledText: `From: ${senderEmail}\nSubject: Inspection of ${file.name}\n\n${fallbackBody}`
  };
}

// Parse Outlook .MSG File
export async function parseMsgFile(file: File): Promise<ParsedEmailResult> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const msgData = parseCfbMsg(arrayBuffer);

    // If transport headers exist, parse them
    let rawHeaders = msgData.headersStr || '';
    const headers: Record<string, string> = {};

    if (rawHeaders) {
      const headerLines = rawHeaders.replace(/\r\n/g, '\n').split('\n');
      for (const line of headerLines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
          const key = line.substring(0, colonIdx).trim().toLowerCase();
          const val = line.substring(colonIdx + 1).trim();
          headers[key] = decodeMimeHeaderWord(val);
        }
      }
    }

    const subject = msgData.subject || headers['subject'] || 'No Subject';
    const senderName = msgData.senderName || extractDisplayName(headers['from'] || '');
    const senderEmail =
      msgData.senderEmail || extractEmailAddress(headers['from'] || 'unknown@sender.com');
    const sender = senderName ? `"${senderName}" <${senderEmail}>` : senderEmail;

    const replyTo = headers['reply-to'] || msgData.replyTo || sender;
    const replyToEmail = extractEmailAddress(replyTo);
    const senderDomain = senderEmail.includes('@') ? senderEmail.split('@')[1] : '';
    const replyToDomain = replyToEmail.includes('@') ? replyToEmail.split('@')[1] : '';
    const hasReplyToMismatch =
      senderDomain !== '' && replyToDomain !== '' && senderDomain !== replyToDomain;

    // Body content: prefer body text, fallback to bodyHTML
    let bodyText = msgData.bodyText || '';
    if (!bodyText && msgData.bodyHtml) {
      bodyText = stripHtmlToText(msgData.bodyHtml);
    }

    const attachments = msgData.attachments || [];
    const toStr = msgData.recipients.join(', ') || headers['to'] || '';

    const fullAssembledText = [
      `From: ${sender}`,
      replyTo && replyTo !== sender ? `Reply-To: ${replyTo}` : '',
      toStr ? `To: ${toStr}` : '',
      `Subject: ${subject}`,
      '',
      bodyText.trim()
    ]
      .filter(Boolean)
      .join('\n');

    return {
      fileName: file.name,
      fileSize: file.size,
      fileFormat: 'msg',
      subject,
      sender,
      senderEmail,
      senderName,
      replyTo,
      replyToEmail,
      to: toStr,
      date: headers['date'] || new Date().toUTCString(),
      body: bodyText.trim(),
      rawHeaders,
      headers,
      attachments,
      authentication: {
        spf: 'NONE',
        dkim: 'NONE',
        dmarc: 'NONE'
      },
      hasReplyToMismatch,
      fullAssembledText
    };
  } catch (err) {
    console.warn('CFB MSG parsing fallback triggered:', err);
    return fallbackParseBinaryFile(file, arrayBuffer);
  }
}

// Master entry point for File objects (.eml, .msg, .txt)
export async function parseEmailFile(file: File): Promise<ParsedEmailResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'msg') {
    return await parseMsgFile(file);
  }

  // For .eml, .txt, or other files, read as text
  const textContent = await file.text();
  const format = extension === 'eml' ? 'eml' : 'txt';
  return parseEmlContent(textContent, file.name, file.size);
}
