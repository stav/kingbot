export interface KingConn {
  connect (): void
  prompt (): string
  close (): void
  list (i: number): void
}
