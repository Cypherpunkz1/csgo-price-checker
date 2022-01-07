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
    var skin = document.getElementById('search-input').value;
    var skinName = document.getElementById('skin-name');
    skinName.innerHTML = skin;

    if (skin) {
        document.getElementById('search-input').value = ''; // Clear search input
        
        // Change styles
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

        // Get skin prices
        getPrices(skin);
    }
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
    .catch(err => {
        if (err.response.status === 400) {
            steamPrice.innerHTML = 'Steam Low: Skin not found';
        }
        else if (err.response.status === 500) {
            steamPrice.innerHTML = 'Steam Low: Server error';
        }
    })
    .then(response => {
        try {
            steamPrice.innerHTML = `Steam Low: ${response.data.lowest_price}`;
        }
        catch {
            steamPrice.innerHTML = 'Steam Low: Unknown error';
        }
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
        bitPrice.innerHTML = `Bitskins Low: $${response.data.data.items[0].price}`;
    })
    .catch(err => {
        if (err.response.status === 401) {
            bitPrice.innerHTML = 'Bitskins Low: API key not set';
        }
        else if (err.response.status === 500) {
            bitPrice.innerHTML = 'Bitskins Low: Server error';
        }
        else {
            bitPrice.innerHTML = 'Bitskins Low: Unknown error';
        }
    });

    // Waxpeer
    axios.get('https://api.waxpeer.com/v1/search-items-by-name/', {
        params: {
            "api": wpKey,
            "names": skin
        }
    })
    .then(response => {
        if (response.data.success === true) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            });
            var waxLow = formatter.format(response.data.items[0].price / 1000.00)
            waxPrice.innerHTML = `Waxpeer Low: ${waxLow}`;
        }
        else if (response.data.success === false && response.data.msg == "Missing API") {
            waxPrice.innerHTML = 'Waxpeer Low: API key not set';
        }
    })
    // .catch(err => { // Waxpeer does not return error codes, so we cannot check errors based on codes
    //     waxPrice.innerHTML = 'Waxpeer Low: Unknown error';
    // });
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

