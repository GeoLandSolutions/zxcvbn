"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat_match = void 0;
var matching_1 = require("../matching");
var scoring_1 = require("../scoring");
//-------------------------------------------------------------------------------
// repeats (aaa, abcabcabc) and sequences (abcdef) ------------------------------
//-------------------------------------------------------------------------------
function repeat_match(password) {
    var matches = [];
    var greedy = /(.+)\1+/g;
    var lazy = /(.+?)\1+/g;
    var lazy_anchored = /^(.+?)\1+$/;
    var lastIndex = 0;
    while (lastIndex < password.length) {
        var base_token = void 0;
        var match = void 0;
        greedy.lastIndex = lastIndex;
        lazy.lastIndex = lastIndex;
        var greedy_match = greedy.exec(password);
        var lazy_match = lazy.exec(password);
        if (!greedy_match || !lazy_match) {
            break;
        }
        if (greedy_match[0].length > lazy_match[0].length) {
            // greedy beats lazy for 'aabaab'
            //   greedy: [aabaab, aab]
            //   lazy:   [aa,     a]
            match = greedy_match;
            // greedy's repeated string might itself be repeated, eg.
            // aabaab in aabaabaabaab.
            // run an anchored lazy match on greedy's repeated string
            // to find the shortest repeated string
            var anchored = lazy_anchored.exec(match[0]);
            base_token = anchored ? anchored[1] : "";
        }
        else {
            // lazy beats greedy for 'aaaaa'
            //   greedy: [aaaa,  aa]
            //   lazy:   [aaaaa, a]
            match = lazy_match;
            base_token = match[1];
        }
        var i = match.index;
        var j = match.index + match[0].length - 1;
        // recursively match and score the base string
        var base_analysis = (0, scoring_1.most_guessable_match_sequence)(base_token, (0, matching_1.omnimatch)(base_token));
        var base_matches = base_analysis.sequence;
        var base_guesses = base_analysis.guesses;
        matches.push({
            pattern: "repeat",
            i: i,
            j: j,
            token: match[0],
            base_token: base_token,
            base_guesses: base_guesses,
            base_matches: base_matches,
            repeat_count: match[0].length / base_token.length,
        });
        lastIndex = j + 1;
    }
    return matches;
}
exports.repeat_match = repeat_match;
//# sourceMappingURL=repeat_match.js.map