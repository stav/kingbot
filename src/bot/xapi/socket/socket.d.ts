// deno-lint-ignore-file no-explicit-any

/* Input */

export type InputData = {
  command: string
  arguments?: any
  customTag?: string
  prettyPrint?: boolean
}

/* Responses */

export interface XapiLoginResponse {
  status: true
  streamSessionId: string
}

interface XapiLogoutResponse {
  status: true
}

export interface XapiDataResponse {
  status: true
  returnData: any
  customTag: string
}

interface XapiErrorResponse {
  status: false
  errorCode: string
  errorDescr: string
}

interface KingErrorResponse {
  status: false
  errorCode: "K1NG"
  errorDescr: string
}

export type ErrorResponse = XapiErrorResponse | KingErrorResponse

type SuccessResponse = XapiLoginResponse | XapiLogoutResponse | XapiDataResponse

export type XapiResponse = SuccessResponse | ErrorResponse
