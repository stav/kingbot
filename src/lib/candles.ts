import { blue, green, red, yellow, inverse } from 'std/fmt/colors.ts'
import { sprintf } from 'std/fmt/printf.ts'

import { date, timestamp } from 'wire/wcf.ts'

import type { XapiPriceBarsConfig } from 'lib/config.d.ts'

import type { PriceBar } from './candles.d.ts'

const MAX_GRAPH_LENGTH = 108
const SPACER = 58

function header (low: number, diff: number, blockSize: number, prices: number[]) {
  let header = ''

  for (let i=0; i<=9; i++) {
    header += sprintf('| %-*d', 9, (low + i * diff / 9).toFixed(diff < 9 ? 1 : 0))
  }
  const chars = header.split('')

  for (const price of prices) {
    const index = Math.floor((price - low) * blockSize)
    if (chars[index] !== undefined)
      chars[index] = yellow(chars[index].replace(' ', '') || '|')
  }
  return ' '.repeat(SPACER) + chars.join('').trimEnd() + '\n'
}

export function priceCandles (bars: PriceBar[], priceConfig: XapiPriceBarsConfig) {
  const highs = bars.map(bar => bar.High)
  const lows = bars.map(bar => bar.Low)
  const high = Math.max(...highs)
  const low = Math.min(...lows)
  const diff = high - low
  const blockSize = 100 / diff

  console.log(bars.length, priceConfig.time, priceConfig.prices.length)

  let output = header(low, diff, blockSize, priceConfig.prices)

  let highlit = false

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
    for (const price of priceConfig.prices) {
      const index = Math.floor((price - low) * blockSize) + 1
      if (cGraph[index] !== undefined)
        cGraph[index] = yellow(cGraph[index].replace(' ', '') || '|')
    }
    graph = cGraph.join('').trimEnd()

    // Color winner or loser
    graph = openIndex < closeIndex ? green(graph) : red(graph)

    // Output line including data and graph
    let line = (''
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
      + ' ' + graph + '\n'
    )
    const ts = Date.parse(priceConfig.time.light)
    const barTs = timestamp(bar.BarDate) || 0
    if (barTs - ts > 0 && !highlit) {
      line = inverse(line)
      highlit = true
    }
    output += line
  }
  return output

}
