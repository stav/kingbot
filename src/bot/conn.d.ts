export interface KingConn {
  connect (): void;
  list (i: number): void;
  prompt (): string;
}
