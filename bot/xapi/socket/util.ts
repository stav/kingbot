import { State } from './const.ts'
import config from './config.ts'

export function isOpen (socket: WebSocket): boolean {
  return socket?.readyState === State.OPEN
}

export function state (socket: WebSocket): string {
  return State[socket?.readyState]
}

export function status (socket: WebSocket): string {
  const id = config.accountId
  const url = socket.url
  const stat = state(socket)
  return `Socket ${url} ${id} ${stat}`
}

export function cprint (this: WebSocket): void {
  console.log(status(this))
}
