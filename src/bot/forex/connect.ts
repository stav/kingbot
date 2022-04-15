import { Fetch } from 'lib/web.ts'

import type ForConn from './forex.ts'

export async function login (this: ForConn) {
  const url = this.base + '/session'
  const method = 'POST'
  const headers = {
    "Content-Type": 'application/json',
  }
  const body = JSON.stringify({
    UserName: this.account.username,
    Password: this.account.password,
    AppKey: this.account.appKey,
    AppComments: "Kingbot",
    AppVersion: "1",
  })
  return await Fetch(url, { method, headers, body })
}

export async function connect (this: ForConn) {
  const response = await this.login()
  if (response.Session) {
    this.user = response
  }
  return response

}

export async function validate (this: ForConn) {
  const url = this.base + '/session/validate'
  const method = 'POST'
  const headers = {
    "Content-Type": 'application/json',
  }
  const body = JSON.stringify({
    UserName: this.account.username,
    Session: this.user.Session,
  })
  return await Fetch(url, { method, headers, body })
  // { IsAuthenticated: true }
}
