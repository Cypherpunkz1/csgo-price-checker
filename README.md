# CSGO Price Checker

CS:GO Skins Price Checker that displays the lowest price for Steam Market, Waxpeer, and Bitskins. Created by @Hitm0nLim and intially released on May 30, 2020. Check [Releases](https://github.com/Hitm0nLim/csgo-price-checker/releases) for the latest release.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [API Keys](#api-keys)

## Setup

Download the installer from the [Releases](https://github.com/Hitm0nLim/csgo-price-checker/releases) tab to run the app. If you want to build the app yourself for development, clone the repository and use `npm install` to install all dependencies.

## How to use

Search for a full skin name, eg `AWP | Wildfire (Field-Tested)`, or search with `www[skinname]WW` where www is the 3 letter code of the skin and WW is the wear. Example: `awpwildfireft`

## API Keys

### What are API Keys

BitSkins and Waxpeer requires users to be registered on their site to access their price data. Once registered, users will be given an API key that allows them to get price data, their BitSkins/Waxpeer account information, and skin information. API keys also allow users to automate trading on BitSkins/Waxpeer, but this app uses API keys for the sole reason of checking prices. I suggest using the Bitskins and Waxpeer API keys of spare accounts, as you should never give others access to your main account's API keys. If you do not want to provide API keys, the app will only retrieve Steam Community Market prices.

***Always keep your API Keys safe. They allow access to your Bitskins/Waxpeer accounts and can buy/sell skins on your account.*** Selling of skins require Steam mobile confirmations, which Bitskins and Waxpeer API keys cannot give access to, so your inventory on Steam is safe. This app does not require a Steam API key as Steam price data can be accessed by anyone.

### Where to Get API Keys

You can get your API keys using the links below:

- [Bitskins](https://bitskins.com/settings)
- [Waxpeer](https://waxpeer.com/user/profile)
