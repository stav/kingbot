import { Status } from './const.ts'

export function isOpen(socket: WebSocket): boolean {
  return socket?.readyState === Status.OPEN
}

export function status(socket: WebSocket): string {
  return Status[socket?.readyState]
}
