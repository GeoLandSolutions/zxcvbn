export interface ISortable {
  i: number;
  j: number;
}
export interface IMatch extends ISortable {
  token: string;
  pattern:
    | "repeat"
    | "sequence"
    | "dictionary"
    | "regex"
    | "date"
    | "spatial"
    | "bruteforce";
  guesses?: number;
  guesses_log10?: number;
  [index: string]: unknown;
}
export declare function empty(
  obj: Record<string, unknown> | unknown[]
): boolean;
export declare function translate(
  string: string,
  chr_map: Record<string, string>
): string;
export declare function mod(n: number, m: number): number;
export declare function sorted<T extends ISortable>(matches: T[]): T[];
//# sourceMappingURL=support.d.ts.map
