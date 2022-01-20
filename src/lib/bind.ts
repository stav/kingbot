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
  if (prop) {
    Logger.info(' BIND '
                + `${c.constructor.name}.${prop}`
                + ' = '
                + `(${typeof c[prop]}) `
                + `${c[prop]?.name||''}`,
      JSON.stringify(c[prop]),
      prop in c,
      props.length
    )
    if (prop in c)
      return props.length
        ? bind(c[prop], props)
        : typeof c[prop] === 'function'
          ? c[prop].bind(c)
          : c[prop]
  }
}
