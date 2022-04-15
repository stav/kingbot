type PriceBar = {
  BarDate: string, // "/Date(1649946960000)/"
  Open: number,
  High: number,
  Low: number,
  Close: number,
}

export type PriceBars = {
  PriceBars: PriceBar[],
  PartialPriceBar: PriceBar,
}
