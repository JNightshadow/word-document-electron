const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('read-file', (event, filePath) => {
  const fileContent = fs.readFileSync(filePath);
  mammoth.convertToHtml({ buffer: fileContent })
    .then(result => {
      event.reply('read-file-reply', result.value);
    })
    .catch(error => {
      console.error(error);
      event.reply('read-file-reply', '');
    });
});
