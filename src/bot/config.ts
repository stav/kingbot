import { parse } from 'https://deno.land/std@0.125.0/encoding/yaml.ts'

import type { ConfigContainer, InputContainer } from './config.d.ts'

const content = await Deno.readTextFile('.config/local.yaml')

export default parse(content) as ConfigContainer

export function input () {
  const input = Deno.readTextFileSync('.config/input.yaml')
  return parse(input) as InputContainer
}
