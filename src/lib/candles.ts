/**
 * candles.ts
 *
 * Print horizontal candles:
 *
 *                        11450
 *                                          11470
 *                                                                    11500
 *     ============================================================================================================
 *     | 11428    | 11441 |  | 11453    | 11466    | 11478    | 11491 |  | 11503    | 11516    | 11528    | 11541
 *          ------------------O====C----------------------            |
 *     --------------------------C===O------------------              |
 *                        |     O=========================================C-------
 *                        |                 |         -----------C========O---------
 *                        |             --C=======================O-----------
 *
 * priceCandles() uses headers()
 **/
import { blue, green, red, yellow, inverse } from 'std/fmt/colors.ts'
import { sprintf } from 'std/fmt/printf.ts'

import { date, timestamp } from 'wire/wcf.ts'

import type { XapiPriceBarsConfig, XapiPriceBarsPricesConfig } from 'lib/config.d.ts'

import type { PriceBar } from './candles.d.ts'

const MAX_GRAPH_LENGTH = 108
const SPACER = 58

/**
 * Price headings
 *
 * @param low The lowest price of all the bars
 * @param diff The difference between the low price and high price
 * @param blockSize The number of characters for each unit (dollar)
 * @param prices Values are price numbers and keys are the labels
 * @returns A single string showing all the price headings
 */
function header (low: number, diff: number, blockSize: number, prices: XapiPriceBarsPricesConfig) {
  let headers = []
  let xLabel = ''

  for (let i=0; i<=9; i++) {
    xLabel += sprintf('| %-*d', 9, (low + i * diff / 9).toFixed(diff < 9 ? 1 : 0))
  }
  const xChars = xLabel.split('')

  for (const [label, price] of Object.entries(prices)) {
    const index = Math.floor((price - low) * blockSize)
    if (xChars[index] !== undefined) {
      headers.push(' '.repeat(index) + yellow(`${price} ${label}`))
      xChars[index] = yellow(xChars[index].replace(' ', '') || '|')
    }
  }
  headers.push('='.repeat(MAX_GRAPH_LENGTH))
  // Add in the left hand spacing and newline to each header
  headers = headers.map(h => ' '.repeat(SPACER) + h + '\n')
  headers.push(''
    + '                             Low    Open   Close    High  '
    + xChars.join('').trimEnd() + '\n')

  return headers.join('')
}

/**
 * Calculate the display of horizontal price candles for given price bars
 *
 * @param bars OHLC historical price data
 * @param priceConfig The input parameters for the price data and how to display it
 * @param zoom Should we zoom out to show all the desired price lines?
 * @returns A giant string to show all the candles with price headings
 */
export function priceCandles (bars: PriceBar[], priceConfig: XapiPriceBarsConfig, zoom: boolean) {
  const prices = Object.values(priceConfig.prices)
  const highs = bars.map(bar => bar.High)
  const lows = bars.map(bar => bar.Low)
  const high = Math.max(...highs, ...(zoom ? prices : []))
  const low = Math.min(...lows, ...(zoom ? prices : []))
  const diff = high - low
  const blockSize = MAX_GRAPH_LENGTH / diff

  console.log('priceCandles', {
    bars: bars.length,
    prices: prices.length,
    diff,
    blockSize,
  })

  let output = header(low, diff, blockSize, priceConfig.prices)

  for (const bar of bars) {
    // Init data points
    const lowOffset = bar.Low - low
    const lowBlocks = Math.floor(lowOffset * blockSize)
    const highOffset = bar.High - low - lowOffset
    const highBlocks = Math.floor(highOffset * blockSize)
    const openIndex = Math.round((bar.Open - bar.Low) / (bar.High - bar.Low) * highBlocks)
    const closeIndex = Math.round((bar.Close - bar.Low) / (bar.High - bar.Low) * highBlocks)
    const min = Math.min(openIndex, closeIndex)
    const max = Math.max(openIndex, closeIndex)
    const body = max > min ? '='.repeat(max - min - 1) : ''

    // Build candle
    let candle = '-'.repeat(highBlocks)
    candle = candle.substring(0, openIndex) + 'O' + candle.substring(openIndex + 1)
    candle = candle.substring(0, closeIndex) + 'C' + candle.substring(closeIndex + 1)
    candle = candle.substring(0, min + 1) + body + candle.substring(max + (max > min ? 0 : 1))

    // Build line graph
    let graph = ' '.repeat(lowBlocks+1) + candle + ' '.repeat(MAX_GRAPH_LENGTH)
    const cGraph = graph.split('')
    cGraph.length = MAX_GRAPH_LENGTH

    // Add price lines
    for (const price of prices) {
      const index = Math.floor((price - low) * blockSize) + 1
      if (cGraph[index] !== undefined)
        cGraph[index] = yellow(cGraph[index].replace(' ', '') || '|')
    }
    graph = cGraph.join('').trimEnd()

    // Color winner or loser
    graph = openIndex < closeIndex ? green(graph) : red(graph)

    // Output line including data and graph
    const line = (''
      + ''  + (date(bar.BarDate) || new Date()).toISOString()
      + ' ' + blue  (sprintf('%4.1f', bar.Low.toString()))
      + ' ' + red   (sprintf('%4.1f', bar.Open.toString()))
      + ' ' + yellow(sprintf('%4.1f', bar.Close.toString()))
      + ' ' + blue  (sprintf('%4.1f', bar.High.toString()))
      // + ' ' + yellow(sprintf('%2d', Math.round(lowOffset).toString()))
      // + ' ' + blue  (sprintf('%2d', lowBlocks.toString()))
      // + ' ' + blue  (sprintf('%2d', highBlocks.toString()))
      // + ' ' + yellow(sprintf('%2d', openIndex.toString()))
      // + ' ' + yellow(sprintf('%2d', closeIndex.toString()))
      + ' ' + graph
    )
    output += highlight(bar, line) + '\n'
  }

  /**
   * Inverse the colors for the given line if the given bar is configured
   *
   * @param bar OHLC price data
   * @param line The rendered candle with price line markings, if any
   * @returns The given line with colors inverted and labels added if needed
   */
  function highlight (bar: PriceBar, line: string) {
    const barTs = timestamp(bar.BarDate) || 0
    let label = ''

    for (const light of priceConfig.time.lights) {
      const ts = Date.parse(light[0])
      const d = (barTs - ts) / 1000
      if (d >= 0 && d < priceConfig.period * 60) {
        label += ' < ' + light.slice(1)
      }
    }
    return label ? inverse(line) + label : line
  }

  return output
}
