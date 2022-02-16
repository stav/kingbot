type Reflection = {
  props: string[]
  fields: string[]
  methods: string[]
}

const emptyReflection = {
  props: [],
  fields: [],
  methods: [],
} as Reflection

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
export function reflect(obj: any): Reflection {
  if (!obj) return emptyReflection;

  // deno-lint-ignore no-explicit-any
  let _obj: any = Object.assign(obj)

  const _methods = new Set<string>()

  // deno-lint-ignore no-cond-assign
  while (_obj = Reflect.getPrototypeOf(_obj)) {
    Reflect.ownKeys(_obj)
      .filter( k => !(<string>k).startsWith('__'))
      .filter( k => !ObjectProps.includes(k as string))
      .forEach( k => _methods.add(k as string) )
  }
  const methods = [..._methods]
  const fields = Object.getOwnPropertyNames(obj)
  const props = new Set([...fields, ...methods])

  return {
    props: [...props],
    fields,
    methods,
  }
}
