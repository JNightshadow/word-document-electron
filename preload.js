const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath, callback) => {
    ipcRenderer.send('read-file', filePath);
    ipcRenderer.once('read-file-reply', (event, fileContent) => {
      callback(fileContent);
    });
  },
});
