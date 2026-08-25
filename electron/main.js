const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Set a standard Chrome user agent so Google OAuth allows sign-in inside Electron
const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
app.userAgentFallback = CHROME_USER_AGENT;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#080b11',
    title: 'KAVEXA OPS — Operations & Productivity System',
    icon: path.join(__dirname, '../apps/web/public/app-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allows local asset loading in packaged desktop app
    },
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.webContents.setUserAgent(CHROME_USER_AGENT);

  const prodFile = path.join(__dirname, '../apps/web/dist/index.html');

  // Load live server if running so desktop and browser share the exact same state
  mainWindow.loadURL('http://localhost:5173').catch(() => {
    if (fs.existsSync(prodFile)) {
      mainWindow.loadFile(prodFile);
    }
  });

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
          backgroundColor: '#0f172a',
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        }
      };
    }

    // Open other external links in user's default browser
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
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
