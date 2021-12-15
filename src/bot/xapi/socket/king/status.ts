import { InputData, KingResponse, XapiDataResponse } from './mod.d.ts'
import KingSocket from './mod.ts'

export default function status (this: KingSocket) {
  this.print()

  const fetch = async (command: string) => {
    const data: InputData = { command }
    const response: KingResponse = await this.sync(data)
    const returnData = (<XapiDataResponse>response).returnData
    console.log(returnData)
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
