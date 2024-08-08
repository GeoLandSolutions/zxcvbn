import { IMatch } from "./support";
export interface IDictionaryMatch extends IMatch {
  sub?: Record<string, string>;
  sub_display?: string;
  pattern: "dictionary";
  matched_word: string;
  reversed: boolean;
  rank: number;
  dictionary_name: string;
  l33t: boolean;
  base_guesses?: number;
  uppercase_variations?: number;
  l33t_variations?: number;
}
/**
 * Attempts to match a string with a ranked dictionary of words.
 *
 * @param password - The string to examine
 * @param _ranked_dictionaries - For unit testing only: allows overriding the available dictionaries
 */
export declare function dictionary_match(
  password: string,
  _ranked_dictionaries?: Record<string, Record<string, number>>
): IDictionaryMatch[];
/**
 * Attempts to match a string with a ranked dictionary of words after it is reversed.
 *
 * @param password - The string to examine
 * @param _ranked_dictionaries - For unit testing only: allows overriding the available dictionaries
 */
export declare function reverse_dictionary_match(
  password: string,
  _ranked_dictionaries?: Record<string, Record<string, number>>
): IDictionaryMatch[];
/**
 * Adds a user provided dictionary as a user_inputs dictionary.
 * @param ordered_list The list to add as a dictionary.
 */
export declare function set_user_input_dictionary(ordered_list: string[]): void;
/**
 * Prunes a copy of a l33t_table to only include the substitutions of interest.
 * @param password The password to consider
 * @param table The table to prune.
 */
export declare function relevant_l33t_subtable(
  password: string,
  table: Record<string, string[]>
): Record<string, string[]>;
/**
 * Returns the list of possible l33t replacement dictionaries for a given password.
 * @param table The table to create l33t substitutions for.
 */
export declare function enumerate_l33t_subs(
  table: Record<string, string[]>
): Record<string, string>[];
export declare function l33t_match(
  password: string,
  _ranked_dictionaries?: Record<string, Record<string, number>>,
  _l33t_table?: Record<string, string[]>
): IDictionaryMatch[];
//# sourceMappingURL=dictionary_match.d.ts.map
