import { parse } from 'std/encoding/yaml.ts'

import type {
  ExchangeConfigContainer,
  TelegramConfigContainer,
  InputContainer,
} from './config.d.ts'

export function Exchange () {
  const content = Deno.readTextFileSync('.config/exchange.yaml')
  return parse(content) as ExchangeConfigContainer
}

export function Telegram () {
  const content = Deno.readTextFileSync('.config/telegram.yaml')
  return parse(content) as TelegramConfigContainer
}

export function input () {
  const input = Deno.readTextFileSync('.config/input.yaml')
  return parse(input) as InputContainer
}
