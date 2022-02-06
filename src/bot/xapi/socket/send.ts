import { deadline, delay, DeadlineError } from 'https://deno.land/std/async/mod.ts'

import Logger from '../../../log.ts'

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
 * @param data The payload to send
 * @returns Nothing
 */
 export function send (this: XapiSocket, data: InputData) {
  if (this.isOpen) {
    this.socket?.send(JSON.stringify(data))
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
  if (!this.isOpen) { return { status: false, errorCode: 'K1NG', errorDescr: 'Closed' }}

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
  // deno-lint-ignore no-explicit-any
  let result: any
  async function wait (resolve: (value: void) => void) {
    while (!result) {
      console.log('wait')
      await delay(200)
    }
    resolve()
  }

  // 1. Send data
  const customTag = Math.random().toString()
  const _data = Object.assign({ customTag }, data)
  Logger.info('Syncing', JSON.stringify(_data))
  this.send(_data)

  // 2. Wait for Result 2 seconds max
  try {
    await deadline(new Promise(wait), 2000)
  }

  // 3. Check for Timeout
  catch (e) {
    if (e instanceof DeadlineError)
      result = { status: false, errorCode: 'K1NG', errorDescr: 'Timeout' }
    else throw e
  }

  // 4. Return the Result
  return result
}
