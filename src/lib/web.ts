// deno-lint-ignore no-explicit-any
export async function Fetch (target: string | Request, options?: any): Promise<any> {
  const response = await fetch(target, options)
  if (response.ok) {
    return await response.json()
  }
  console.error(target, options, await response.text())
  return response
}
