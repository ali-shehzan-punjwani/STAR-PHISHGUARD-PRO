# 🛡️ STAR PhishGuard Pro

## AI-Powered Phishing Detection & Email Security Assistant

A modern web-based security assistant designed to help users identify phishing emails, malicious URLs, suspicious email headers, and risky attachments before they become a security problem.

---

## 📖 Overview

Phishing is one of the most common cybersecurity threats, using deceptive emails, spoofed websites, malicious links, and dangerous attachments to trick users into revealing sensitive information or interacting with malicious content.

**STAR PhishGuard Pro** is a web-based phishing detection and email security assistant developed to make phishing analysis more accessible to both everyday users and cybersecurity learners.

The application analyzes suspicious emails, URLs, email headers, and attachments using a combination of **rule-based security checks, technical indicator extraction, model-based scoring, and AI-assisted analysis**.

Instead of simply returning a `Safe` or `Phishing` verdict, STAR PhishGuard Pro explains:

- What suspicious indicators were detected
- Why those indicators may represent a security risk
- How serious the detected risk is
- Which technical elements contributed to the verdict
- What actions the user should take
- What actions the user should avoid

The project demonstrates how modern web technologies, cybersecurity techniques, machine learning, and AI-assisted analysis can be combined into a single practical phishing-analysis platform.

---

## 🎯 Project Objectives

The main objectives of STAR PhishGuard Pro are to:

- Make phishing analysis easier for non-technical users
- Identify common phishing indicators across multiple input types
- Provide understandable explanations alongside technical findings
- Combine automated security rules with AI-assisted analysis
- Provide risk scoring and confidence information
- Allow users to review previous security analyses
- Improve cybersecurity and phishing awareness
- Demonstrate practical application of cybersecurity concepts
- Explore the use of AI and machine learning in phishing detection

---

## 🔍 What Can STAR PhishGuard Pro Analyze?

STAR PhishGuard Pro provides multiple security analysis modules for different types of potentially suspicious content.

### 📧 Email Analysis

Users can paste or upload suspicious email content for analysis.

The analyzer can inspect:

- Email content
- Sender information
- Reply-To information
- Suspicious keywords
- Urgency and social-engineering indicators
- Embedded URLs
- Suspicious formatting
- Potential impersonation indicators
- Email metadata
- Common phishing patterns

### 🔗 URL Analysis

The URL scanner examines links for common indicators associated with phishing and malicious websites.

It can identify indicators such as:

- Lookalike domains
- Suspicious domain structures
- IP-address-based URLs
- Insecure HTTP connections
- Suspicious subdomains
- URL obfuscation
- Unusual URL parameters
- Potential redirects
- Suspicious domain characteristics
- Blacklist-related indicators

### 📋 Email Header Analysis

Email headers contain important information about how an email was sent and authenticated.

STAR PhishGuard Pro can analyze authentication-related information including:

- SPF
- DKIM
- DMARC
- Sender domain
- Return-Path
- Reply-To
- Authentication results
- Sender/header mismatches
- Suspicious header relationships

This module helps users understand technical email-authentication information without requiring them to manually interpret complex header data.

### 📎 Attachment Analysis

Attachments are commonly used as delivery mechanisms for malware and phishing payloads.

The attachment analyzer can identify potentially risky characteristics such as:

- Executable file types
- Macro-enabled documents
- Double file extensions
- Archive files
- Suspicious file naming
- Potentially dangerous document types
- Abnormal file characteristics

---

## ✨ Key Features

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Provides an overview of scan statistics, risk information, and recent activity |
| 📧 **Analyze Email** | Analyze pasted or uploaded email content for phishing indicators |
| 🔗 **URL Scanner** | Examine URLs for suspicious domains, protocols, redirects, and other risk indicators |
| 📋 **Email Header Analyzer** | Analyze SPF, DKIM, DMARC, sender information, and header mismatches |
| 📎 **Attachment Check** | Detect potentially risky file types, macros, double extensions, and suspicious characteristics |
| 📊 **Model Performance** | Display detection confidence and model-related analysis information |
| 🕘 **History** | Review previously performed security scans |
| 📄 **Reports** | View detailed reports containing verdicts, findings, risk scores, and recommendations |
| 💡 **Security Tips** | Provide practical cybersecurity awareness and phishing-prevention guidance |
| ⚙️ **Settings** | Configure detection sensitivity and manage trusted domains |
| 🛡️ **Risk Scoring** | Convert detected indicators into an understandable risk score and risk level |
| 🤖 **AI-Assisted Analysis** | Use the Gemini API to provide additional contextual analysis and explanations |

---

## 🧠 How It Works

STAR PhishGuard Pro uses a layered approach instead of relying on a single detection mechanism.

### 1. Input

The user provides one of the supported security inputs:

- Email
- URL
- Email header
- Attachment

### 2. Indicator Extraction

The application extracts relevant technical and contextual indicators.

Examples include:

- URLs
- Domains
- Keywords
- Header fields
- Authentication results
- File extensions
- Suspicious patterns
- Structural anomalies

### 3. Rule-Based Analysis

Security rules are applied to identify known suspicious patterns.

Examples include:

- Suspicious domain structures
- Failed authentication checks
- Dangerous attachment extensions
- Mismatched sender information
- Suspicious URL patterns
- Phishing-related keywords

### 4. Model-Based Analysis

Where applicable, model-based confidence information can contribute to the overall analysis.

The project can incorporate detection approaches such as:

- Logistic Regression
- Multi-Layer Perceptron (MLP)
- Ensemble-style scoring

### 5. AI-Assisted Analysis

The Gemini API can provide contextual analysis of suspicious content and help explain security findings in natural language.

### 6. Risk Assessment

The collected indicators are combined to generate:

- Risk score
- Risk level
- Detection verdict
- Security findings
- Recommended actions

Example risk levels include:

- `LOW`
- `MEDIUM`
- `HIGH`

### 7. User-Friendly Explanation

Instead of presenting only technical indicators, the platform explains the findings in understandable language.

For example:

> A suspicious sender-domain mismatch was detected. The displayed sender appears different from the domain associated with the email infrastructure.

This approach helps users understand **why** an email, URL, or attachment may be risky.

### 8. History

Previous analyses can be stored locally in the browser so users can revisit their results and monitor their previous scans.

---

## 🏗️ Application Architecture

The application follows a modular frontend architecture:

```text
User Input
    │
    ├── Email
    ├── URL
    ├── Email Header
    └── Attachment
          │
          ▼
   Input Processing
          │
          ▼
   Indicator Extraction
          │
          ▼
   Security Analysis
     ┌────┴────┐
     │         │
     ▼         ▼
Rule-Based   Model-Based
Analysis     Analysis
     │         │
     └────┬────┘
          ▼
    AI-Assisted Analysis
          │
          ▼
     Risk Assessment
          │
          ▼
    Verdict + Explanation
          │
          ▼
   Report & Local History
```

---

## 🛠️ Technology Stack

### Frontend

- **React 19** — Component-based user interface
- **TypeScript** — Type-safe application development
- **Vite 6** — Development server and build tooling
- **Tailwind CSS 4** — Responsive and modern styling

### AI & Security Analysis

- **Google Gemini API** — AI-assisted security analysis
- **Rule-Based Heuristics** — Detection of known suspicious patterns
- **Logistic Regression** — Phishing classification support
- **Multi-Layer Perceptron (MLP)** — Machine-learning-based analysis
- **Ensemble Scoring** — Combining multiple detection signals

### UI & User Experience

- **Lucide React** — Interface icons
- **Motion** — UI animations and transitions

### Storage

- **Browser Local Storage** — Local scan history, statistics, and application settings

---

## 📋 Prerequisites

Before running STAR PhishGuard Pro, make sure the following are installed:

- **Node.js** v18 or later
- **Visual Studio Code**
- **Git**
- A **Gemini API key**

You can obtain a Gemini API key through:

https://aistudio.google.com/app/apikey

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/star-phishguard-pro.git
cd star-phishguard-pro
```

### 2. Open the Project in VS Code

```bash
code .
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

If the project contains an example environment file:

```bash
cp .env.example .env.local
```

Then add your Gemini API key:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

> **Important:** Never commit `.env.local` or expose your Gemini API key publicly.

### 5. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

> The exact development URL may vary depending on the Vite configuration.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the optimized production application |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the project's TypeScript/lint validation |
| `npm run clean` | Remove generated build output |

---

## 📁 Project Structure

```text
star-phishguard-pro/
│
├── assets/
│   └── # Static assets and project resources
│
├── src/
│   │
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── AnalyzeEmail.tsx
│   │   ├── UrlScanner.tsx
│   │   ├── HeaderAnalyzer.tsx
│   │   ├── AttachmentCheck.tsx
│   │   ├── ModelPerformance.tsx
│   │   ├── HistoryView.tsx
│   │   ├── ReportsView.tsx
│   │   ├── SecurityTips.tsx
│   │   ├── SettingsView.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── TechnicalAccordion.tsx
│   │   └── ProgressiveResultView.tsx
│   │
│   ├── utils/
│   │   ├── analyzer.ts
│   │   ├── urlAnalyzer.ts
│   │   ├── headerAnalyzer.ts
│   │   ├── attachmentAnalyzer.ts
│   │   ├── emailFileParser.ts
│   │   └── storage.ts
│   │
│   ├── data/
│   │   └── # Static and sample data
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔐 Privacy & Security

Privacy is an important part of STAR PhishGuard Pro's design.

### Local Storage

Scan history, statistics, and application settings are stored locally in the user's browser.

The application does not require an external database for these features.

### API Processing

When AI-assisted analysis is enabled, relevant content may be sent to the configured Gemini API for processing.

Users should avoid submitting highly sensitive, confidential, or personally identifiable information unless they understand the data-handling implications of the configured AI service.

### API Key Protection

Never expose your Gemini API key in:

- GitHub repositories
- Public source code
- Screenshots
- Public configuration files
- `.env.local` files committed to Git

Make sure `.gitignore` contains your local environment files.

---

## 🎓 Use Cases

### 👤 Individual Users

Users can analyze suspicious emails and links before clicking them or interacting with unexpected attachments.

### 🎓 Students

Cybersecurity students can use the platform to study:

- Phishing techniques
- Email authentication
- URL analysis
- Social engineering
- Security indicators
- AI-assisted cybersecurity analysis

### 🔬 Researchers

The project provides a practical environment for exploring phishing detection, machine learning, and AI-assisted security analysis.

### 🏢 Small Teams

Small organizations and teams can use the application as a lightweight educational phishing-analysis tool without requiring a large enterprise security platform.

### 👨‍🏫 Cybersecurity Education

Educators can use the application to demonstrate phishing indicators and teach users how to recognize suspicious communications.

---

## 📊 Example Analysis Output

A typical analysis can provide information such as:

```text
Verdict: Potential Phishing

Risk Level: HIGH

Risk Score: 87 / 100

Detected Indicators:
- Suspicious sender domain
- Urgency-based language
- Mismatched Reply-To address
- Suspicious URL
- Failed email authentication indicator

Recommendation:
Do not click the provided links or open unexpected attachments.
Verify the sender through an independent communication channel.
```

The exact output depends on the submitted content and the analysis performed by the application.

---

## 🛡️ Security Awareness

STAR PhishGuard Pro is designed not only to detect suspicious content but also to improve cybersecurity awareness.

The platform encourages users to:

- Verify unexpected requests
- Inspect sender domains carefully
- Avoid clicking suspicious links
- Be cautious with unexpected attachments
- Check email authentication results where available
- Avoid entering credentials through unsolicited links
- Verify financial or sensitive requests independently
- Report suspected phishing attempts to the appropriate security team

---

## 🗺️ Future Enhancements

Potential future improvements include:

- 🌐 Browser extension for Gmail and Outlook
- 📡 Real-time threat intelligence integration
- 🔎 Domain reputation and URL reputation APIs
- 🌍 Multi-language phishing analysis
- 📄 PDF report generation
- 📧 Direct email-client integration
- 🧠 Advanced machine-learning models
- 🧪 Larger phishing and legitimate-email datasets
- 📈 Advanced analytics and risk trends
- 🔐 Additional email-authentication analysis
- ☁️ Optional secure backend deployment
- 👥 Multi-user organizational support

---

## ⚠️ Disclaimer

STAR PhishGuard Pro is intended for **educational, research, and security-awareness purposes**.

A phishing detection result should not be treated as an absolute guarantee that an email, URL, or attachment is safe or malicious.

Security analysis can produce false positives and false negatives. Users should apply appropriate security practices and verify suspicious communications through trusted channels.

---

## 👤 Author

### Ali Shehzan Punjwani

**BS Computer Science — Iqra University**

**Cybersecurity | Cloud Security | AI Security**

📍 Karachi, Pakistan

📧 **shehzansohail5637@gmail.com**

🔗 **LinkedIn:**  
https://www.linkedin.com/in/ali-shehzan-punjwani/

---

## 🏢 Project

### STAR Technologies

**Transforming Vision into Intelligent Solutions**

STAR PhishGuard Pro is part of the cybersecurity and AI-focused project development work of **STAR Technologies**, exploring practical applications of artificial intelligence, cybersecurity, and secure digital solutions.

---

## 📄 License

This project is developed for **educational and research purposes**.

© 2026 **Ali Shehzan Punjwani**. All Rights Reserved.
