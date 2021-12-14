import config from '../../config.ts'
import KingSocket from './mod.ts'

export default function print (this: KingSocket) {
    const id = config.accountId
    const ses = this.session
    const url = this.url
    const stat = this.state()
    console.info(`Socket  ${url}  ${id}  ${stat}  ${ses}`)
}
