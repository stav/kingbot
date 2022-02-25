export enum CMD_FIELD {
  BUY = 0,
  SELL = 1,
  BUY_LIMIT = 2,
  SELL_LIMIT = 3,
  BUY_STOP = 4,
  SELL_STOP = 5,
  BALANCE = 6,
  CREDIT = 7,
}

export enum TYPE_FIELD {
  OPEN = 0,
  PENDING = 1,
  CLOSE = 2,
  MODIFY = 3,
  DELETE = 4,
}

export enum REQUEST_STATUS_FIELD {
  ERROR = 0,
  PENDING = 1,
  ACCEPTED = 3,
  REJECTED = 4,
}
