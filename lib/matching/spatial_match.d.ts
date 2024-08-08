import { IMatch } from "./support";
export interface ISpatialMatch extends IMatch {
  pattern: "spatial";
  graph: string;
  turns: number;
  base_token?: string;
  regex_name?: string;
  shifted_count: number;
}
export declare function spatial_match(
  password: string,
  _graphs?: Record<string, Record<string, (string | null)[]>>
): ISpatialMatch[];
export declare function spatial_match_helper(
  password: string,
  graph: Record<string, (string | null)[] | undefined>,
  graph_name: string
): ISpatialMatch[];
//# sourceMappingURL=spatial_match.d.ts.map
