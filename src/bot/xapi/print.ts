import { KingCat } from './mod.ts'

export default function print (this: KingCat) {
  const id = this.account.accountId
  const ses = this.session
  const url = this.socket?.url
  const stat = this.state()
  const name = this.constructor.name
  console.info(`${name}  ${url}  ${id}  ${stat}  ${ses}`)
}
