import Logger from '../../../log.ts'

import type { InputData, XapiResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

export function send (this: XapiSocket, data: InputData) {
  if (this.isOpen) {
    this.socket?.send(JSON.stringify(data))
  }
}

export async function sync (this: XapiSocket, data: InputData): Promise<XapiResponse> {
  // TODO Also check for logged in
  if (!this.isOpen) { return { status: false, errorCode: 'K1NG', errorDescr: 'Closed' }}
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  let timeout = 0
  // deno-lint-ignore no-explicit-any
  let result: any

  Logger.info('Syncing', JSON.stringify(_data))

  const listener = (message: MessageEvent) => {
    const mData = JSON.parse(message.data)
    if (mData.customTag === customTag) {
      result = mData
      this.socket?.removeEventListener('message', listener)
    }
  }
  this.socket?.addEventListener('message', listener)
  this.send(_data)

  while (!result) {
    if (++timeout > 10) {
      result = { status: false, errorCode: 'K1NG', errorDescr: 'Timeout' }
    }
    else {
      console.log('wait')
      await new Promise(res => setTimeout(res, 200)) // Sleep
    }
  }

  return result
}
