import { SecurityTip, QuizQuestion } from '../types';

export const SECURITY_TIPS: SecurityTip[] = [
  {
    id: 'tip-1',
    icon: '🎣',
    title: "Don't Trust Urgency",
    summary: 'Attackers often create artificial panic to make you act without thinking.',
    advice: 'Phishing emails frequently demand immediate action—threatening account suspension, missed deadlines, or missed payments within 24 hours. Pause and take a breath before clicking anything.',
    example: '"URGENT: Your account will be closed in 24 hours if you do not verify now!"'
  },
  {
    id: 'tip-2',
    icon: '🔗',
    title: 'Check Links Carefully',
    summary: 'Always inspect where a link actually goes before clicking.',
    advice: 'On desktop, hover your mouse over the button or link to see the destination web address in your browser status bar. Look for misspellings like micros0ft.com or extra domains like paypal.billing-update.xyz.',
    example: 'Display text says "www.bank.com" but the actual target URL points to "www.bank-login-secure.online".'
  },
  {
    id: 'tip-3',
    icon: '🔐',
    title: 'Never Share Passwords',
    summary: 'Legitimate organizations will NEVER ask for your password via email or form.',
    advice: 'No IT department, bank, or cloud provider will ask you to reply with your password, security questions, or One-Time Passcode (OTP).',
    example: '"Reply with your current password and username to upgrade your inbox quota."'
  },
  {
    id: 'tip-4',
    icon: '📎',
    title: 'Be Careful With Attachments',
    summary: 'Unexpected executable or script files can silently compromise your device.',
    advice: 'Be wary of attachments ending in .exe, .scr, .iso, .vbs, .bat, or files with double extensions (e.g. invoice.pdf.exe). Even Word or Excel files asking to "Enable Macros" are high risk.',
    example: 'An unexpected invoice sent as "receipt_scan.zip" containing an executable file.'
  },
  {
    id: 'tip-5',
    icon: '🏢',
    title: 'Verify the Sender Directly',
    summary: 'If something looks suspicious, contact the sender through a trusted official channel.',
    advice: 'Never reply directly to the suspicious email or call phone numbers listed inside the message body. Instead, open a new browser tab, navigate directly to the company website, or call their known official support line.',
    example: 'Contacting your HR or IT department directly via Slack or company phone directory.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    emailSubject: 'Immediate Action: Password Expiring in 2 Hours',
    emailSender: 'IT Support Helpdesk <it-support@company-auth-portal.top>',
    emailBody: 'Your corporate email password will expire today at 5:00 PM. To keep your current password, click here: http://company-auth-portal.top/renew-session',
    isPhishing: true,
    explanation: 'This is phishing. Notice the non-standard domain (.top) and the artificial 2-hour urgency asking you to enter credentials on an external site.',
    clues: ['Artificial 2-hour urgency', 'Suspicious top-level domain (.top)', 'Request to renew password via unverified link']
  },
  {
    id: 2,
    emailSubject: 'Your Amazon order #114-8921820 has shipped',
    emailSender: 'Amazon.com <shipment-tracking@amazon.com>',
    emailBody: 'Hi Alex, your package is on its way. Track your package at https://www.amazon.com/gp/your-account/order-history or in the Amazon mobile app.',
    isPhishing: false,
    explanation: 'This is legitimate. The sender domain matches amazon.com exactly, links point to the official secure HTTPS domain, and there is no urgent pressure or credential request.',
    clues: ['Sender domain is verified amazon.com', 'Official HTTPS link', 'No urgent threats or credential demands']
  },
  {
    id: 3,
    emailSubject: 'Unpaid Invoice #90214 - Wire Transfer Overdue',
    emailSender: 'Vendor Accounts <billing@quickbooks-invoicing-center.xyz>',
    emailBody: 'Attached is the final overdue notice for Invoice #90214. Please open the attached Invoice_90214.pdf.exe and process wire payment immediately.',
    isPhishing: true,
    explanation: 'This is phishing and malicious software. The attachment has a dangerous double extension (.pdf.exe) intended to trick you into running an executable file.',
    clues: ['Dangerous double extension (.pdf.exe)', 'Urgent payment demand', 'Unknown third-party domain']
  }
];
