import type KingCount from './count.ts'

type InputGenerator = AsyncGenerator<string, void, void>

/** getInput
 *
 * Standard input generator
 *
 * @yields {string} Multi-character input without the newline.
 */
export default async function* getInput (kingcount: KingCount): InputGenerator {
  // https://github.com/dmitriytat/keypress/blob/master/mod.ts
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const EOL = null
  let n

  while (n !== EOL) {
    const buffer = new Uint8Array(1024)
    await Deno.stdout.write(encoder.encode(kingcount.prompt))
    n = <number>await Deno.stdin.read(buffer)
    const input = decoder.decode(buffer.subarray(0, n))
    yield input.trim() // Remove the newline
  }
}
