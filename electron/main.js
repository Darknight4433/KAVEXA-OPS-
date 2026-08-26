const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow = null;
let server = null;
const LOCAL_PORT = 5173;

// Lightweight zero-dependency static server & auth bridge
function startLocalServer(callback) {
  const distDir = path.join(__dirname, '../apps/web/dist');

  const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.apk': 'application/vnd.android.package-archive'
  };

  server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    // Handle desktop auth callback from external browser
    if (req.method === 'POST' && req.url === '/api/desktop-auth-callback') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const userData = JSON.parse(body);
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('auth-user-synced', userData);
            mainWindow.show();
            mainWindow.focus();
          }
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(400);
          res.end('Invalid JSON payload');
        }
      });
      return;
    }

    const rawPath = req.url.split('?')[0];
    let filePath = path.join(distDir, rawPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading application asset');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${LOCAL_PORT} already in use. Using active server.`);
      callback(`http://localhost:${LOCAL_PORT}`);
    } else {
      console.error('Server error:', err);
      callback(null);
    }
  });

  server.listen(LOCAL_PORT, '127.0.0.1', () => {
    console.log(`KAVEXA Desktop server running on http://127.0.0.1:${LOCAL_PORT}`);
    callback(`http://localhost:${LOCAL_PORT}`);
  });
}

function createWindow(targetUrl) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#050505',
    title: 'KAVEXA OPS — Operations & Productivity System',
    icon: path.join(__dirname, '../apps/web/public/app-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    autoHideMenuBar: true,
    show: false
  });

  if (targetUrl) {
    mainWindow.loadURL(targetUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../apps/web/dist/index.html'));
  }

  // Gracefully show window when content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('open-external-browser', (event, url) => {
  const targetUrl = url || `http://localhost:${LOCAL_PORT}/?desktop_auth=1`;
  shell.openExternal(targetUrl);
});

app.whenReady().then(() => {
  startLocalServer((url) => {
    createWindow(url);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(`http://localhost:${LOCAL_PORT}`);
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    try { server.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
