export interface TelegramSignal {
  symbol: string,
  volume: number,
  entry: number,
  type: 'BUY' | 'SELL',
  tps: number[],
  sl: number,
}
