const { ipcRenderer } = require('electron');
const fs = require('fs');

document.getElementById('save-btn').addEventListener('click', () => {
    const wpKey = document.getElementById('waxpeer-key').value;
    const bsKey = document.getElementById('bitskins-key').value;
    var keys = {}
    keys['bitskins'] = bsKey;
    keys['waxpeer'] = wpKey;
    JSON.stringify(keys);
    fs.writeFile('./assets/data/keys.json', JSON.stringify(keys), (err) => {
        if (err) {
            dialog.showErrorBox('Error', 'Could not save keys: ' + err);
        }
        else {
            window.close();
        }
    });
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    window.close();
});

/* Show API Keys if already set */
ipcRenderer.on('fetch-api-keys', (event) => {
    let bsKey, wpKey;
    keyFile = './assets/data/keys.json'

    fs.readFile(keyFile, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        try {
            const keys = JSON.parse(data);
            bsKey = keys.bitskins;
            wpKey = keys.waxpeer;
        } catch (error) {
            console.log(error);
        }
        document.getElementById('waxpeer-key').value = wpKey;
        document.getElementById('bitskins-key').value = bsKey;
    });
});