# ⚡ Page Pulse - Automated Web Page & SEO Auditor

Page Pulse is a fast, full-stack web application that fetches target web pages, analyzes key SEO & technical structure metrics, and delivers instant actionable audit data.

Built for the **Digital Heroes Training Task**.

---

## 🔗 Live Links

- **Live Application**: [https://page-pulse-tan.vercel.app](https://page-pulse-tan.vercel.app)
- **Backend API**: [https://page-pulse-api-tath.onrender.com](https://page-pulse-api-tath.onrender.com)
- **Loom Demo Video**: [Watch 2-Minute Demo](https://loom.com) *(Update with your Loom link)*

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), CSS3, Lucide React
- **Backend**: Node.js, Express.js
- **Parsing & HTTP**: Cheerio, Axios
- **Automated Testing**: Jest, Supertest

---

## ✨ Features

- **Performance Tracking**: Measures server response latency ($ms$) and HTTP status codes.
- **SEO Extraction**: Pulls page `<title>`, `<meta name="description">`, and `<h1>` count.
- **Accessibility Checks**: Detects images missing required `alt` attributes.
- **Word Count Calculation**: Cleans non-content elements (`<script>`, `<style>`, `<nav>`, `<footer>`) to calculate body word counts.
- **Resilient Error Handling**: Safely handles 404s, invalid domains, non-HTML responses, and network timeouts without crashing the server.

---

## 📡 API Contract

### `POST /api/audit`

Audits a given web page URL and returns calculated metrics.

#### Request Body
```json
{
  "url": "[https://example.com](https://example.com)"
}

Success Response (200 OK)
JSON
{
  "url": "[https://example.com](https://example.com)",
  "status": 200,
  "responseTimeMs": 182,
  "title": "Example Domain",
  "metaDescription": "No description for the url",
  "h1Count": 1,
  "imagesMissingAlt": 0,
  "wordCount": 125
}

Error Response (400 Bad Request / 422 Unprocessable / 504 Timeout)
JSON
{
  "error": "Invalid url format"
}

🧠 Core Architectural Decisions
Cheerio Parsing over Headless Browsers:
Chosen over Puppeteer/Playwright to ensure low latency and minimal memory footprint on free-tier hosting services.

Upfront Domain Validation:
Enforced hostname structure checks to intercept invalid domains early and return immediate 400 Bad Request status codes without making external requests.

Strict 7-Second Timeout Cap:
Configured Axios with a 7000ms abort limit to prevent hanging target servers from blocking Node's event loop.

💻 Local Setup & Installation
1. Clone Repository
Bash
git clone [https://github.com/Hitesh1236/page-pulse](https://github.com/Hitesh1236/page-pulse)
cd page-pulse
2. Start Backend (server)
Bash
cd server
npm install
npm start
Runs on http://localhost:5000

3. Start Frontend (client)
Bash
cd ../client
npm install
npm run dev
Runs on http://localhost:5173

🧪 Automated Testing
To run the integration tests for the API:

Bash
cd server
npm test

Verified Test Cases:
Happy Path: Returns 200 OK and expected JSON schema for valid URLs.

Failure Case 1: Rejects malformed URL strings with a 400 Bad Request status.

Failure Case 2: Handles unreachable/non-existent domains gracefully.

📄 License & Attribution
Built for the Digital Heroes Training Task.

## 🤖 AI Usage Disclosure

This project was built using an interactive human-AI pair programming approach with Gemini.

- **AI Contributions**:
  - Suggested architectural decisions, project design patterns, and code syntax.
  - Wrote regex validation patterns for strict URL and domain checks.
  - Crafted unit test suites using Jest and Supertest.
  - Assisted with UI styling patterns and drafting README documentation.

- **Developer Contributions**:
  - Overall project vision, prompt engineering, and requirement planning.
  - Local environment setup, workspace configuration, and iterative debugging.
  - Running and verifying automated test executions against live edge cases.
  - Git version control workflow, repository management, and deployment orchestration across Render and Vercel.

Footer credit link included in frontend pointing to digitalheroesco.com.