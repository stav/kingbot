import * as log from 'std/log/mod.ts'

/** bind
 *
 * Recursive binding to connection properties via text string.
 *
 * Note: This impure function mogrifies the `props` argument.
 *
 * @param c         - The object in question.
 * @param props     - The property path to traverse.
 * @param recursing - Will be set to true once we start recursing.
 */
// deno-lint-ignore no-explicit-any
export function bind (c: any, props: string[], recursing = false): any {

  const logg = (...msg: unknown[]) => log.getLogger().info(msg)

  const cname = c?.constructor?.name || typeof c

  if (!recursing) logg(); // Log blank line for top of recursion

  function _log () {
    if (prop) // Duplicate check for prop to make linter happy
      logg(
        ` ${cname}.${prop}`
          + ' = '
          + `(${typeof c[prop]}) `
          + `${c[prop]?.name||''}`,
        Deno.inspect(c[prop], { depth: 1, iterableLimit: 3 }),
        prop in c,
        props.length
      )
  }

  logg(`BIND c="${cname}" props(${props.length})=${JSON.stringify(props)}`)

  const prop = props.shift()

  logg(` prop="${prop}"`)

  if (c && prop) {
    _log()
    if (prop in c)
      return (props.length)
        ? bind(c[prop], props, true)
        : typeof c[prop] === 'function'
          ? c[prop].bind(c)
          : c[prop]
  }
}
