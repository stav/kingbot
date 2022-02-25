export function human (o: { h?: number, m?: number, s?: number }) {
  let { h, m, s } = o
  h = h ?? 0
  m = m ?? 0
  s = s ?? 0
  while (s > 60) { m++; s -= 60 }
  while (m > 60) { h++; m -= 60 }
  return `${Math.floor(h)}h${Math.floor(m)}m${Math.floor(s)}s`
}
