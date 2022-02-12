import { encode as b64encode } from 'https://deno.land/std@0.125.0/encoding/base64.ts'

async function importKey (secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
                                'raw', //      format: "raw" | "pkcs8" | "spki"
     new TextEncoder().encode(secret), //     keyData: BufferSource
    { name: 'HMAC', hash: 'SHA-256' }, //   algorithm: AlgorithmIdentifier
                               false , // extractable: boolean
                             ['sign'], //   keyUsages: KeyUsage[ sign, verify ]
  )
}

export default async function sign (data: string, secret: string): Promise<string> {
  // https://stackoverflow.com/questions/65805172#answer-65807243
  const key: CryptoKey = await importKey(secret)
  const encodedData = new TextEncoder().encode(data).buffer
  const signedData = await crypto.subtle.sign('HMAC', key , encodedData)
  const signature = b64encode(new Uint8Array(signedData))
  return signature
}
