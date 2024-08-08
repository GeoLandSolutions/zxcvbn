interface ICrackTimes {
  online_throttling_100_per_hour: number;
  online_no_throttling_10_per_second: number;
  offline_slow_hashing_1e4_per_second: number;
  offline_fast_hashing_1e10_per_second: number;
  [index: string]: number;
}
declare type ICrackTimesDisplay = {
  [P in keyof ICrackTimes]?: string;
};
export interface IAttackTimes {
  crack_times_seconds: ICrackTimes;
  crack_times_display: ICrackTimesDisplay;
  score: number;
}
export declare function estimate_attack_times(guesses: number): IAttackTimes;
export declare function guesses_to_score(guesses: number): 0 | 1 | 2 | 3 | 4;
export declare function display_time(seconds: number): string;
export {};
//# sourceMappingURL=time_estimates.d.ts.map
