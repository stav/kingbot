import { parse } from 'std/encoding/yaml.ts'

import type { ConfigContainer, InputContainer } from './config.d.ts'

export default function () {
  const content = Deno.readTextFileSync('.config/local.yaml')
  return parse(content) as ConfigContainer
}

export function input () {
  const input = Deno.readTextFileSync('.config/input.yaml')
  return parse(input) as InputContainer
}
