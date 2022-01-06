const { ipcRenderer, remote } = require('electron');
const { dialog } = require('electron').remote;
const fs = require('fs');

/* Save API keys*/
document.getElementById('save-btn').addEventListener('click', () => {
    const wpKey = document.getElementById('waxpeer-key').value;
    const bsKey = document.getElementById('bitskins-key').value;
    var keys = {}
    keys['bitskins'] = bsKey;
    keys['waxpeer'] = wpKey;
    JSON.stringify(keys);
    fs.writeFile('./assets/keys.json', JSON.stringify(keys), (err) => {
        if (err) {
            dialog.showErrorBox('Error', 'Could not save keys: ' + err);
        }
        else {
            window.close();
        }
    });
});

/* Cancel */
document.getElementById('cancel-btn').addEventListener('click', (event) => {
    window.close();
});

/* Show password */
document.getElementById('view-btn').addEventListener('click', (event) => {
    if (document.getElementById('bitskins-key').type === 'password') {
        document.getElementById('bitskins-key').type = 'text';
        document.getElementById('waxpeer-key').type = 'text';
        document.getElementById('view-btn').innerHTML = 'Hide';
    }
    else {
        document.getElementById('bitskins-key').type = 'password';
        document.getElementById('waxpeer-key').type = 'password';
        document.getElementById('view-btn').innerHTML = 'Show';
    }
});

/* Show API Keys if already set */
ipcRenderer.on('fetch-api-keys', (event) => {
    let bsKey, wpKey;
    keyFile = './assets/keys.json'

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
