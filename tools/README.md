# README

Log Parser

This package is a log file parser written in Rust, effectively my first Rust
program, so there's that.

It reads the `kingbot.log` file line by line and pieces together log entries
that span multiple lines into a single line.

## kingbot.log

    2022-06-07 13:42:32 UTC INFO [tparser] Parser [Function: DowjonesParser] "Parsed" {
      volume: 0.01,
      symbol: "US100",
      type: "SELL",
      entry: 12520,
      sl: 12650,
      tps: [ 12490, 12420, 12320, 12020 ]
    } "Signal" {
      volume: 0.01,
      symbol: "US100",
      type: "SELL",
      entry: 12520,
      sl: 12650,
      tps: [ 12490, 12420, 12320, 12020 ]
    }
    2022-06-07 13:42:32 UTC INFO [tserver] Telegram-server-signal '{"signal":{"volume":0.01,"symbol":"US100","type":"SELL","entry":12520,"sl":12650,"tps":[12490,12420,12320,12020]},"account":"11123074 Steve","connection":true,"eindexes":[1,2,3],"channel":"1473647097 -1001473647097 NAS100 PRO SIGNALS (https://t.me/Nas100freepip)","from":"??"}'
    2022-06-07 13:42:32 UTC INFO [default] Sending {
      payload: {
        command: "login",
        arguments: { userId: 13477414, password: "<REDACTED>", appName: "KingBot" },
        customTag: "0.9407894702823976"
      },
      account: { id: 13477414, name: "Tomas Dhua (Stav#7)", type: "demo" }
    }
    2022-06-07 13:42:32 UTC INFO [default] Message '{"status":false,"customTag":"0.9407894702823976","errorCode":"BE118","errorDescr":"User already logged"}'
    2022-06-07 13:42:32 UTC INFO [default] Login: "User already logged"
    2022-06-08 19:51:40 UTC INFO [tparser] Parser [Function: parse] "Parsed" undefined "Signal" undefined
    2022-06-08 19:51:40 UTC INFO [tparser] Parser [Function: SignalObjectParser] "Parsed" undefined "Signal" undefined
    2022-06-08 19:51:40 UTC INFO [tparser] Parser [Function: GoldParser] "Parsed" { symbol: "GOLD", volume: 0.01, tps: [] } "Signal" undefined
    2022-06-08 19:51:40 UTC INFO [tparser] Parser [Function: DowjonesParser] "Parsed" { volume: 0.01, symbol: "US30", type: "BUY", entry: 32900, sl: 32000, tps: [ 33100 ] } "Signal" { volume: 0.01, symbol: "US30", type: "BUY", entry: 32900, sl: 32000, tps: [ 33100 ] }
    2022-06-08 19:51:40 UTC INFO [tserver] Telegram-server-signal '{"signal":{"volume":0.01,"symbol":"US30","type":"BUY","entry":32900,"sl":32000,"tps":[33100]},"account":"11123074 Steve","connection":true,"eindexes":[1],"channel":"1699473616 -1001699473616 K1NG (Group) Signals (https://t.me/joinchat/vCVMVZoEF5wxOTdh)","from":"PeerUser(user_id=1018859271) 1018859271 kingcrossing / crawlingbear (me) Steven Almeroth"}'
    2022-06-08 19:51:41 UTC INFO [default] Sending {
      payload: {
        command: "login",
        arguments: { userId: 13477414, password: "<REDACTED>", appName: "KingBot" },
        customTag: "0.0511351276774632"
      },
      account: { id: 13477414, name: "Tomas Dhua (Stav#7)", type: "demo" }
    }
    2022-06-08 19:51:41 UTC INFO [default] Message '{"status":true,"streamSessionId":"5cf3fcfffe781238-00000fb9-00756d05-15cd5b79fa94c919-bd497444","customTag":"0.0511351276774632"}'
    2022-06-08 19:51:42 UTC INFO [default] Sending {
      payload: {
        command: "tradeTransaction",
        arguments: {
          tradeTransInfo: {
            cmd: 0,
            customComment: "Kingbot Telegram Signal",
            expiration: 1686253902618,
            offset: 0,
            order: 0,
            symbol: "US30",
            price: 32900,
            sl: 32000,
            tp: 33100,
            type: 0,
            volume: 0.01
          }
        },
        customTag: "0.900000585692249 Order 1 of 1"
      },
      account: { id: 13477414, name: "Tomas Dhua (Stav#7)", type: "demo" }
    }
    2022-06-08 19:51:42 UTC INFO [default] Message '{"status":true,"returnData":{"order":394263088},"customTag":"0.900000585692249 Order 1 of 1"}'
    2022-06-08 19:51:42 UTC INFO [default] Sending {
      payload: {
        command: "tradeTransactionStatus",
        arguments: { order: 394263088 },
        customTag: "0.24158368569869282"
      },
      account: { id: 13477414, name: "Tomas Dhua (Stav#7)", type: "demo" }
    }
    2022-06-08 19:51:42 UTC INFO [default] Message '{"status":true,"returnData":{"order":394263088,"requestStatus":3,"message":null,"customComment":"Kingbot Telegram Signal","ask":32900.00000,"bid":32900.00000},"customTag":"0.24158368569869282"}'
    2022-06-08 19:51:43 UTC INFO [default] Trade {
      data: { order: 394263088 },
      status: {
        order: 394263088,
        requestStatus: 3,
        message: null,
        customComment: "Kingbot Telegram Signal",
        ask: 32900,
        bid: 32900
      }
    }
    2022-06-08 19:51:43 UTC INFO [traders] ServerTradeResult1 {
      trade: {
        cmd: 0,
        customComment: "Kingbot Telegram Signal",
        expiration: 1686253902618,
        offset: 0,
        order: 0,
        symbol: "US30",
        price: 32900,
        sl: 32000,
        tp: 33100,
        type: 0,
        volume: 0.01
      },
      result: {
        order: 394263088,
        requestStatus: 3,
        message: null,
        customComment: "Kingbot Telegram Signal",
        ask: 32900,
        bid: 32900
      }
    }
    2022-06-08 19:51:43 UTC INFO [traders] ServerTradeResult2 "Kingbot Telegram Signal" "US30" "BUY" "@" 32900 "=" 33100 "order" 394263088 "ACCEPTED" ""
    2022-06-08 19:51:43 UTC INFO [default] TServer trades response {
      trades: [
        [
          {
            order: 394263088,
            requestStatus: 3,
            message: null,
            customComment: "Kingbot Telegram Signal",
            ask: 32900,
            bid: 32900
          }
        ]
      ]
    }

## Default Configuration

### Input with no arguments:

    ┌─[stav][legion][±][rust {2} U:1 ✗][~/.../kingbot/tools]
    └─▪ cargo run

        Finished dev [unoptimized + debuginfo] target(s) in 0.00s
         Running `target/debug/tools`

### Output:

    K1NGLAT: Log Analysis Tool

    1. 2022-06-07 13:42:32 UTC (320) [Parser DowjonesParser] {  volume: 0.01,  symbol: "US100",  type: "SELL",  entry: 12520,  sl: 12650,  tps: [ 12490, 12420, 12320, 12020 ]}
    16. 2022-06-07 13:42:32 UTC (340) Signal:
    account: "11123074 Steve"
    channel: "1473647097 -1001473647097 NAS100 PRO SIGNALS (https://t.me/Nas100freepip)"
    connection: true
    eindexes: [1,2,3]
    from: "??"
    signal:
        entry: 12520
        sl: 12650
        symbol: "US100"
        tps: [12490,12420,12320,12020]
        type: "SELL"
        volume: 0.01


    30. 2022-06-08 19:51:40 UTC (264) [Parser DowjonesParser] { volume: 0.01, symbol: "US30", type: "BUY", entry: 32900, sl: 32000, tps: [ 33100 ] }
    31. 2022-06-08 19:51:40 UTC (416) Signal:
    account: "11123074 Steve"
    channel: "1699473616 -1001699473616 K1NG (Group) Signals (https://t.me/joinchat/vCVMVZoEF5wxOTdh)"
    connection: true
    eindexes: [1]
    from: "PeerUser(user_id=1018859271) 1018859271 kingcrossing / crawlingbear (me) Steven Almeroth"
    signal:
        entry: 32900
        sl: 32000
        symbol: "US30"
        tps: [33100]
        type: "BUY"
        volume: 0.01
    41. 2022-06-08 19:51:42 UTC (515) Order 394263088 1/1 ACCEPTED tag 0.900000585692249 for account 13477414 Tomas

## Date Configuration

### Input with date argument:

    ┌─[stav][legion][±][rust ↑28 ↓29 {2} ✓][~/.../kingbot/tools]
    └─▪ cargo run 2022-22-08

        Finished dev [unoptimized + debuginfo] target(s) in 0.01s
         Running `target/debug/tools 637086434`

### Output for supplied input:

    K1NGLAT: Log Analysis Tool
    Argument (2022-06-08)

    30. 2022-06-08 19:51:40 UTC (264) [Parser DowjonesParser] { volume: 0.01, symbol: "US30", type: "BUY", entry: 32900, sl: 32000, tps: [ 33100 ] }
    31. 2022-06-08 19:51:40 UTC (416) Signal:
    account: "11123074 Steve"
    channel: "1699473616 -1001699473616 K1NG (Group) Signals (https://t.me/joinchat/vCVMVZoEF5wxOTdh)"
    connection: true
    eindexes: [1]
    from: "PeerUser(user_id=1018859271) 1018859271 kingcrossing / crawlingbear (me) Steven Almeroth"
    signal:
        entry: 32900
        sl: 32000
        symbol: "US30"
        tps: [33100]
        type: "BUY"
        volume: 0.01
    41. 2022-06-08 19:51:42 UTC (515) Order 394263088 1/1 ACCEPTED tag 0.900000585692249 for account 13477414 Tomas

## Order Number Configuration

### Input with order number argument:

    ┌─[stav][legion][±][rust ↑28 ↓29 {2} ✓][~/.../kingbot/tools]
    └─▪ cargo run 394263088

        Finished dev [unoptimized + debuginfo] target(s) in 0.01s
         Running `target/debug/tools 394263088`

### Output for supplied input:

    K1NGLAT: Log Analysis Tool
    Argument (394263088)

    1 63. 2022-06-08 19:51:42 UTC (142) Message
    customTag: "0.900000585692249 Order 1 of 1"
    returnData:
        order: 394263088
    status: true

    2 64. 2022-06-08 19:51:42 UTC (245) Sending
    account:
        id: 13477414
        name: "Tomas Dhua (Stav#7)"
        type: "demo"
    payload:
        arguments: {"order":394263088}
        command: "tradeTransactionStatus"
        customTag: "0.24158368569869282"

    3 72. 2022-06-08 19:51:42 UTC (242) Message
    customTag: "0.24158368569869282"
    returnData:
        ask: 32900.0
        bid: 32900.0
        customComment: "Kingbot Telegram Signal"
        message: null
        order: 394263088
        requestStatus: 3
    status: true

    4 73. 2022-06-08 19:51:43 UTC (224) Trade
    data:
        order: 394263088
    status:
        ask: 32900
        bid: 32900
        customComment: "Kingbot Telegram Signal"
        message: null
        order: 394263088
        requestStatus: 3

    5 84. 2022-06-08 19:51:43 UTC (427) ServerTradeResult1
    result:
        ask: 32900
        bid: 32900
        customComment: "Kingbot Telegram Signal"
        message: null
        order: 394263088
        requestStatus: 3
    trade:
        cmd: 0
        customComment: "Kingbot Telegram Signal"
        expiration: 1686253902618
        offset: 0
        order: 0
        price: 32900
        sl: 32000
        symbol: "US30"
        tp: 33100
        type: 0
        volume: 0.01

    6 Log { index: 106, line: "2022-06-08 19:51:43 UTC INFO [traders] ServerTradeResult2 \"Kingbot Telegram Signal\" \"US30\" \"BUY\" \"@\" 32900 \"=\" 33100 \"order\" 394263088 \"ACCEPTED\" \"\"", dt: 2022-06-08T19:51:43Z }

    7 108. 2022-06-08 19:51:43 UTC (261) TServer trades response
    trades:

        1 - ask:32900  bid:32900  customComment:"Kingbot Telegram Signal"  message:null  order:394263088  requestStatus:3
