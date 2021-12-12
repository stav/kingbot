// deno-lint-ignore-file no-explicit-any
async function logMessageToFile (path: string, data: Uint8Array) {
  try {
    await Deno.writeFile(path, data, { append: true })
  }
  catch (e: unknown) {
    console.error(e)
  }
}

async function logMessagesToFile (fileName: string, ...messages: any[]) {
  const encoder = new TextEncoder()
  const _m = [ new Date().toUTCString(), ...messages ]
  const data = encoder.encode(_m + '\n')
  const path = `./logs/${fileName}.jsonl`
  await logMessageToFile(path, data)
}

export default abstract class Logger {

  static info(...messages: any[]) {
    logMessagesToFile('combined', ...messages)
  }

  static error(e?: unknown, ...optionalParams: any[]): void {
    logMessagesToFile('combined', e, ...optionalParams)
  }

  static file(fileName: string, ...content: any[]): void {
    logMessagesToFile(fileName, ...content)
  }

}
