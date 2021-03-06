import { getLogger } from 'std/log/mod.ts'

/** bind
 *
 * Recursive binding to connection properties via text string.
 *
 * Note: This impure function mogrifies the `props` argument.
 *
 * @param c         - The object in question.
 * @param props     - The property path to traverse.
 */
// deno-lint-ignore no-explicit-any
export function bind (c: any, props: string[]): any {

  const logger = getLogger('binding')

  const cname = c?.constructor?.name || typeof c

  function log () {
    if (prop) // Duplicate check for prop to make linter happy
      logger.info(
        ` ${cname}.${prop}`
          + ' = '
          + `(${typeof c[prop]}) `
          + `${c[prop]?.name||''}`,
        Deno.inspect(c[prop], { depth: 1, iterableLimit: 3 }),
        prop in c,
        props.length
      )
  }

  logger.info(`BIND c="${cname}" props(${props.length})=${JSON.stringify(props)}`)

  const prop = props.shift()

  logger.info(` prop="${prop}"`)

  if (c && prop) {
    log()
    if (prop in c)
      return (props.length)
        ? bind(c[prop], props)
        : typeof c[prop] === 'function'
          ? c[prop].bind(c)
          : c[prop]
  }
}
