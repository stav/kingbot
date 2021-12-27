import type { InputData, XapiResponse, XapiDataResponse } from './socket.d.ts'
import type XapiSocket from './socket.ts'

export default function story (this: XapiSocket) {
  this.print()

  const fetch = async (command: string) => {
    const data: InputData = { command }
    const response: XapiResponse = await this.sync(data)
    const returnData = (<XapiDataResponse>response).returnData
    console.info(returnData)
  }
  const commands = [
    'getCurrentUserData',
    'getMarginLevel',
    'getVersion',
    'getServerTime',
  ]
  // Throttle commands
  const interval = 200
  let timeout = -interval
  commands.map(c => setTimeout(() => fetch(c), timeout += interval))
}
