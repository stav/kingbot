// deno-lint-ignore-file no-explicit-any
import { KingResponse } from './send.d.ts'
import { InputData } from './socket.d.ts'
import { isOpen } from './util.ts'
import KingSocket from './king.ts'
import Logger from '../../../log/mod.ts'

export function send(data: InputData, socket: KingSocket): void {
  if (isOpen(socket)) {
    socket.send(JSON.stringify(data))
  }
}

export async function sync (data: InputData, socket: KingSocket): Promise<KingResponse> {
  // TODO Also check for logged in
  if (!isOpen(socket)) { return { status: false, errorCode: 'K1NG', errorDescr: 'Closed' }}
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  let timeout = 0
  let result: any

  Logger.info('Syncing', JSON.stringify(_data))

  function listener(message: MessageEvent) {
    const data = JSON.parse(message.data)
    if (data.customTag === customTag) {
      result = data
    }
  }
  socket.addEventListener('message', listener, { once: true })
  send(_data, socket)

  while (!result) {
    if (++timeout > 10) {
      result = { status: false, errorCode: 'K1NG', errorDescr: 'Timeout' }
    }
    else {
      console.log('wait')
      await new Promise(res => setTimeout(res, 100)) // Sleep
    }
  }

  return result
}
