import { IMatch } from "./support";
export interface ISequenceMatch extends IMatch {
  pattern: "sequence";
  sequence_name: string;
  sequence_space: number;
  ascending: boolean;
}
export declare function sequence_match(password: string): ISequenceMatch[];
//# sourceMappingURL=sequence_match.d.ts.map
