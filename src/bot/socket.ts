
enum State {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

export default abstract class Socket {

  socket: WebSocket | null = null

  protected get state (): string | undefined {
    return this.socket ? State[this.socket.readyState] : undefined
  }

  protected get isOpen (): boolean {
    return this.socket?.readyState === State.OPEN
  }

}
