import { blue, green, red, yellow } from "std/fmt/colors.ts"
import { sprintf } from 'std/fmt/printf.ts'

import { date } from 'wire/wcf.ts'

import type { PriceBars } from './candles.d.ts'

export function priceCandles (prices: PriceBars, price?: number) {
  let output = ''
  // Function scope finals
  const bars = prices.PriceBars
  const lows = bars.map(bar => bar.Low)
  const highs = bars.map(bar => bar.High)
  const high = Math.max(...highs)
  const low = Math.min(...lows)
  const diff = high - low
  const blockSize = 100 / diff
  const colWidth = Math.ceil(blockSize) - blockSize/3

  // Debug print finals
  console.debug(
    low, high,
    diff.toFixed(1),
    green(blockSize.toFixed(1)),
    colWidth.toFixed(1),
    prices.PartialPriceBar,
  )

  // Print header
  let header = ' '.repeat(69)
  for (let i=0; i<=9; i++)
    header += sprintf('| %-*d', 9, (low + i * diff / 9).toFixed(diff < 9 ? 1 : 0))
  if (price) {
    const index = (price - low) * blockSize + 69
    const char = yellow(header.charAt(index).replace(' ', '') || '|')
    header = header.substring(0, index) + char + header.substring(index + 1)
  }
  output += header.trimEnd() + '\n'

  // Loop thru bars printing candles
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
    let graph = ' '.repeat(lowBlocks+1) + candle
    if (price) {
      const index = (price - low) * blockSize + 1
      graph += ' '.repeat(100)
      const char = yellow(graph.charAt(index).replace(' ', '') || '|')
      graph = graph.substring(0, index) + char + graph.substring(index + 1)
      graph = graph.trimEnd()
    }
    graph = openIndex < closeIndex ? green(graph) : red(graph)

    // Output line including data and graph
    output += (''
      + ''  + (date(bar.BarDate) || new Date()).toISOString()
      + ' ' + blue  (sprintf('%4.1f', bar.Low.toString()))
      + ' ' + red   (sprintf('%4.1f', bar.Open.toString()))
      + ' ' + yellow(sprintf('%4.1f', bar.Close.toString()))
      + ' ' + blue  (sprintf('%4.1f', bar.High.toString()))
      + ' ' + yellow(sprintf('%2d', Math.round(lowOffset).toString()))
      + ' ' + blue  (sprintf('%2d', lowBlocks.toString()))
      + ' ' + blue  (sprintf('%2d', highBlocks.toString()))
      + ' ' + yellow(sprintf('%2d', openIndex.toString()))
      + ' ' + yellow(sprintf('%2d', closeIndex.toString()))
      + ' ' + graph + '\n'
    )
  }
  return output

}
