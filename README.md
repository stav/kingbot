# K1NGBOT

_The [K1NGbot][1] rewritten using [Deno][2]._ 🦕

This is a Deno command line application that monitors trade events on XTB's
XStation 5 appliance via websocket connections.

Currently the bot only does one thing:

* **move the stop loss for the position**.

An asset position may be comprised of multiple orders. _A family is a group of
orders all with the **exact same stop loss**._ Each order in the position would
have its own _take-profit_ price.

The sole purpose of the bot is to monitor the position and when a take-profit
price is reached then the stop loss is moved for all orders in the family to
a better level.

## No Meta Data

There is NO storage that keeps track of meta-data about orders.  When a trade
event happens (close, for example, due to take-profit) we only know about that
specific trade which may be part of a multi-order position.

Take the following received trade event that XTB sends:

    symbol: 'BITCOIN'
    open_price: 67458.03
    close_price: 66861.86
    position: 316522733
    comment: '[T/P]'
    profit: 59.62
    sl: 67206.15
    tp: 66863.15
    volume: 0.1

That's all the bot knows.  It doesn't know about the other orders (in the "family")
and their TP levels.  Instead the bot reasons about what to do solely from the single
trade event information that the server sends.

## Stop Loss

Once the bot is listening for trades it will spot orders closed because of _take
profit_ which will signal him to adjust the stop loss for all remaining orders in
the "family".

### Break-even Stop Loss

When the first TP level is reached the stop loss moves to 0.03% better than the
open price.

### Trailing Stop Loss

When TP2 is reached the bot moves to halfway between the open-price and the
close-price for this order.

For example: Say we have three orders in a "family" all with a stop loss of `70239.44`:

    SL 70239.44 SELL BITCOIN TPs=[ 67133.03, 66998.09, 66863.15 ]

First we hit TP1:

    symbol     : 'BITCOIN'
    open_price : 67458.03
    close_price: 67122.13
    position   : 316522734
    comment    : '[T/P]'
    profit     : 33.59
    volume     : 0.1
    sl         : 70239.44
    tp         : 67133.03

The bot moves stop loss from `70239.44` to `67437.79 = 67458.03 - 20.24` for two
(2) orders.

Then we hit TP2:

    symbol     : 'BITCOIN'
    open_price : 67458.03
    close_price: 66994.74
    position   : 316522735
    comment    : '[T/P]'
    profit     : 46.33
    volume     : 0.1
    sl         :67437.79
    tp         :66998.09

The bot moves stop loss from
`67437.79` to `67206.15 = (67458.03 + 66994.74 / 2) - 20.24` for one (1) order.

Then TP3 (the last order) does not move any stop loss since there is noone left
in the family, perhaps sadly; but, don't get emotional.

## Documentation

XTB <https://xstation5.xtb.com/>
xAPI <http://developers.xstore.pro/documentation/>
Deno <https://deno.land/>

## Installation

Deno doesn't use package management, per se. Modules are cached when they are
first encountered in the code.

    git clone git@github.com:stav/kingbot.git
    cd kingbot

### Configuration

Edit the file `.config/local.example.yaml` with your real information and save
it as `.config/local.yaml`.

## Usage

Make sure you are in the `kingbot` directory.

```bash
deno run --allow-net --allow-read --allow-write --unstable --import-map=denoPaths.json ./src/app.ts
```

    0[]> ?
    input "?" (object) [
      "conns",
      "f",
      "inspect",
      "Conn",
      "availableCommands",
      "prompt",
      "prime",
      "bind",
      "list",
      "fKey"
    ]

    0[]> prime
    input "prime" (function) [Function: bound prime]
    [
      "CNX 1 [--] XConn XapiSocket(123456|Demo) XapiStream(123456|Demo)",
      "CNX 2 [--] XConn XapiSocket(234567|Test) XapiStream(234567|Test)",
      "CNX 3 [--] XConn XapiSocket(345678|Cherry) XapiStream(345678|Cherry)",
    ]

    1[--]> ?
    input "?" (object) [
      "conns",             "f",
      "inspect",           "Conn",
      "availableCommands", "prompt",
      "bind",              "list",
      "fKey",              "Conn.Socket",
      "Conn.Stream",       "Conn.inspect",
      "Conn.alive",        "Conn.prompt",
      "Conn.start",        "Conn.connect",
      "Conn.login",        "Conn.ping",
      "Conn.listen",       "Conn.unlisten",
      "Conn.story",        "Conn.trades",
      "Conn.trade",        "Conn.hedge",
      "Conn.logout",       "Conn.close",
      "Conn.status",       "Conn.list"
    ]

    0[]> f.1
    input "f.1" (function) [Function: bound ]

    1[--]> start
    input "start" (function) [AsyncFunction: bound start]
    [
      "XapiSocket  wss://ws.xtb.com/demo  123456|Demo  OPEN|0h0m0s  0010afe3-...",
      "XapiStream  wss://ws.xtb.com/demoStream  123456|Demo  OPEN|0h0m0s  001..."
    ]

    1[lo]> list
    input "list" (function) [Function: bound list]
    [
      "CNX 1 [lo] XConn XapiSocket(123456|Demo) XapiStream(123456|Demo)",
      "CNX 2 [--] XConn XapiSocket(234567|Test) XapiStream(234567|Test)",
      "CNX 3 [--] XConn XapiSocket(345678|Cherry) XapiStream(345678|Cherry)",
    ]

    1[lo]> listen
    input "listen" (function) [Function: bound listen]

    1[ll]> list
    input "list" (function) [Function: bound list]
    [
      "CNX 1 [ll] XConn XapiSocket(123456|Demo) XapiStream(123456|Demo)",
      "CNX 2 [--] XConn XapiSocket(234567|Test) XapiStream(234567|Test)",
      "CNX 3 [--] XConn XapiSocket(345678|Cherry) XapiStream(345678|Cherry)",
    ]

    1[ll]> story
    input "story" (function) [Function: bound story]
    XapiSocket  wss://ws.xtb.com/demo  123456|Demo  OPEN|0h0m53s
    {
      leverage: 1,
      currency: "PLN",
      ibAccount: false,
      trailingStop: true,
      leverageMultiplier: 1,
      balance: 10540.91,
      margin: 2589.93,
      equityFX: 9850.01,
      equity: 9850.01,
      margin_free: 7260.08,
      margin_level: 380.32,
    }
    { version: "2.5.0" }
    { time: 1644262683119, timeString: "Feb 7, 2022, 8:38:03 PM" }

    1[ll]> close
    input "close" (function) [Function: bound close]
    XapiSocket  wss://ws.xtb.com/demo        123456|Demo  CLOSED|0h9m11s
    XapiStream  wss://ws.xtb.com/demoStream  123456|Demo  CLOSING|0h9m12s
    XapiStream  wss://ws.xtb.com/demoStream  123456|Demo  CLOSED|0h9m12s

    1[--]> list
    input "list" (function) [Function: bound list]
    [
      "CNX 1 [--] XConn XapiSocket(123456|Demo) XapiStream(123456|Demo)",
      "CNX 2 [--] XConn XapiSocket(234567|Test) XapiStream(234567|Test)",
      "CNX 3 [--] XConn XapiSocket(345678|Cherry) XapiStream(345678|Cherry)",
    ]

Send EOF (Ctrl-D End-of-file) to exit.


[1]: https://github.com/stav/xapi
[2]: https://deno.land
