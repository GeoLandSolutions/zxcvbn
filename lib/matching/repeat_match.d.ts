import { IMatch } from "./support";
export interface IRepeatMatch extends IMatch {
  pattern: "repeat";
  base_token: string;
  base_guesses: number;
  base_matches: IMatch[];
  repeat_count: number;
}
export declare function repeat_match(password: string): IRepeatMatch[];
//# sourceMappingURL=repeat_match.d.ts.map
