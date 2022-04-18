import { deadline, delay, DeadlineError } from 'std/async/mod.ts'
import { getLogger } from 'std/log/mod.ts'

import type { InputData, XapiResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

/**
 * send
 *
 * Asyncronous send, do not wait for the result.
 *
 * This function requires the underlying socket to be open.
 *
 * This function becomes a method of the XapiSocket class.
 *
 * WARNING: Exposes passwords in send log (not default log)
 *
 * "Each command invocation should not contain more than 1kB of data."
 * "User should send requests in 200 ms intervals. This rule can be broken,
 *  but if it happens 6 times in a row the connection is dropped."
 * @see http://developers.xstore.pro/documentation/#connection-validation
 * @todo Throttle requests
 *
 * @param data The payload to send
 * @returns Nothing
 */
 export function send (this: XapiSocket, data: InputData) {
  if (this.isOpen) {
    getLogger('sending').info('Sending', data)

    this.socket?.send(JSON.stringify(data))

    if (data.command !== 'ping') {
      if (data.command === 'login')
        data.arguments.password = '<REDACTED>'
      getLogger().info('Sending', data)
    }
  }
}

/**
 * sync
 *
 * Syncronous send.
 *
 * 1. Generate a unique string so we can filter responses for the one we send,
 * 2. Send our payload data
 * 2. Listen to messages for the particular one we sent (customTag),
 * 4. Return the result.
 *
 * This function requires the underlying socket to be open.
 *
 * This function becomes a method of the XapiSocket class.
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
  const customTag = `${Math.random()} ${data.customTag || ''}`.trim()
  const _data = Object.assign({}, data, { customTag })
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
