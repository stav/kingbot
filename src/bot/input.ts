const EOL = null

/** getInput
 *
 * Standard input generator
 *
 * @yields {string} Multi-character input without the newline.
 */
export default async function* getInput (): AsyncGenerator<string, void, void> {
  // https://github.com/dmitriytat/keypress/blob/master/mod.ts
  const prompt = new TextEncoder().encode('\n> ')
  const decoder = new TextDecoder()
  let n

  while (n !== EOL) {
    const buffer = new Uint8Array(1024)
    const reader = Deno.stdin.read(buffer)
    Deno.stdout.write(prompt)
    n = <number>await reader
    const input: string = decoder.decode(buffer.subarray(0, n))
    yield input.trim() // Remove the newline
  }
}
