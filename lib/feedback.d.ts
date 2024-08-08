import { IAnyMatch } from "./matching";
import { IDictionaryMatch } from "./matching/dictionary_match";
export interface IFeedbackItem {
  warning: string;
  suggestions: string[];
}
export declare const default_feedback: IFeedbackItem;
export declare function get_feedback(
  score: number,
  sequence: IAnyMatch[]
): IFeedbackItem;
export declare function get_match_feedback(
  match: IAnyMatch,
  is_sole_match: boolean
): IFeedbackItem | undefined;
export declare function get_dictionary_match_feedback(
  match: IDictionaryMatch,
  is_sole_match: boolean
): IFeedbackItem;
//# sourceMappingURL=feedback.d.ts.map
