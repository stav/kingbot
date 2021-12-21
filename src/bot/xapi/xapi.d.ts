// deno-lint-ignore-file
import type { CMD_FIELD, TYPE_FIELD } from './xapi.ts'

declare enum STATE_FIELD {
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export type Account = {
  id: number
  pw?: string
  name: string
  type: 'real' | 'demo'
}

export type ConfigAccount = {
  accountId: number
  password: string
  name: string
  type: 'real' | 'demo'
}

export type ConfigXapi = {
  Accounts: ConfigAccount[]
}

export type ConfigContainer = {
  Xapi: ConfigXapi
}

export interface TRADE_RECORD {
  close_price: number;
  close_time: number;
  closed: boolean;
  cmd: CMD_FIELD;
  comment: string;
  commission: number;
  customComment: string;
  digits: number;
  expiration: number;
  margin_rate: number;
  offset: number;
  open_price: number;
  open_time: number;
  order: number;
  order2: number;
  position: number;
  profit: number;
  sl: number;
  storage: number;
  symbol: string;
  tp: number;
  volume: number;
  timestamp?: number;
  open_timeString?: string;
  close_timeString?: string;
  expirationString?: string;
  type?: TYPE_FIELD;
  state?: STATE_FIELD;
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
