import fs from 'fs';

const targetUrl = process.argv[2] || 'https://c6-steel.vercel.app/api/health';
const responseFile = process.argv[3] || 'response.json';
const httpStatus = process.argv[4] || '200';
const responseTime = process.argv[5] || '0ms';
const repoName = process.env.GITHUB_REPOSITORY || 'djc6-next';

let bodyText = '';
try {
  bodyText = fs.readFileSync(responseFile, 'utf8').trim();
} catch (e) {
  bodyText = 'No response body';
}

let isHealthy = httpStatus === '200';
let statusText = isHealthy ? 'Healthy' : 'Degraded';
let statusClass = isHealthy ? 'healthy' : 'degraded';
let statusEmoji = isHealthy ? '🟢' : '🔴';

// Try to parse the response to extract specific fields if it is JSON
let mpesaEnv = 'N/A';
try {
  const data = JSON.parse(bodyText);
  if (data.mpesaEnvironment) {
    mpesaEnv = data.mpesaEnvironment;
  }
} catch (e) {
  // Not valid JSON or missing field
}

// Pretty print the JSON if possible
try {
  const parsed = JSON.parse(bodyText);
  bodyText = JSON.stringify(parsed, null, 2);
} catch (e) {
  // Keep original
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Health Check Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f8;
      color: #1e293b;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .wrapper {
      background-color: #f4f6f8;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
      border: 1px solid #e2e8f0;
    }
    .header {
      margin-bottom: 28px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: #0f172a;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .status-healthy {
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .status-degraded {
      background-color: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .meta-card {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .meta-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .meta-list li {
      margin-bottom: 12px;
      font-size: 14px;
      color: #475569;
      display: flex;
      justify-content: space-between;
    }
    .meta-list li:last-child {
      margin-bottom: 0;
    }
    .meta-list strong {
      color: #0f172a;
      font-weight: 500;
    }
    .meta-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #334155;
    }
    .response-section h2 {
      font-size: 16px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 12px;
      color: #334155;
    }
    pre {
      background-color: #0f172a;
      border-radius: 10px;
      padding: 18px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      overflow-x: auto;
      margin: 0;
      color: #f8fafc;
      line-height: 1.5;
    }
    .footer {
      margin-top: 36px;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }
    .footer strong {
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Health Check Report</h1>
        <span class="status-badge status-${statusClass}">${statusEmoji} ${statusText}</span>
      </div>
      
      <div class="meta-card">
        <ul class="meta-list">
          <li><strong>Target URL</strong> <span class="meta-value">${targetUrl}</span></li>
          <li><strong>HTTP Status Code</strong> <span class="meta-value">${httpStatus}</span></li>
          <li><strong>Timestamp (UTC)</strong> <span class="meta-value">${new Date().toUTCString()}</span></li>
          <li><strong>M-Pesa Env</strong> <span class="meta-value">${mpesaEnv}</span></li>
          <li><strong>Response Time</strong> <span class="meta-value">${responseTime}</span></li>
        </ul>
      </div>

      <div class="response-section">
        <h2>JSON Response Payload</h2>
        <pre><code>${bodyText}</code></pre>
      </div>

      <div class="footer">
        This is an automated weekly report from your GitHub Actions workflow.<br>
        Repository: <strong>${repoName}</strong>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('report.html', html);
console.log('Successfully generated report.html');
