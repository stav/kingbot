// deno-lint-ignore-file

export declare enum CMD_FIELD {
  BUY = 0,
  SELL = 1,
  BUY_LIMIT = 2,
  SELL_LIMIT = 3,
  BUY_STOP = 4,
  SELL_STOP = 5,
  BALANCE = 6,
  CREDIT = 7,
}

export declare enum TYPE_FIELD {
  OPEN = 0,
  PENDING = 1,
  CLOSE = 2,
  MODIFY = 3,
  DELETE = 4,
}

export declare enum STATE_FIELD {
  MODIFIED = "Modified",
  DELETED = "Deleted",
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