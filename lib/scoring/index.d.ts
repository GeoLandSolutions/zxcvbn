import { IAnyMatch } from "../matching";
export declare function most_guessable_match_sequence(
  password: string,
  matches: IAnyMatch[],
  _exclude_additive?: boolean
): {
  sequence: IAnyMatch[];
  guesses: number;
  guesses_log10: number;
  password: string;
  score: number;
};
export declare function estimate_guesses(
  match: IAnyMatch,
  password: string
): number;
//# sourceMappingURL=index.d.ts.map
