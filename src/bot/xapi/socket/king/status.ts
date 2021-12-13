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

  fetch('getCurrentUserData')
  fetch('getMarginLevel')
  fetch('getVersion')
  fetch('getServerTime')
}
