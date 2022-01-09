# CSGO Price Checker

CS:GO Skins Price Checker that displays the lowest price for Steam Market, Waxpeer, and Bitskins. Created by @Hitm0nLim and intially released on May 30, 2020. Check [Releases](https://github.com/Hitm0nLim/csgo-price-checker/releases) for the latest release.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [API Keys](#api-keys)

## Setup

Download the installer from the [Releases](https://github.com/Hitm0nLim/csgo-price-checker/releases) tab to run the app. If you want to build the app yourself for development, clone the repository and use `npm install` to install all dependencies.

## Usage

Search for the item you want to price check, and the app will attempt to convert it to Steam Market form: `weapon | skin name (wear)`. An example would be `AK-47 | Redline (Field-Tested)`. The app will be expecting searches either in Steam Market form or in `weapon skin name wear` form, where wear is one of `{FN, MW, FT, WW, BS}`. Try writing your search in Steam Market form if you cannot find the desired item. Not all skins come in all wear conditions.

To view BitSkins and Waxpeer prices, some access information needs to be set in the API keys window for price data to be retrieved.

## API Keys

### What are API Keys

BitSkins and Waxpeer requires users to be registered on their site to access their price data. Once registered, users will be given an API key that allows them to get price data, their BitSkins/Waxpeer account information, and skin information. API keys also allow users to automate trading on BitSkins/Waxpeer, but this app uses API keys for the sole reason of checking prices. I suggest using the Bitskins and Waxpeer API keys of spare accounts, as you should never give others access to your main account's API keys. If you do not want to provide API keys, the app will only retrieve Steam Community Market prices.

***Always keep your API Keys safe. They allow access to your Bitskins/Waxpeer accounts and can buy/sell skins on your account.*** Selling of skins require Steam mobile confirmations, which Bitskins and Waxpeer API keys cannot give access to, so your inventory on Steam is safe. This app does not require a Steam API key as Steam price data can be accessed by anyone.

### Where to Get API Keys

You can get your API keys using the links below:

- [Bitskins](https://bitskins.com/settings)
- [Waxpeer](https://waxpeer.com/user/profile)

## Developer Notes

### API Structures

<details>

<summary>Steam</summary>

The Steam Community Market API is openly available at `https://steamcommunity.com/market/priceoverview/`. It requires the following parameters:

- `appid`: 730 for CS:GO
- `currency`: 1 for USD, 20 for CAD
- `market_hash_name`: item name, in the form of `weapon | skin (wear)`

An example call would be:

```https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=AK-47%20|%20Redline%20(Field-Tested)```

A successful response:

```json
{"success":true,"lowest_price":"$14.96","volume":"452","median_price":"$14.97"}
```

Unsuccessful response:

```json
{"success":false}
```

</details>

<details>
<summary>BitSkins</summary>

The [BitSkins API](https://bitskins.com/api) is only accessible via an API key and a generated TOTP code. We can use `https://bitskins.com/api/v1/get_inventory_on_sale/` endpoint to get all listings of a specific item and sort it so we can find the cheapest price easily. It requires the following parameters:

- `api_key`: BitSkins API key
- `code`: One time password token, generated with `notp.totp` and `thirty-two` module
- `sort_by`: How results are sorted. We use `price`
- `order`: Order of the sort. We use `asc` to show cheapest prices first
- `show_trade_delayed_items`: Whether or not to show items that have Steam trade hold on BitSkin bot accounts. We use `1` to show these items
- `market_hash_name`: item name, in the form of `weapon | skin (wear)`

An example call would be:

```https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=API_KEY&code=CODE&app_id=730&sort_by=price&order=asc&show_trade_delayed_items=1&market_hash_name=AK-47 | Redline (Field-Tested)```

A successful response:

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "app_id": "730",
        "context_id": "2",
        "item_id": "24516652515",
        "asset_id": "24516652515",
        "class_id": "4700295612",
        "instance_id": "480085569",
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "item_type": "Rifle",
        "item_class": "282",
        "item_rarity": "Classified",
        "item_weapon": "AK-47",
        "item_quality": "Normal",
        "image": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5Pu75iY1zI97bhLsvQz/256fx256f",
        "inspectable": true,
        "inspect_link": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198399664716A%asset_id%D2940503861087363583",
        "price": "10.40",
        "suggested_price": "14.15",
        "is_featured": false,
        "float_value": "0.31457195",
        "pattern_info": {
          "paintindex": 282,
          "paintseed": 327,
          "rarity": 5,
          "quality": 4,
          "paintwear": 1050742675,
          "patternname": "Redline"
        },
        "phase": null,
        "type": "listed",
        "is_mine": false,
        "tags": {
          "type": "Rifle",
          "weapon": "AK-47",
          "itemset": "The Phoenix Collection",
          "quality": "Normal",
          "rarity": "Classified",
          "exterior": "Field-Tested"
        },
        "fraud_warnings": [],
        "stickers": null,
        "updated_at": 1641594997,
        "withdrawable_at": 1642147199,
        "bot_uid": "76561198399664716"
      },
      .
      .
      .
```

Unsuccessful responses:

```json
{
  "status": "fail",
  "data": {
    "error_message": "Invalid API Key, invalid two-factor authentication code, or API access not enabled."
  }
}
```

```json
/* Skin not found */
{
  "status": "success",
  "data": {
    "items": [],
    "page": 1,
    "cache_expires_at": 0,
    "rendered_in_seconds": 0
  }
}
```

</details>

<details>
<summary>Waxpeer</summary>

The [Waxpeer API](https://waxpeer.com/docs) is only accessible via an API key. We can use `https://api.waxpeer.com/v1/search-items-by-name/` endpoint to get all listings of a specific item sorted by price low to high. It requires the following parameters:

- `api`: Waxpeer API key
- `code`: One time password token, generated with `notp.totp` and `thirty-two` module
- `sort_by`: How results are sorted. We use `price`
- `order`: Order of the sort. We use `asc` to show cheapest prices first
- `show_trade_delayed_items`: Whether or not to show items that have Steam trade hold on BitSkin bot accounts. We use `1` to show these items
- `market_hash_name`: item name, in the form of `weapon | skin (wear)`

An example call would be:

```https://api.waxpeer.com/v1/search-items-by-name/?api=API_KEY&names=AK-47 | Redline (Field-Tested)```

A successful response:

```json
{
  "success": true,
  "items": [
    {
      "name": "AK-47 | Redline (Field-Tested)",
      "price": 14057,
      "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/4483852859/200fx125f",
      "item_id": "23220317927"
    },
    .
    .
    .
```

Unsuccessful responses:
```json
{"success":false,"msg":"wrong api"}
```

```json
/* Skin not found */
{"success":true,"items":[]}
```

</details>