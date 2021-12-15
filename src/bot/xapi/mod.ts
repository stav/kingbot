enum State {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

export class KingCat {

  socket: WebSocket | null = null
  session = ''

  protected state (): string | undefined {
    if (this.socket)
      return State[this.socket.readyState]
  }

  private _isOpen (): boolean {
    return this.socket?.readyState === State.OPEN
  }

  get isOpen (): boolean {
    return this._isOpen()
  }

}

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
