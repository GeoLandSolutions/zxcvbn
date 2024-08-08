import { IMatch } from "./support";
export interface IRegexMatch extends IMatch {
  pattern: "regex";
  regex_name: string;
  regex_match: RegExpExecArray;
}
export declare function regex_match(
  password: string,
  _regexen?: Record<string, RegExp>
): IRegexMatch[];
//# sourceMappingURL=regex_match.d.ts.map
