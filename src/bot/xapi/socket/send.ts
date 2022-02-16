import { deadline, debounce, delay, DeadlineError } from 'std/async/mod.ts'
import { getLogger } from 'std/log/mod.ts'

import type { InputData, XapiResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

const TIMEOUT = 2000
const BURST = 4

let burst = BURST // We get throttled if burst gets down to zero
let throttled = false
const queue: string[] = []

function reset() {
  throttled = false
  burst = BURST
}
const resetDebounced = debounce(reset, TIMEOUT)

const throttleDebounced = debounce(xsocket => {
  reset()
  throttle(xsocket)
}, TIMEOUT)

function throttle(xsocket: WebSocket) {
  getLogger().info('throttle', 'THROTTLE', xsocket?.constructor?.name,
    'queue', queue.length,
    'burst', burst,
    'throttled', throttled,
  )
  if (queue.length) {
    if (throttled) {
      getLogger().info('throttle', 'Throttled, waiting')
      throttleDebounced(xsocket)
    }
    else {
      if (burst > 0) {
        burst--
        const x = queue.shift() as string
        getLogger().info('throttle', 'Not throttled, sending', x)
        xsocket?.send(x)
        throttle(xsocket)
      }
      else {
        getLogger().info('throttle', 'Not throttled, but bursted, so throttling')
        throttled = true
        throttle(xsocket)
      }
    }
  }
  else {
    resetDebounced()
  }
}

/**
 * send
 *
 * Send payload throttled via underlying socket.
 *
 * Does not wait for the result.
 *
 * Requires the underlying socket to be open.
 *
 * @class Becomes a method of the XapiSocket class.
 *
 * "Each command invocation should not contain more than 1kB of data."
 * "User should send requests in 200 ms intervals. This rule can be broken,
 *  but if it happens 6 times in a row the connection is dropped."
 * @see http://developers.xstore.pro/documentation/#connection-validation
 *
 * @param data The payload to send
 * @returns Nothing
 */
export function send (this: XapiSocket, data: InputData) {
  if (this.socket && this.isOpen) {
    const tag = JSON.stringify(data.customTag)
    const json = JSON.stringify(data)
    const command = JSON.stringify(data.command)
    getLogger().info(`send(): queue.push(${json.length}/${command}) "${json}"`, tag)
    queue.push(json)
    throttle(this.socket)
  }
}

/**
 * sync
 *
 * Syncronous send.
 *
 * Waits for the result.
 *
 * 1. Generate a unique string so we can filter responses for the one we send,
 * 2. Send our payload data
 * 2. Listen to messages for the particular one we sent (customTag),
 * 4. Return the result.
 *
 * @see send
 *
 * @param data The payload to send
 * @returns The response payload
 */
export async function sync (this: XapiSocket, data: InputData): Promise<XapiResponse> {
  if (!this.isOpen) { return { status: false, errorCode: 'K1NG', errorDescr: 'Sync Connection Closed' }}

  // Function to Listen for messages with custom tag
  const listener = (message: MessageEvent) => {
    const mData = JSON.parse(message.data)
    if (mData.customTag === customTag) {
      result = mData
      this.socket?.removeEventListener('message', listener)
    }
  }
  this.socket?.addEventListener('message', listener)

  // Function to Wait for result
  async function wait () { while (!result) await delay(200) }

  // 1. Send data
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  this.send(_data)

  // 2. Wait for Result 2 seconds max
  // deno-lint-ignore no-explicit-any
  let result: any
  try {
    await deadline(wait(), 2000)
  }

  // 3. Check for Timeout
  catch (e) {
    if (e instanceof DeadlineError)
      result = { status: false, errorCode: 'K1NG', errorDescr: 'Sync Timeout' }
    else throw e
  }

  // 4. Return the Result
  return result
}
