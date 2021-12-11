// deno-lint-ignore-file no-explicit-any
export interface XapiLoginResponse {
  status: true;
  streamSessionId: string;
}

interface XapiLogoutResponse {
  status: true;
}

export interface XapiDataResponse {
  status: true;
  returnData: any;
}

interface XapiErrorResponse {
  status: false;
  errorCode: string;
  errorDescr: string;
}

interface KingErrorResponse {
  status: false;
  errorCode: "K1NG";
  errorDescr: string;
}

type ErrorResponse = XapiErrorResponse | KingErrorResponse

type SuccessResponse = XapiLoginResponse | XapiLogoutResponse | XapiDataResponse

export type KingResponse = SuccessResponse | ErrorResponse
