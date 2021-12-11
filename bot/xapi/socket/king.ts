import { State } from './const.ts'
import config from './config.ts'
import Logger from '../../../log/mod.ts'

export default class KingSocket extends WebSocket {
  session = ''

  constructor (url: string) {
    super(url)
    this.onopen = this.print
    this.onclose = this._gotClose
    this.onerror = this._gotError
    this.onmessage = this._gotMessage
  }

  private _state () {
    return State[this.readyState]
  }

  private _gotClose (_event: CloseEvent) {
    this.session = ''
  }

  private _gotError (e: Event | ErrorEvent) {
    Logger.error((<ErrorEvent>e).message)
    this.print()
  }

  private _gotMessage (message: MessageEvent) {
    Logger.info(message.data)
  }

  // version () {
  //   const response: KingResponse = await sync({ command: 'getVersion' }, socket)
  //   return response.status ? (<XapiDataResponse>response).returnData.version : ''
  // }

  print () {
    const id = config.accountId
    const ses = this.session
    const url = this.url
    const stat = this._state()
    console.info(`Socket  ${url}  ${id}  ${stat}  ${ses}`)
  }

}
