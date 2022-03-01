import type { CMD_FIELD, TYPE_FIELD, REQUEST_STATUS_FIELD } from './xapi.ts'

declare enum STATE_FIELD {
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export interface TICK_RECORD {
  ask: number
  askVolume: number
  bid: number
  bidVolume: number
  high: number
  level: number
  low: number
  spreadRaw: number
  spreadTable: number
  symbol: string
  timestamp: number
}

export interface STREAMING_TRADE_RECORD {
  close_price: number
  close_time: number
  closed: boolean
  cmd: CMD_FIELD
  comment: string
  commission: number
  customComment: string
  digits: number
  expiration: number
  margin_rate: number
  offset: number
  open_price: number
  open_time: number
  order: number
  order2: number
  position: number
  profit: number
  sl: number
  storage: number
  symbol: string
  tp: number
  volume: number
  type: TYPE_FIELD
  state: STATE_FIELD
}

export interface TRADE_RECORD {
  close_price: number
  close_time: number
  closed: boolean
  cmd: CMD_FIELD
  comment: string
  commission: number
  customComment: string
  digits: number
  expiration: number
  margin_rate: number
  offset: number
  open_price: number
  open_time: number
  order: number
  order2: number
  position: number
  profit: number
  sl: number
  storage: number
  symbol: string
  tp: number
  volume: number
  timestamp?: number
  open_timeString?: string
  close_timeString?: string
  expirationString?: string
  type?: TYPE_FIELD
  state?: STATE_FIELD
}

export interface TRADE_TRANS_INFO {
  cmd: CMD_FIELD
  customComment: string | null
  expiration: number | Date
  offset: number
  order: number
  price: number
  sl: number
  symbol: string
  tp: number
  type: TYPE_FIELD
  volume: number
}

export interface STREAMING_TRADE_STATUS_RECORD {
  customComment: string | null
  message: string | null
  order: number
  price: number | null
  requestStatus: REQUEST_STATUS_FIELD | null
}
