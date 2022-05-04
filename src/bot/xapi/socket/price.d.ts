export type CHART_LAST_INFO_RECORD = {
  period: 1 | 5 | 15 | 30 | 60 | 240 | 1440 | 10080 | 43200
  symbol: string
  start: number // Start of chart block (rounded down to the nearest interval)
}

export type CHART_RANGE_INFO_RECORD = {
  period: 1 | 5 | 15 | 30 | 60 | 240 | 1440 | 10080 | 43200
  symbol: string
  start: number // Start of chart block (rounded down to the nearest interval)
  end: number   // End of chart block (rounded down, ignored if ticks is non-zero)
  ticks: number // (Optional) Candles prior to start (-N) or after start (+N)
}

export type PriceArguments = [
  'getChartLastRequest' | 'getChartRangeRequest',
  { info: CHART_LAST_INFO_RECORD | CHART_RANGE_INFO_RECORD }
]

export type RATE_INFO_RECORD = {
  ctm: number       // CET/CEST time zone needs to be converted to UTC
  ctmString: string // CET/CEST "Apr 29, 2022, 12:00:00 AM"
  open: number      // Open price (in base currency * 10**digits)
  close: number     // Value of close price (shift from open price)
  high: number      // Highest value in the given period (shift from open price)
  low: number       // Lowest value in the given period (shift from open price)
  vol: number       // Volume in lots
}

export type chartHistory = {
  digits: number // Number of decimal places
  rateInfos: RATE_INFO_RECORD[]
}
