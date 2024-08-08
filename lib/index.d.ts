import { IAnyMatch } from "./matching";
import { IAttackTimes } from "./time_estimates";
import { IFeedbackItem } from "./feedback";
export interface IZXCVBNResult extends IAttackTimes {
  sequence: IAnyMatch[];
  guesses: number;
  guesses_log10: number;
  password: string;
  score: number;
  calc_time: number;
  feedback: IFeedbackItem;
}
export declare function zxcvbn(
  password: string,
  user_inputs?: (string | number | boolean)[]
): IZXCVBNResult;
export default zxcvbn;
//# sourceMappingURL=index.d.ts.map
