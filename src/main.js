const { default: axios } = require("axios");
const { ipcRenderer } = require("electron")
const fs = require('fs');
const totp = require('notp').totp;
const base32 = require('thirty-two');

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
    steamPrice.innerHTML = 'Steam Low: Loading...';
    bitPrice.classList.add('prices-show');
    bitPrice.innerHTML = 'BitSkins Low: Loading...';
    waxPrice.classList.add('prices-show');
    waxPrice.innerHTML = 'Waxpeer Low: Loading...';
    keys = getApiKeys();
    bsKey = keys.bitskins;
    wpKey = keys.waxpeer;
    bsTOTP = keys.bsSecret;
    getPrices('AK-47 | Redline (Field-Tested)');
});

function getPrices(skin) {
    // Steam
    axios.get('https://steamcommunity.com/market/priceoverview/', {
        params: {
            "appid": "730",
            "currency": "1",
            "market_hash_name": skin
        }
    })
    .then(response => {
        steamPrice.innerHTML = `Steam Low: ${response.data.lowest_price}`;
    });

    // Bistkins
    token = totp.gen(base32.decode(bsTOTP))
    axios.get('https://bitskins.com/api/v1/get_inventory_on_sale/', {
        params: {
            "api_key": bsKey,
            "code": token,
            "sort_by": "price",
            "order": "asc",
            "show_trade_delayed_items": 1,
            "market_hash_name": skin
        }
    })
    .then(response => {
        bitPrice.innerHTML = `Bitskins: $${response.data.data.items[0].price}`;
    });

    // Waxpeer
    axios.get('https://api.waxpeer.com/v1/search-items-by-name/', {
        params: {
            "api": wpKey,
            "names": skin
        }
    })
    .then(response => {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        var waxLow = formatter.format(response.data.items[0].price / 1000.00)
        waxPrice.innerHTML = `Waxpeer: ${waxLow}`;
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

