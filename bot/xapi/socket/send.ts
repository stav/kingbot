import { InputData } from './socket.d.ts'
import { isOpen } from './util.ts'

export function send(data: InputData, socket: WebSocket): void {
  if (!isOpen(socket)) {
    return console.error('Cannot send, socket is not open', socket)
  }
  socket.send(JSON.stringify(data))
}

export async function sync (data: InputData, socket: WebSocket): Promise<any> {
  // TODO Also check for logged in
  if (!isOpen(socket)) {
    return console.error('Cannot sync, socket is not open', socket)
  }
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  let result: any

  function listener(event: MessageEvent) {
    const response = JSON.parse(event.data)
    if (response.customTag === customTag) {
      result = response.returnData
    }
  }
  socket.addEventListener('message', listener, { once: true })
  send(_data, socket)

  // TODO Timeout eventually, don't wait forever
  while (!result) {
    console.log('wait')
    await new Promise(res => setTimeout(res, 100))
  }

  return result
}
