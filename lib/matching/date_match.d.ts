import { IMatch } from "./support";
export interface IDateMatch extends IMatch {
  pattern: "date";
  separator: string;
  year: number;
  month: number;
  day: number;
  has_full_year?: boolean;
}
/**
 * Attempts to match a string with a date.
 *
 * @remarks
 * A date is recognised if it is:
 * - Any 3-tuple that starts or ends with a 2- or 4-digit year
 * - With 2 or 0 separator chars (1.1.91 or 1191)
 * - Maybe zero-padded (01-01-91 vs 1-1-91)
 * - Has a month between 1 and 12
 * - Has a day between 1 and 31
 *
 * Note: This isn't true date parsing, and allows invalid dates like 31 Feb or 29 Feb on non-leap-years.
 *
 * @param password - The string to examine
 */
export declare function date_match(password: string): IDateMatch[];
//# sourceMappingURL=date_match.d.ts.map
