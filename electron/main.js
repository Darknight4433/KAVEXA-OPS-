const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Set a standard Chrome user agent so Google OAuth allows sign-in inside Electron
const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
app.userAgentFallback = CHROME_USER_AGENT;

let mainWindow = null;
let server = null;
const LOCAL_PORT = 5173;

// Lightweight zero-dependency static server so Electron always runs on http://localhost:5173 (Firebase authorized domain)
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
      console.log(`Port ${LOCAL_PORT} already in use (e.g. Vite dev server). Using existing server.`);
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

  mainWindow.webContents.setUserAgent(CHROME_USER_AGENT);

  if (targetUrl) {
    mainWindow.loadURL(targetUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../apps/web/dist/index.html'));
  }

  // Gracefully show window when content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle popups & auth windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow Firebase Authentication and Google OAuth popups within Electron
    if (
      url.includes('firebaseapp.com') ||
      url.includes('accounts.google.com') ||
      url.includes('google.com/o/oauth2') ||
      url.includes('googleapis.com')
    ) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 520,
          height: 680,
          autoHideMenuBar: true,
          backgroundColor: '#0A0A0A',
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        }
      };
    }

    // Open external links in user's default browser
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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
