import type KingCount from './count.ts'

export interface KingConn {
  connect (kingcount?: KingCount): void;
  list (i: number): void;
  prompt (): string;
}
