const { default: axios } = require("axios");
const { ipcRenderer } = require("electron")
const fs = require('fs');
const totp = require('notp').totp;
const base32 = require('thirty-two');
const weaponDecode = {
    'cz75-auto': 'CZ75-Auto |',
    'cz75 auto': 'CZ75-Auto |',
    'cz': 'CZ75-Auto |',
    'cz75': 'CZ75-Auto |',
    'desert eagle': 'Desert Eagle |',
    'deagle': 'Desert Eagle |',
    'deag': 'Desert Eagle |',
    'dessert eagle': 'Desert Eagle |',
    'dualies': 'Dual Berettas |',
    'dual berettas': 'Dual Berettas |',
    'dual beretta': 'Dual Berettas |',
    'five seven': 'Five-SeveN |',
    'fiveseven': 'Five-SeveN |',
    '57': 'Five-SeveN |',
    'glock': 'Glock-18 |',
    'glock18': 'Glock-18 |',
    'glock-18': 'Glock-18 |',
    'glock 18': 'Glock-18 |',
    'p2000': 'P2000 |',
    'p2k': 'P2000 |',
    'p250': 'P250 |',
    'r8': 'R8 Revolver |',
    'revolver': 'R8 Revolver |',
    'r8 revolver': 'R8 Revolver |',
    'tec9': 'Tec-9 |',
    'tec 9': 'Tec-9 |',
    'tec-9': 'Tec-9 |',
    'usp': 'USP-S |',
    'usps': 'USP-S |',
    'usp-s': 'USP-S |',
    'ak47': 'AK-47 |',
    'ak': 'AK-47 |',
    'ak-47': 'AK-47 |',
    'ak 47': 'AK-47 |',
    'aug': 'AUG |',
    'awp': 'AWP |',
    'famas': 'FAMAS |',
    'g3sg1': 'G3SG1 |',
    'galil': 'Galil AR |',
    'm4a1s': 'M4A1-S |',
    'm4a1-s': 'M4A1-S |',
    'm4a1': 'M4A1-S |',
    'a1': 'M4A1-S |',
    'm4a4 ': 'M4A4 |',
    'a4 ': 'M4A4 |',
    'scar': 'SCAR-20 |',
    'scar-20': 'SCAR-20 |',
    'scar 20': 'SCAR-20 |',
    'sg': 'SG 553 |',
    'sg553': 'SG 553 |',
    'sg 553': 'SG 553 |',
    'ssg': 'SSG 08 |',
    'ssg08': 'SSG 08 |',
    'ssg 08': 'SSG 08 |',
    'ssg-08': 'SSG 08 |',
    'scout': 'SSG 08 |',
    'mac': 'MAC-10 |',
    'mac10': 'MAC-10 |',
    'mac 10': 'MAC-10 |',
    'mac-10': 'MAC-10 |',
    'mp5': 'MP5-SD |',
    'mp5-sd': 'MP5-SD |',
    'mp5 sd': 'MP5-SD |',
    'mp7': 'MP7 |',
    'mp9': 'MP9 |',
    'ppbizon': 'PP-Bizon |',
    'pp-bizon': 'PP-Bizon |',
    'pp bizon': 'PP-Bizon |',
    'pp': 'PP-Bizon |',
    'p90': 'P90 |',
    'ump': 'UMP-45 |',
    'ump-45': 'UMP-45 |',
    'ump 45': 'UMP-45 |',
    'ump45': 'UMP-45 |',
    'mag': 'MAG-7 |',
    'mag-7': 'MAG-7 |',
    'mag 7': 'MAG-7 |',
    'swag-7': 'MAG-7 |',
    'nova': 'Nova |',
    'sawed-off': 'Sawed-Off |',
    'sawed off': 'Sawed-Off |',
    'xm1014': 'XM1014 |',
    'xm': 'XM1014 |',
    'm249': 'M249 |',
    'm2': 'M249 |',
    'negev': 'Negev |',
    'nomad': '★ Nomad Knife |',
    'nomad-knife': '★ Nomad Knife |',
    'nomad knife': '★ Nomad Knife |',
    'nomadknife': '★ Nomad Knife |',
    'skeletonknife': '★ Skeleton Knife |',
    'skeleton knife': '★ Skeleton Knife |',
    'skeleton-knife': '★ Skeleton Knife |',
    'skeleton': '★ Skeleton Knife |',
    'survival': '★ Survival Knife |',
    'survivalknife': '★ Survival Knife |',
    'survival knife': '★ Survival Knife |',
    'survival-knife': '★ Survival Knife |',
    'paracord': '★ Paracord Knife |',
    'paracord-knife': '★ Paracord Knife |',
    'paracordknife': '★ Paracord Knife |',
    'paracord knife': '★ Paracord Knife |',
    'para': '★ Paracord Knife |',
    'classic': '★ Classic Knife |',
    'classicknife': '★ Classic Knife |',
    'classic knife': '★ Classic Knife |',
    'classic-knife': '★ Classic Knife |',
    'knife': '★ Classic Knife |',
    'bayo': '★ Bayonet |',
    'bayonet': '★ Bayonet |',
    'bowie': '★ Bowie Knife |',
    'bowieknife': '★ Bowie Knife |',
    'bowie knife': '★ Bowie Knife |',
    'bowie-knife': '★ Bowie Knife |',
    'butterfly': '★ Butterfly Knife |',
    'butterfly-knife': '★ Butterfly Knife |',
    'butterflyknife': '★ Butterfly Knife |',
    'butterfly knife': '★ Butterfly Knife |',
    'bfk': '★ Butterfly Knife |',
    'falchion': '★ Falchion Knife |',
    'falchion-knife': '★ Falchion Knife |',
    'falchionknife': '★ Falchion Knife |',
    'falchion knife': '★ Falchion Knife |',
    'flip': '★ Flip Knife |',
    'flip-knife': '★ Flip Knife |',
    'flipknife': '★ Flip Knife |',
    'flip knife': '★ Flip Knife |',
    'gut': '★ Gut Knife |',
    'gut-knife': '★ Gut Knife |',
    'gutknife': '★ Gut Knife |',
    'gut knife': '★ Gut Knife |',
    'huntsman': '★ Huntsman Knife |',
    'huntsmanknife': '★ Huntsman Knife |',
    'huntsman knife': '★ Huntsman Knife |',
    'huntsman-knife': '★ Huntsman Knife |',
    'karam': '★ Karambit |',
    'karambit': '★ Karambit |',
    'kara': '★ Karambit |',
    'm9': '★ M9 Bayonet |',
    'm9-bayo': '★ M9 Bayonet |',
    'm9 bayo': '★ M9 Bayonet |',
    'm9bayo': '★ M9 Bayonet |',
    'm9bayonet': '★ M9 Bayonet |',
    'm9 bayonet': '★ M9 Bayonet |',
    'm9-bayonet': '★ M9 Bayonet |',
    'navaja': '★ Navaja Knife |',
    'navajaknife': '★ Navaja Knife |',
    'navaja knife': '★ Navaja Knife |',
    'navaja-knife': '★ Navaja Knife |',
    'shadowdaggers': '★ Shadow Daggers |',
    'shadow daggers': '★ Shadow Daggers |',
    'shadow-daggers': '★ Shadow Daggers |',
    'shadow': '★ Shadow Daggers |',
    'dags': '★ Shadow Daggers |',
    'plugs': '★ Shadow Daggers |',
    'stiletto': '★ Stiletto Knife |',
    'stiletto-knife': '★ Stiletto Knife |',
    'stilettoknife': '★ Stiletto Knife |',
    'stiletto knife': '★ Stiletto Knife |',
    'talon': '★ Talon Knife |',
    'talon-knife': '★ Talon Knife |',
    'talonknife': '★ Talon Knife |',
    'talon knife': '★ Talon Knife |',
    'ursus': '★ Ursus Knife |',
    'urs': '★ Ursus Knife |',
    'ursus-knife': '★ Ursus Knife |',
    'ursusknife': '★ Ursus Knife |',
    'ursus knife': '★ Ursus Knife |',
    'music': 'Music Kit |',
    'music-kit': 'Music Kit |',
    'musickit': 'Music Kit |',
    'music kit': 'Music Kit |',
}

const wearDecode = {
    'bs': '(Battle-Scarred)',
    'ww': '(Well-Worn)',
    'ft': '(Field-Tested)',
    'mw': '(Minimal Wear)',
    'fn': '(Factory New)'
}

let bsKey, wpKey; // API keys
var steamPrice = document.getElementById('steam-price');
var waxPrice = document.getElementById('waxpeer-price');
var bitPrice = document.getElementById('bitskins-price');



// Search Button
document.getElementById('search-btn').addEventListener('click', () => {
    var skin = document.getElementById('search-input').value;
    skin = processName(skin);
    var skinName = document.getElementById('skin-name');
    
    if (skin) {
        skinName.innerHTML = skin; // Display skin name
        document.getElementById('search-input').value = ''; // Clear search input
        
        // Change styles
        document.getElementById('center-container').classList.remove('center');
        document.getElementById('center-container').classList.add('result');
        document.getElementById('set-keys-btn').hidden = true;
        

        steamPrice.classList.add('prices-show'); // show prices with style applied
        steamPrice.style = "background: #8497b2;"
        steamPrice.innerHTML = 'Steam Low: Loading...';
        bitPrice.classList.add('prices-show');
        bitPrice.style = "background: #ff7575;"
        bitPrice.innerHTML = 'BitSkins Low: Loading...';
        waxPrice.classList.add('prices-show');
        waxPrice.style = "background: #25a9f3;"
        waxPrice.innerHTML = 'Waxpeer Low: Loading...';
        keys = getApiKeys();
        bsKey = keys.bitskins;
        wpKey = keys.waxpeer;
        bsTOTP = keys.bsSecret;

        // Get skin prices
        getPrices(skin);
    }
});

/* This function attempts to take an inputted name and convert to official Steam name to be used in API searches*/
function processName(name) {
    let re = /.+\|.+\([^)]*\)/i;
    let formattedName;
    if (re.test(name)) {
        console.log('regex accepted')
        return name;
    }
    else {
        // try {
            searchTerms = name.split(' ');
            searchTerms.forEach((word, i) => {
                debugger
                word = word.toLowerCase();
                if (word != ' ') {
                    if (i == 0) { // weapon name
                        if (word in weaponDecode) {
                            formattedName = weaponDecode[word];
                        }
                        else if (word + ' ' + searchTerms[i+1]) { // try the first 2 words
                            formattedName = weaponDecode[word + ' ' + searchTerms[i+1]];
                            i += 1;
                        }
                        else {
                            formattedName = word;
                        }
                    }
                    else if (i != 0 && i != searchTerms.length - 1) { // skin name
                        for (let j = i; j < searchTerms.length - 1; j++) {
                            skin = searchTerms[j].replace(searchTerms[j][0], searchTerms[j][0].toUpperCase()); // capitalize first letter
                            formattedName += ' ' + skin; // append everything between weapon name and wear to the skin name
                            i += 1;
                            return
                        }
                    }
                    else if (i == searchTerms.length - 1) { // wear
                        if (word in wearDecode) {
                            formattedName += ' ' + wearDecode[word];
                        }
                        else {
                            formattedName += ' ' + word;
                        }
                    }

                }
            });
            return formattedName;
    //     } 
    //     catch (error) {
    //         return name
    //     }
    }
}

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
    })
    .catch(err => {
        if (err.response.status === 500) {
            steamPrice.innerHTML = 'Steam Low: Skin not found';
        }
        else if (err.response.status === 502) {
            steamPrice.innerHTML = 'Steam Low: Server error';
        }
        else {
            steamPrice.innerHTML = 'Steam Low: Unknown error';
        }
    })
    
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
        if (err.response) {
            if (err.response.status === 401) {
                bitPrice.innerHTML = 'Bitskins Low: Token/API key not set';
            }
            else if (err.response.status === 500) {
                bitPrice.innerHTML = 'Bitskins Low: Server error';
            }
        }
        else {
            bitPrice.innerHTML = 'Bitskins Low: Skin not found';
        }
    });

    // Waxpeer
    console.log(`Call: https://api.waxpeer.com/v1/search-items-by-name/?api=${wpKey}&names=${skin}`);
    axios.get('https://api.waxpeer.com/v1/search-items-by-name/', {
        params: {
            "api": wpKey,
            "names": skin
        }
    })
    .then(response => { // Waxpeer does not return error codes, so we cannot check errors based on codes
        if (response.data.success === true) {
            if (response.data.items.length > 0) { // Waxpeer returns {"success":true,"items":[]} if no items found
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
                var waxLow = formatter.format(response.data.items[0].price / 1000.00)
                waxPrice.innerHTML = `Waxpeer Low: ${waxLow}`;
            }
            else {
                waxPrice.innerHTML = 'Waxpeer Low: Skin not found';
            }
        }
        else if (response.data.success === false && response.data.msg == "Missing API") {
            waxPrice.innerHTML = 'Waxpeer Low: API key not set';
        }
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

