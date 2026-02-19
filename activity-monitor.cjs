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
      overflow: hidden;
      height: 100vh;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 12px 20px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h1 { font-size: 18px; color: white; margin: 0; }
    .subtitle { opacity: 0.9; font-size: 11px; color: white; }
    .view-toggle {
      display: flex;
      gap: 5px;
      background: rgba(0,0,0,0.2);
      padding: 4px;
      border-radius: 6px;
    }
    .view-btn {
      padding: 6px 14px;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .view-btn.active {
      background: rgba(255,255,255,0.25);
      font-weight: 600;
    }
    .view-btn:hover:not(.active) {
      background: rgba(255,255,255,0.1);
    }
    .container { height: calc(100vh - 54px); overflow: hidden; }
    .grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 0;
      height: 100%;
    }
    .grid.split-view {
      grid-template-columns: 300px 1fr 1fr;
    }
    .grid.preview-only {
      grid-template-columns: 1fr;
    }
    .panel {
      background: #1a1a1a;
      border-right: 1px solid #222;
      padding: 20px;
      overflow-y: auto;
      height: 100%;
    }
    .panel.preview-panel {
      padding: 0;
      background: #fff;
      border-right: none;
    }
    .panel h2 {
      font-size: 14px;
      margin-bottom: 15px;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 8px;
      position: sticky;
      top: 0;
      background: #1a1a1a;
      z-index: 10;
    }
    .activity-list {
      height: calc(50% - 40px);
      overflow-y: auto;
      margin-bottom: 20px;
    }
    .git-files {
      height: calc(50% - 40px);
      overflow-y: auto;
    }
    #preview-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    }
    .preview-header {
      background: #1a1a1a;
      padding: 10px 15px;
      border-bottom: 1px solid #333;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 11px;
    }
    .preview-url {
      flex: 1;
      background: #0a0a0a;
      border: 1px solid #333;
      padding: 6px 10px;
      border-radius: 4px;
      color: #888;
      font-family: monospace;
    }
    .refresh-btn {
      padding: 6px 12px;
      background: #667eea;
      border: none;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      transition: all 0.2s;
    }
    .refresh-btn:hover {
      background: #5568d3;
    }
    .auto-refresh-indicator {
      font-size: 10px;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .auto-refresh-indicator::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
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
  <div class="header">
    <div class="header-left">
      <h1><span class="status-indicator"></span>FinBox Activity Monitor</h1>
      <div class="subtitle">Live preview & real-time file tracking</div>
    </div>
    <div class="view-toggle">
      <button class="view-btn" onclick="setView('activity')">Activity</button>
      <button class="view-btn active" onclick="setView('split')">Split View</button>
      <button class="view-btn" onclick="setView('preview')">Preview Only</button>
    </div>
  </div>

  <div class="container">
    <div class="grid split-view" id="main-grid">
      <!-- Activity Panel -->
      <div class="panel" id="activity-panel">
        <h2>Recent Activity</h2>
        <div class="activity-list" id="activities">
          <div class="empty-state">Waiting for file changes...</div>
        </div>
        <h2>Git Status</h2>
        <div class="git-files" id="git-status">
          <div class="empty-state">No changes detected</div>
        </div>
      </div>

      <!-- Live Preview Panel -->
      <div class="panel preview-panel" id="preview-panel">
        <div class="preview-header">
          <div class="preview-url">http://localhost:8080</div>
          <button class="refresh-btn" onclick="refreshPreview()">↻ Refresh</button>
          <div class="auto-refresh-indicator">Auto-refresh ON</div>
        </div>
        <iframe id="preview-frame" src="http://localhost:8080"></iframe>
      </div>

      <!-- Split Preview Panel (for split view) -->
      <div class="panel preview-panel" id="split-preview" style="display: none;">
        <div class="preview-header">
          <div class="preview-url">http://localhost:8080</div>
          <button class="refresh-btn" onclick="refreshPreview()">↻ Refresh</button>
        </div>
        <iframe id="split-frame" src="http://localhost:8080"></iframe>
      </div>
    </div>
  </div>

  <script>
    let lastRefreshTime = Date.now();
    let currentView = 'split';

    // Connect to SSE stream
    const eventSource = new EventSource('/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateActivities(data.activities);

      // Auto-refresh preview if there are new file changes
      if (data.activities && data.activities.length > 0) {
        const latestChange = data.activities[0];
        // Debounce: only refresh if last refresh was more than 2 seconds ago
        if (Date.now() - lastRefreshTime > 2000) {
          refreshPreview();
          lastRefreshTime = Date.now();
        }
      }
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

    // Refresh preview iframe
    function refreshPreview() {
      const previewFrame = document.getElementById('preview-frame');
      const splitFrame = document.getElementById('split-frame');
      if (previewFrame) {
        previewFrame.src = previewFrame.src; // Force reload
      }
      if (splitFrame && splitFrame.style.display !== 'none') {
        splitFrame.src = splitFrame.src; // Force reload
      }
    }

    // View switching
    function setView(view) {
      currentView = view;
      const grid = document.getElementById('main-grid');
      const activityPanel = document.getElementById('activity-panel');
      const previewPanel = document.getElementById('preview-panel');
      const splitPreview = document.getElementById('split-preview');

      // Update active button
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      if (view === 'activity') {
        grid.className = 'grid';
        activityPanel.style.display = 'block';
        previewPanel.style.display = 'none';
        splitPreview.style.display = 'none';
      } else if (view === 'preview') {
        grid.className = 'grid preview-only';
        activityPanel.style.display = 'none';
        previewPanel.style.display = 'block';
        splitPreview.style.display = 'none';
      } else { // split
        grid.className = 'grid split-view';
        activityPanel.style.display = 'block';
        previewPanel.style.display = 'none';
        splitPreview.style.display = 'block';
      }
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
