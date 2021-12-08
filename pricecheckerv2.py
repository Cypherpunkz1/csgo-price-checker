#-------------------------------------------------------------------------------------------------------------------------------#
# Tkinter widgets https://www.tutorialspoint.com/python/python_gui_programming.htm
# YT Tutorial https://youtu.be/D8-snVfekto?t=1669
#-------------------------------------------------------------------------------------------------------------------------------#
# Skin Price Checker by Hitm0nLim v2 (newest version, completed May 30, 2020)
# Gets lowest price for a skin on BitSkins, Waxpeer, and Steam market.
# Search full skin name (AWP | Wildfire (Field-Tested)) OR search www[skinname]WW where w is weapon and W is wear (awpwildfireft)
#-------------------------------------------------------------------------------------------------------------------------------#
# Requirements:
# pip install requests
# pip install pyotp
#-------------------------------------------------------------------------------------------------------------------------------#

import tkinter as tk
import requests
import pyotp
import json

height = 700
width = 800

with open('keys.json') as f:
    keys = json.load(f)
    bsKey = keys['bitskins']
    wpKey = keys['waxpeer']


def formatSteam(skinData):
    try:
        price = skinData['lowest_price']
    except KeyError:
        price = 'Error getting price'
    return price


def formatBitskins(skinData):
    try:
        data = skinData['data']['items']
        price = '$'+data[len(data)-1]['price']
    except:
        price = 'Error getting price'
    return price


def formatWaxpeer(skinData):
    try:
        data = skinData['items'][0]
        price = '$' + str(round(data['price']/1000.0, 2))
    except:
        price = 'Error getting price'
    return price


def itemDecode(skin):
    weaponDecode = {'cz7': 'CZ75-Auto | ',
                    'des': 'Desert Eagle | ',
                    'dua': 'Dual Berettas | ',
                    'fiv': 'Five-SeveN | ',
                    'glo': 'Glock-18 | ',
                    'p20': 'P2000 | ',
                    'p25': 'P250 | ',
                    'r8r': 'R8 Revolver | ',
                    'tec': 'Tec-9 | ',
                    'usp': 'USP-S | ',
                    'ak4': 'AK-47 | ',
                    'aug': 'AUG | ',
                    'awp': 'AWP | ',
                    'fam': 'FAMAS | ',
                    'g3s': 'G3SG1 | ',
                    'gal': 'Galil AR | ',
                    'a1s': 'M4A1-S | ',
                    'a4 ': 'M4A4 | ',
                    'sca': 'SCAR-20 | ',
                    'sg5': 'SG 553 | ',
                    'ssg': 'SSG 08 | ',
                    'mac': 'MAC-10 | ',
                    'mp5': 'MP5-SD | ',
                    'mp7': 'MP7 | ',
                    'mp9': 'MP9 | ',
                    'ppb': 'PP-Bizon | ',
                    'p90': 'P90 | ',
                    'ump': 'UMP-45 | ',
                    'mag': 'MAG-7 | ',
                    'nov': 'Nova | ',
                    'saw': 'Sawed-Off | ',
                    'xm1': 'XM1014 | ',
                    'm24': 'M249 | ',
                    'neg': 'Negev | ',
                    'nom': '★ Nomad Knife | ',
                    'ske': '★ Skeleton Knife | ',
                    'sur': '★ Survival Knife | ',
                    'par': '★ Paracord Knife | ',
                    'cla': '★ Classic Knife | ',
                    'bay': '★ Bayonet | ',
                    'bow': '★ Bowie Knife | ',
                    'but': '★ Butterfly Knife | ',
                    'fal': '★ Falchion Knife | ',
                    'fli': '★ Flip Knife | ',
                    'gut': '★ Gut Knife | ',
                    'hun': '★ Huntsman Knife | ',
                    'kar': '★ Karambit | ',
                    'm9b': '★ M9 Bayonet | ',
                    'nav': '★ Navaja Knife | ',
                    'sha': '★ Shadow Daggers | ',
                    'sti': '★ Stiletto Knife | ',
                    'tal': '★ Talon Knife | ',
                    'urs': '★ Ursus Knife | ',
                    'mus': 'Music Kit | ',
                    }

    wearDecode = {'bs': '(Battle-Scarred)',
                  'ww': '(Well-Worn)',
                  'ft': '(Field-Tested)',
                  'mw': '(Minimal Wear)',
                  'fn': '(Factory New)'}

    try:
        weapon = weaponDecode[skin[:3]]
        wear = wearDecode[skin[-2:]]
    except KeyError:
        return skin
    return weapon + skin[3:len(skin)-2].title() + ' ' + wear


def compilePrices(skin):
    skin = itemDecode(skin)
    if skin != 'Invalid Entry':
        steamData = steamPrice(skin)
        bsData = bitskinsPrice(skin)
        wpData = waxpeerPrice(skin)
        label['text'] = skin + '\nLowest Steam price: ' + formatSteam(
            steamData) + '\nLowest BitSkins price: ' + formatBitskins(bsData) + '\nLowest Waxpeer price: ' + formatWaxpeer(wpData)
    else:
        label['text'] = 'Error: Invalid Entry.'


def steamPrice(skin):
    url = 'https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=' + \
        skin  # currency 1 is usd, 20 is cad
    response = requests.get(url)
    skinData = response.json()
    return skinData


def bitskinsPrice(skin):
    url = 'https://bitskins.com/api/v1/get_inventory_on_sale/?'
    # 2FA Token
    # get a token that's valid right now
    my_secret = 'QTZRBHRE6FPNQLPU'
    my_token = pyotp.TOTP(my_secret)
    # print the valid token
    token = my_token.now()
    params = {'api_key': bsKey, 'code': token, 'sort_by': 'price',
              'show_trade_delayed_items': 1, 'market_hash_name': skin}
    response = requests.get(url, params=params)
    bsData = response.json()
    return bsData


def waxpeerPrice(skin):
    url = 'https://api.waxpeer.com/v1/search-items-by-name?'
    params = {'api': wpKey, 'names': skin}
    response = requests.get(url, params=params)
    wpData = response.json()
    return wpData


##### GUI #####
root = tk.Tk()
root.title('Skin Price Checker')

canvas = tk.Canvas(root, height=height, width=width)
canvas.pack()

#bgImage = tk.PhotoImage(file='YouTubeBannerBlue.png')
bgLabel = tk.Label(root, bg='#10192a')
bgLabel.place(relwidth=1, relheight=1)

frame = tk.Frame(root, bg='#80c1ff', bd=5)
frame.place(relx=0.5, rely=.1, relwidth=.75, relheight=.1,
            anchor='n')  # anchor = 'n' centres it in the frame

entry = tk.Entry(frame, font=40)
entry.place(relwidth=.65, relheight=1)

button = tk.Button(frame, text='Get Price', font=40,
                   command=lambda: compilePrices(entry.get()))
button.place(relx=0.7, relwidth=.3, relheight=1)

lowerFrame = tk.Frame(root, bg='#80c1ff', bd=10)
lowerFrame.place(relx=.5, rely=.25, relwidth=0.75, relheight=0.6, anchor='n')

footerFrame = tk.Frame(root, bg='#10192a', bd=10)
footerFrame.place(relx=0.5, rely=.885, relwidth=0.75,
                  relheight=0.08, anchor='n')

label = tk.Label(lowerFrame, font=50, bd=4)  # bd is border
label.place(relwidth=1, relheight=1)

footerLabel = tk.Label(footerFrame, bg='#10192a', fg='white')  # bd is border
footerLabel.place(relwidth=1, relheight=1)
footerLabel['text'] = '©Hitm0nLimGaming 2020\nwww.hgaming.ga'

root.mainloop()

# Compiled with pyinstaller --onefile -w --icon=hg.ico pricecheckerv2.py
