import Logger from '../log.ts'

/** bind
 *
 * Recursive binding to connection properties via text string.
 *
 * Note: This impure function mogrifies the `props` argument.
 *
 * @param c     - The object in question.
 * @param props - The property path to traverse.
 */
// deno-lint-ignore no-explicit-any
export function bind(c: any, props: string[]): any {
  Logger.info()
  Logger.info(`c="${c?.constructor?.name}", props=${JSON.stringify(props)}, length=${props.length}`)
  const prop = props.shift()
  Logger.info(`prop="${prop}"`)
  if (c && prop) {
    Logger.info(' BIND '
                + `${c.constructor?.name || typeof c}.${prop}`
                + ' = '
                + `(${typeof c[prop]}) `
                + `${c[prop]?.name||''}`,
      Deno.inspect(c[prop], { depth: 1, iterableLimit: 3 }),
      prop in c,
      props.length
    )
    if (prop in c)
      return (props.length)
        ? bind(c[prop], props)
        : typeof c[prop] === 'function'
          ? c[prop].bind(c)
          : c[prop]
  }
}
