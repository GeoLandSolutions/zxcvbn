import { IMatch } from "./support";
import { IDictionaryMatch } from "./dictionary_match";
import { ISpatialMatch } from "./spatial_match";
import { IRepeatMatch } from "./repeat_match";
import { ISequenceMatch } from "./sequence_match";
import { IRegexMatch } from "./regex_match";
import { IDateMatch } from "./date_match";
export interface IBruteForceMatch extends IMatch {
  pattern: "bruteforce";
}
export declare type IAnyMatch =
  | IRepeatMatch
  | IDictionaryMatch
  | ISpatialMatch
  | ISequenceMatch
  | IRegexMatch
  | IDateMatch
  | IBruteForceMatch;
export declare function omnimatch(password: string): IAnyMatch[];
//# sourceMappingURL=index.d.ts.map
