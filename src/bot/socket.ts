import { inspect } from 'lib/inspect.ts'

enum State {
  CONNECTING = 0,
  OPEN       = 1,
  CLOSING    = 2,
  CLOSED     = 3,
}

export default abstract class Socket {

  socket: WebSocket | null = null
  inspect: () => void = inspect

  protected get state (): string {
    const readyState = this.socket?.readyState || State.CLOSED
    return State[readyState]
  }

  get isOpen (): boolean {
    return this.socket?.readyState === State.OPEN
  }

}
