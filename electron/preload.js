const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  getVersion: () => process.env.npm_package_version || '1.0.0',
  openExternalBrowser: (url) => ipcRenderer.send('open-external-browser', url),
  onAuthSuccess: (callback) => {
    const listener = (event, user) => callback(user);
    ipcRenderer.on('auth-user-synced', listener);
    return () => ipcRenderer.removeListener('auth-user-synced', listener);
  }
});
