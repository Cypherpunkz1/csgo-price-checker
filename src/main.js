const { default: axios } = require("axios");
const { ipcRenderer } = require("electron")
const fs = require('fs');

let bsKey, wpKey; // API keys
var steamPrice = document.getElementById('steam-price');
var waxPrice = document.getElementById('waxpeer-price');
var bitPrice = document.getElementById('bitskins-price');


// Search Button
document.getElementById('search-btn').addEventListener('click', () => {
    document.getElementById('center-container').classList.remove('center');
    document.getElementById('center-container').classList.add('result');
    document.getElementById('set-keys-btn').hidden = true;
    
    steamPrice.classList.add('prices-show'); // show prices with style applied
    waxPrice.classList.add('prices-show');
    bitPrice.classList.add('prices-show');
    keys = getApiKeys();
    bsKey = keys.bitskins;
    wpKey = keys.waxpeer;
    getSteamPrice('AK-47 | Redline (Field-Tested)');
});

function getSteamPrice(skin) {
    axios.get('https://steamcommunity.com/market/priceoverview/', {
        params: {
            "appid": "730",
            "currency": "1",
            "market_hash_name": skin
        }
    })
    .then(response => {
        console.log('Low: ', response.data.lowest_price);
        // results.appendChild(document.createTextNode('Steam Low: ' + response.data.lowest_price));
        // prices.appendChild(results);
        steamPrice.innerHTML = `Steam Low: ${response.data.lowest_price}`;
        waxPrice.innerHTML = `Waxpeer`;
        bitPrice.innerHTML = `Bitskins`;
    });
}

function getApiKeys() {
    keyFile = './assets/keys.json'
    let keys

    const data = fs.readFileSync(keyFile, 'utf8'); 
    keys = JSON.parse(data);
    return keys;
}

// API Button
document.getElementById('set-keys-btn').addEventListener('click', (event) => {
    ipcRenderer.send('open-api-window');
});

