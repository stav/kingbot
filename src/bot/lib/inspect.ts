const ObjectProps = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "toLocaleString",
]

// deno-lint-ignore no-explicit-any
export function inspect(this: any): void {
  try {
    console.log('1', Deno.inspect(this, { depth: 1 }))
    console.log('2', this.constructor)
    console.log('3', Object.getPrototypeOf(this))
    console.log('4', JSON.stringify(this))
    console.log('5', Object.keys(this))
    console.log('6', Object.getOwnPropertyNames(this))
  } catch (_e) {/**/}

  for (const key in this) {
    let v = this[key]
    const type = typeof v
    const json = JSON.stringify(v)
    if (json?.length > 99) v = json
    console.log('>', type, key, v)
  }

  // deno-lint-ignore no-explicit-any
  let obj: any = Object.assign(this)

  const methods = new Set()

  // deno-lint-ignore no-cond-assign
  while (obj = Reflect.getPrototypeOf(obj)) {
    Reflect.ownKeys(obj)
      .filter( k => !(<string>k).startsWith('__'))
      .filter( k => !ObjectProps.includes(k as string))
      .forEach( k => methods.add(k) )
  }

  methods.forEach(key => {
    const v = this[key as string]
    console.log('$', typeof v, key, v)
  })
}
