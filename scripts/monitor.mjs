/**
 * Website Health & Error Rate Monitor
 * 
 * Usage: node scripts/monitor.mjs [URL]
 * Example: node scripts/monitor.mjs http://localhost:3000/api/health
 */

const TARGET_URL = process.argv[2] || 'http://localhost:3000/api/health';
const INTERVAL_MS = 5000; // Check every 5 seconds

let totalRequests = 0;
let failedRequests = 0;
let consecutiveFailures = 0;

console.log(`\n🚀 Starting Health Monitor...`);
console.log(`📍 Target: ${TARGET_URL}`);
console.log(`⏱️  Interval: ${INTERVAL_MS / 1000} seconds\n`);
console.log(`Press Ctrl+C to stop.\n`);

async function checkHealth() {
  totalRequests++;
  const startTime = Date.now();
  
  try {
    const response = await fetch(TARGET_URL);
    const data = await response.json().catch(() => ({}));
    const duration = Date.now() - startTime;
    
    if (response.ok && data.status === 'healthy') {
      consecutiveFailures = 0;
      logSuccess(duration, data);
    } else {
      failedRequests++;
      consecutiveFailures++;
      logError(duration, response.status, data.checks?.mpesa?.error || 'Endpoint returned unhealthy status');
    }
  } catch (error) {
    failedRequests++;
    consecutiveFailures++;
    logError(Date.now() - startTime, 'FAIL', error.message);
  }

  printStats();
}

function logSuccess(duration, data) {
  const timeStr = new Date().toLocaleTimeString();
  console.log(`[${timeStr}] ✅ OK (${duration}ms) | M-Pesa: ${data.mpesaEnvironment}`);
}

function logError(duration, status, message) {
  const timeStr = new Date().toLocaleTimeString();
  console.log(`[${timeStr}] ❌ ERROR (${status}) [${duration}ms]: ${message}`);
}

function printStats() {
  const errorRate = ((failedRequests / totalRequests) * 100).toFixed(2);
  process.stdout.write(`📊 Progress: ${totalRequests} checks | Error Rate: ${errorRate}% | Fails: ${failedRequests}\r`);
}

// Start loop
checkHealth();
setInterval(checkHealth, INTERVAL_MS);
