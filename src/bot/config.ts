import { parse } from 'https://deno.land/std/encoding/yaml.ts'

import type { ConfigContainer } from './config.d.ts'

const content = await Deno.readTextFile('.config/local.yaml')

export default parse(content) as ConfigContainer
