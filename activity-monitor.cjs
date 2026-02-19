#!/usr/bin/env node
/**
 * FinBox Activity Monitor
 * Real-time display of Claude Code's file changes and activity
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

const PORT = 3002;
const PROJECT_DIR = __dirname;
const WATCH_DIRS = ['src', 'docs', 'training-docs'];

// Activity log
const activities = [];
const MAX_ACTIVITIES = 50;

// File watchers
const watchers = new Map();

// Track file changes
function logActivity(type, file, details = '') {
  const timestamp = new Date().toLocaleTimeString();
  const activity = {
    timestamp,
    type,
    file,
    details,
    id: Date.now()
  };

  activities.unshift(activity);
  if (activities.length > MAX_ACTIVITIES) {
    activities.pop();
  }

  console.log(`[${timestamp}] ${type}: ${file} ${details}`);
  broadcastUpdate();
}

// Get git status
function getGitStatus(callback) {
  exec('git status --short', { cwd: PROJECT_DIR }, (err, stdout) => {
    if (err) {
      callback([]);
      return;
    }
    const files = stdout.trim().split('\n')
      .filter(line => line.trim())
      .map(line => {
        const status = line.substring(0, 2).trim();
        const file = line.substring(3);
        return { status, file };
      });
    callback(files);
  });
}

// Get file diff
function getFileDiff(file, callback) {
  exec(`git diff HEAD -- "${file}"`, { cwd: PROJECT_DIR }, (err, stdout) => {
    if (err || !stdout) {
      // Try unstaged diff
      exec(`git diff -- "${file}"`, { cwd: PROJECT_DIR }, (err2, stdout2) => {
        callback(stdout2 || '');
      });
      return;
    }
    callback(stdout);
  });
}

// Watch directories
function setupWatchers() {
  WATCH_DIRS.forEach(dir => {
    const dirPath = path.join(PROJECT_DIR, dir);
    if (!fs.existsSync(dirPath)) return;

    try {
      const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        // Filter out temp files and node_modules
        if (filename.includes('node_modules') ||
            filename.includes('.git') ||
            filename.startsWith('.')) return;

        const fullPath = path.join(dir, filename);

        if (eventType === 'change') {
          logActivity('MODIFIED', fullPath);
        } else if (eventType === 'rename') {
          // Check if file exists (created) or not (deleted)
          const exists = fs.existsSync(path.join(dirPath, filename));
          logActivity(exists ? 'CREATED' : 'DELETED', fullPath);
        }
      });

      watchers.set(dir, watcher);
      console.log(`✓ Watching ${dir}/`);
    } catch (err) {
      console.error(`✗ Failed to watch ${dir}:`, err.message);
    }
  });
}

// SSE connections
const sseClients = [];

function broadcastUpdate() {
  const data = JSON.stringify({
    activities: activities.slice(0, 20),
    timestamp: Date.now()
  });

  sseClients.forEach(client => {
    client.write(`data: ${data}\n\n`);
  });
}

// HTTP Server
const server = http.createServer((req, res) => {
  // SSE endpoint
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    sseClients.push(res);

    // Send initial data
    res.write(`data: ${JSON.stringify({ activities: activities.slice(0, 20) })}\n\n`);

    req.on('close', () => {
      const index = sseClients.indexOf(res);
      if (index !== -1) sseClients.splice(index, 1);
    });
    return;
  }

  // Git status API
  if (req.url === '/api/git-status') {
    getGitStatus(files => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ files }));
    });
    return;
  }

  // File diff API
  if (req.url.startsWith('/api/diff/')) {
    const file = decodeURIComponent(req.url.substring(10));
    getFileDiff(file, diff => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(diff);
    });
    return;
  }

  // Main dashboard HTML
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinBox Activity Monitor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
      background: #0a0a0a;
      color: #e0e0e0;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }
    h1 { font-size: 24px; margin-bottom: 5px; color: white; }
    .subtitle { opacity: 0.9; font-size: 14px; color: white; }
    .container { max-width: 1400px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .panel {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .panel h2 {
      font-size: 16px;
      margin-bottom: 15px;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    .activity-list {
      max-height: 600px;
      overflow-y: auto;
    }
    .activity-item {
      padding: 12px;
      margin-bottom: 8px;
      background: #252525;
      border-left: 3px solid #667eea;
      border-radius: 5px;
      font-size: 13px;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .activity-item.MODIFIED { border-left-color: #f59e0b; }
    .activity-item.CREATED { border-left-color: #10b981; }
    .activity-item.DELETED { border-left-color: #ef4444; }
    .timestamp {
      color: #888;
      font-size: 11px;
      margin-bottom: 4px;
    }
    .file-path {
      color: #667eea;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .type-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      margin-right: 6px;
    }
    .type-badge.MODIFIED { background: #f59e0b; color: #000; }
    .type-badge.CREATED { background: #10b981; color: #000; }
    .type-badge.DELETED { background: #ef4444; color: white; }
    .git-files {
      max-height: 600px;
      overflow-y: auto;
    }
    .git-file {
      padding: 10px;
      margin-bottom: 6px;
      background: #252525;
      border-radius: 5px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .git-file:hover {
      background: #2a2a2a;
      transform: translateX(2px);
    }
    .git-status {
      display: inline-block;
      width: 20px;
      font-weight: bold;
      margin-right: 10px;
    }
    .git-status.M { color: #f59e0b; }
    .git-status.A { color: #10b981; }
    .git-status.D { color: #ef4444; }
    .git-status.R { color: #667eea; }
    .status-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1a1a1a; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1><span class="status-indicator"></span>FinBox Activity Monitor</h1>
      <div class="subtitle">Real-time tracking of Claude Code's file changes</div>
    </div>

    <div class="grid">
      <div class="panel">
        <h2>Recent Activity</h2>
        <div class="activity-list" id="activities">
          <div class="empty-state">Waiting for file changes...</div>
        </div>
      </div>

      <div class="panel">
        <h2>Git Status</h2>
        <div class="git-files" id="git-status">
          <div class="empty-state">No changes detected</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Connect to SSE stream
    const eventSource = new EventSource('/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateActivities(data.activities);
    };

    function updateActivities(activities) {
      const container = document.getElementById('activities');

      if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="empty-state">Waiting for file changes...</div>';
        return;
      }

      container.innerHTML = activities.map(activity => \`
        <div class="activity-item \${activity.type}">
          <div class="timestamp">\${activity.timestamp}</div>
          <div>
            <span class="type-badge \${activity.type}">\${activity.type}</span>
            <span class="file-path">\${activity.file}</span>
          </div>
          \${activity.details ? \`<div style="color: #888; font-size: 11px; margin-top: 4px;">\${activity.details}</div>\` : ''}
        </div>
      \`).join('');
    }

    // Poll git status
    function updateGitStatus() {
      fetch('/api/git-status')
        .then(r => r.json())
        .then(data => {
          const container = document.getElementById('git-status');

          if (!data.files || data.files.length === 0) {
            container.innerHTML = '<div class="empty-state">No changes detected</div>';
            return;
          }

          container.innerHTML = data.files.map(file => \`
            <div class="git-file">
              <span class="git-status \${file.status}">\${file.status}</span>
              <span>\${file.file}</span>
            </div>
          \`).join('');
        });
    }

    // Update git status every 3 seconds
    setInterval(updateGitStatus, 3000);
    updateGitStatus();
  </script>
</body>
</html>`);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║        FinBox Activity Monitor Started!               ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Dashboard: http://localhost:${PORT}`);
  console.log('');
  console.log('Watching directories:');
  setupWatchers();
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');

  logActivity('MONITOR', 'Activity Monitor', 'Started');
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  watchers.forEach(watcher => watcher.close());
  server.close();
  process.exit(0);
});
