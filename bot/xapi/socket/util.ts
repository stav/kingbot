import { State } from './const.ts'

export function isOpen (socket: WebSocket): boolean {
  return socket?.readyState === State.OPEN
}
