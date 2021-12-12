import Logger from '../../../log.ts'
import { InputData, KingResponse } from './king.d.ts'
import { State } from './const.ts'
import config from './config.ts'

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

  get isOpen (): boolean {
    return this.readyState === State.OPEN
  }

  sendx (data: InputData): void {
    if (this.isOpen) {
      this.send(JSON.stringify(data))
    }
  }

  async sync (data: InputData): Promise<KingResponse> {
    // TODO Also check for logged in
    if (!this.isOpen) { return { status: false, errorCode: 'K1NG', errorDescr: 'Closed' }}
    const customTag = Math.random().toString()
    const _data = Object.assign({ customTag }, data)
    let timeout = 0
    // deno-lint-ignore no-explicit-any
    let result: any

    Logger.info('Syncing', JSON.stringify(_data))

    function listener(message: MessageEvent) {
      const data = JSON.parse(message.data)
      if (data.customTag === customTag) {
        result = data
      }
    }
    this.addEventListener('message', listener, { once: true })
    this.sendx(_data)

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

  print () {
    const id = config.accountId
    const ses = this.session
    const url = this.url
    const stat = this._state()
    console.info(`Socket  ${url}  ${id}  ${stat}  ${ses}`)
  }

}
