const { ipcRenderer } = require('electron');

ipcRenderer.on('updater-data', (event, status) => {
    document.getElementById('status_text').innerHTML = status;
});

ipcRenderer.on('version', (event, version) => {
    document.getElementById('version_text').innerHTML = version;
});
