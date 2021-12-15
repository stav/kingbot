import { KingCat } from './mod.ts'

import config from './config.ts'

export default function print (this: KingCat) {
  const id = config.accountId
  const ses = this.session
  const url = this.socket?.url
  const stat = this.state()
  const name = this.constructor.name
  console.info(`${name}  ${url}  ${id}  ${stat}  ${ses}`)
}
