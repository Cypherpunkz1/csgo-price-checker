/**
 * Electron related code
 */
const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell, Menu } = electron;
const { autoUpdater } = require("electron-updater");


let mainWindow, data, updateWindow, apiWindow;
const version = `v${app.getVersion()}`;
console.log(`Starting ${version}`);

/* Menus */
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Set API Keys',
                click: () => {
                    createAPIWindow();
                }
            },
            { type: 'separator' },
            {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+Q',
                role: 'quit'
            }
        ],
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                role: 'reload'

            },
            { type: 'separator' },
            {
                label: 'Actual Size',
                accelerator: 'CmdOrCtrl+0',
                role: 'resetZoom'
            },
            {
                label: 'Zoom In',
                accelerator: 'CmdOrCtrl+=',
                role: 'zoomIn'
            },
            {
                label: 'Zoom Out',
                accelerator: 'CmdOrCtrl+-',
                role: 'zoomOut'
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
        ]
    }, {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: () => {
                    shell.openExternal('https://github.com/wrrnlim/electron-app-template')
                }
            },
            {
                label: 'Report an Issue',
                click: () => {
                    shell.openExternal('https://github.com/wrrnlim/electron-app-template/new/choose')
                }
            },
            {
                label: 'Open Developer Tools',
                accelerator: 'CmdOrCtrl+Shift+I',
                role: 'toggleDevTools'
            },
            { type: 'separator' },
            {
                label: 'App Version: ' + version,
                enabled: false
            },
            {
                label: 'Check for Updates',
                click: () => {
                    createUpdateWindow();
                    autoUpdater.checkForUpdatesAndNotify();
                }
            },
        ]
    }
]

/**
 * Create main window - Event based programming syntax 
 */
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'CS:GO Price Checker',
        width: 900,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: './assets/img/icon.png'
    });

    /* Open links in external browser */
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    /* Load main.html */
    mainWindow.loadFile('src/main.html');

    /* Menus */
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

/**
 * Create the update window
 */
function createUpdateWindow() {
    updateWindow = new BrowserWindow({
        width: 400,
        height: 210,
        title: 'Updater',
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: './assets/img/icon.png'
    });
    updateWindow.setMenu(null); 
    updateWindow.loadFile('src/update.html');
    /* Wait for contents to load then set status */
    updateWindow.webContents.on('did-finish-load', () => {
        updateWindow.webContents.send('version', version);
    });
}

/**
 * Create the API window
 */
 function createAPIWindow() {
    if (!apiWindow) { // prevents multiple windows
        apiWindow = new BrowserWindow({
            width: 500,
            height: 425,
            title: 'Set API Keys',
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
            icon: './assets/img/icon.png'
        });
        apiWindow.setMenu(null);
        apiWindow.loadFile('src/keys.html');
        apiWindow.webContents.on('did-finish-load', () => {
            apiWindow.webContents.send('fetch-api-keys');
        });
        apiWindow.webContents.setWindowOpenHandler(({ url }) => { // open links in external browser
            shell.openExternal(url);
            return { action: 'deny' };
        });
    }
    else {
        apiWindow.focus();
    }
    apiWindow.on('closed', () => {
        apiWindow = null;
    });
}

/**
 * Show status on update window
 */
function showStatus(status) {
    updateWindow.webContents.send('updater-data', status);
}

/**
 * Auto updater
 */
autoUpdater.on('checking-for-update', () => {
    showStatus('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    showStatus('Update found! Installation will begin shortly.');
})
autoUpdater.on('update-not-available', (info) => {
    showStatus('You have the newest version!');
})
autoUpdater.on('error', (err) => {
    showStatus('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    showStatus('Downloading: ' + progressObj.percent.toFixed(2) + '%');
})
autoUpdater.on('update-downloaded', (info) => {
    showStatus('Update downloaded. Restart the app to apply update.');
});

/**
 * IPC Listeners
 */
ipcMain.on('open-api-window', (event) => {
    createAPIWindow();
});
