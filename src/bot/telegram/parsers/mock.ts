export const SELV = 1253919762

export function message (body: any) {
  if (body.cid == 'gold') {
    return `
XAUUSD BUY
ENTRADA: 1806

SL: 1796
TP1: 1808
TP2: 1812
TP3: 1821
`
  }

  if (body.cid == 'dowjoines') {
    return `
NAS100 SELL 14280
SL: 14360
TP: 14250
TP: 14200
TP: 14050
TP: 13900 PROPER RISK🔥
`
  }

  if (body.cid == 'moneybags') {
    return `
[Forwarded from MONEY BAGS PRO]
US30 BUY
ENTRADA: 35676

SL = 35576 (100 PIPS)
TP1 = 35696 (20 PIPS)
TP2 = 35716 (40 PIPS)
TP3 = 35736 (60 PIPS)
TP4 = 35776 (100 PIPS)
TP5 = 35796 (120 PIPS)
TP6 = 35826 (150 PIPS)
`
  }

  else
    return body.msg
}
