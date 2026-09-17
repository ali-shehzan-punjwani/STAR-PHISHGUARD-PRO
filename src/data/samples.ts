export interface SampleEmail {
  id: string;
  title: string;
  category: 'phishing' | 'suspicious' | 'legitimate';
  sender: string;
  subject: string;
  content: string;
}

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: 'sample-1',
    title: 'Microsoft 365 Account Suspension (High Risk)',
    category: 'phishing',
    sender: 'security-alert@micros0ft-support-center.com',
    subject: 'URGENT: Your Office 365 Account Will Be Terminated in 24 Hours',
    content: `From: Microsoft Security Team <security-alert@micros0ft-support-center.com>
To: user@company.com
Subject: URGENT: Your Office 365 Account Will Be Terminated in 24 Hours

Dear User,

We noticed unusual sign-in activity from an unrecognized IP address (192.168.1.44) in Moscow, Russia.

For your immediate security, your Microsoft 365 access has been temporarily restricted. To prevent permanent termination of your mailbox and cloud files, you must verify your credentials immediately.

Please click the secure link below within 24 hours:
https://account-verify-login-portal.micros0ft-update.xyz/auth?user=employee

Enter your current password and two-factor code to restore full access. Failure to comply will result in automatic deletion of all saved emails and OneDrive documents.

Thank you,
Microsoft Account Security Team
Case ID: MS-9948271`
  },
  {
    id: 'sample-2',
    title: 'Payroll Direct Deposit Update (High Risk)',
    category: 'phishing',
    sender: 'hr-payroll@int-workday-portal.net',
    subject: 'ACTION REQUIRED: Verify your direct deposit banking details for Friday payroll',
    content: `From: Workday HR Portal <hr-payroll@int-workday-portal.net>
To: employee@organization.com
Subject: ACTION REQUIRED: Verify your direct deposit banking details for Friday payroll

Hello,

Due to a recent banking system migration, all payroll direct deposit accounts must be re-verified before the upcoming payroll cutoff today at 5:00 PM EST.

If you do not update your routing and account numbers, your upcoming salary payment will be delayed by up to 14 business days.

Update your banking details now:
http://portal-workday-benefits-auth.online/login/payroll-sync

Do not reply directly to this automated email.

Regards,
Human Resources & Payroll Department`
  },
  {
    id: 'sample-3',
    title: 'PayPal Suspicious Invoice (Medium Risk)',
    category: 'suspicious',
    sender: 'service@billing-paypal-notice.info',
    subject: 'You sent a payment of $749.00 USD to CryptoHub Ltd.',
    content: `From: PayPal Billing Service <service@billing-paypal-notice.info>
To: customer@gmail.com
Subject: You sent a payment of $749.00 USD to CryptoHub Ltd.

Hello Customer,

You sent a payment of $749.00 USD to CryptoHub Global LLC.
Transaction ID: PP-847291048

If you did not authorize this charge, our fraud team is standing by to assist you. Call our immediate cancellation hotline immediately:
Toll-Free: +1-800-555-0199

Alternatively, dispute this charge and reverse payment through our online resolution center:
http://paypal-resolution-center.secure-billing-hub.biz/dispute

Thank you for using PayPal.`
  },
  {
    id: 'sample-4',
    title: 'Google Calendar Meeting Invite (Safe / Low Risk)',
    category: 'legitimate',
    sender: 'calendar-notification@google.com',
    subject: 'Invitation: Q4 Product Planning Review @ Thu Aug 28, 2026 2pm - 3pm',
    content: `From: Google Calendar <calendar-notification@google.com>
To: alex@company.com
Subject: Invitation: Q4 Product Planning Review @ Thu Aug 28, 2026 2pm - 3pm

You have been invited to the following event:

Q4 Product Planning Review
When: Thursday, Aug 28, 2026, 2:00 PM – 3:00 PM (EDT)
Where: Google Meet (meet.google.com/abc-defg-hij)
Organizer: sarah.miller@company.com

Agenda:
1. Review roadmap deliverables
2. Budget allocation for next quarter
3. Open Q&A

Going? Yes - Maybe - No
View your calendar: https://calendar.google.com/calendar/r`
  }
];

export const SAMPLE_URLS = [
  {
    label: 'High Risk Phishing Portal',
    url: 'http://micros0ft-login-verify.account-security-alert.xyz/update-auth.php',
    expected: 'HIGH'
  },
  {
    label: 'Credential Harvester Link',
    url: 'https://paypal-resolution-center.secure-billing-hub.biz/dispute/login',
    expected: 'HIGH'
  },
  {
    label: 'Suspicious IP with Token',
    url: 'http://185.220.101.44/webmail/session-redirect?token=92847192',
    expected: 'HIGH'
  },
  {
    label: 'Legitimate Official Domain',
    url: 'https://support.microsoft.com/en-us/account-billing',
    expected: 'LOW'
  }
];

export const SAMPLE_HEADERS = [
  {
    label: 'Spoofed CEO / Display Name Mismatch',
    content: `From: "Tim Cook, CEO" <tcook@apple.com>
Reply-To: executive-wire-transfers@tempmail-service.net
Return-Path: <bounce@tempmail-service.net>
Subject: Urgent Confidential Request - Wire Transfer Needed Today
Date: Thu, 28 Aug 2026 09:14:22 +0000
Received: from mail-relay.untrusted-host.ru (194.58.112.5)
Authentication-Results: spf=fail (sender IP is 194.58.112.5) smtp.mailfrom=apple.com; dkim=fail header.d=apple.com; dmarc=fail (p=reject) header.from=apple.com`
  },
  {
    label: 'Legitimate Authenticated Email',
    content: `From: "GitHub" <noreply@github.com>
Reply-To: noreply@github.com
Return-Path: <noreply@github.com>
Subject: [GitHub] A new public key was added to your account
Date: Wed, 27 Aug 2026 14:02:11 +0000
Received: from out-21.smtp.github.com (192.30.252.209)
Authentication-Results: spf=pass (sender IP is 192.30.252.209) smtp.mailfrom=github.com; dkim=pass header.d=github.com; dmarc=pass (p=reject) header.from=github.com`
  }
];

export const SAMPLE_ATTACHMENTS = [
  {
    name: 'Invoice_August_2026_Overdue.pdf.exe',
    size: '1.4 MB',
    type: 'application/x-msdownload',
    risk: 'HIGH',
    note: 'Double extension with hidden executable payload'
  },
  {
    name: 'Payroll_Direct_Deposit_Form.xlsm',
    size: '420 KB',
    type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    risk: 'HIGH',
    note: 'Macro-enabled Excel workbook with automated VBA execution triggers'
  },
  {
    name: 'Meeting_Notes_Quarterly_Strategy.pdf',
    size: '850 KB',
    type: 'application/pdf',
    risk: 'LOW',
    note: 'Standard text PDF document without embedded active script objects'
  }
];

export const SAMPLE_EML_DATA = {
  fileName: 'suspicious_urgent_security_alert.eml',
  content: `From: "Microsoft 365 Cloud Security" <security-alert@micros0ft-support-center.com>
Reply-To: credential-harvest@hacker-inbox.xyz
To: alex.turner@enterprise-corp.com
Subject: URGENT: Office 365 Account Will Be Terminated in 24 Hours
Date: Thu, 17 Sep 2026 08:14:22 +0000
Message-ID: <alert-9948271@micros0ft-support-center.com>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="----=_Part_849204_9281729.1726560862"
Authentication-Results: spf=fail (sender IP 194.58.112.5 is not authorized); dkim=fail; dmarc=fail

------=_Part_849204_9281729.1726560862
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: quoted-printable

Dear Alex,

We noticed unusual sign-in activity from an unrecognized IP address (192.168=
.1.44) in Moscow, Russia.

For your immediate security, your Microsoft 365 access has been temporaril=
y restricted. To prevent permanent termination of your mailbox and cloud fil=
es, you must verify your credentials within 24 hours.

Please click the secure verification link below immediately:
https://account-verify-login-portal.micros0ft-update.xyz/auth?user=3Demployee

Enter your current password and two-factor passcode to restore full access.=
 Failure to comply will result in automatic deletion of all saved emails and=
 OneDrive documents.

Thank you,
Microsoft Account Security Team
Case ID: MS-9948271

------=_Part_849204_9281729.1726560862
Content-Type: application/octet-stream; name="Urgent_Security_Fix.scr"
Content-Disposition: attachment; filename="Urgent_Security_Fix.scr"
Content-Transfer-Encoding: base64

TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAA2AAAAA4fug4AtAnNIbgBTM0hVGhpcyBwcm9ncmFtIGNhbm5vdCBiZSBydW4gaW4gRE9TIG1v
ZGUuDQ0KJAAAAAAAAABQRQAATAEDAAAAAAAAAAAAAAAAAAAAAAAA
------=_Part_849204_9281729.1726560862--`
};

