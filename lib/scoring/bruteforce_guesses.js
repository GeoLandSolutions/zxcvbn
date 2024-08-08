"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bruteforce_guesses = exports.MIN_SUBMATCH_GUESSES_MULTI_CHAR = exports.MIN_SUBMATCH_GUESSES_SINGLE_CHAR = void 0;
var BRUTEFORCE_CARDINALITY = 10;
exports.MIN_SUBMATCH_GUESSES_SINGLE_CHAR = 10;
exports.MIN_SUBMATCH_GUESSES_MULTI_CHAR = 50;
function bruteforce_guesses(match) {
    var guesses = Math.pow(BRUTEFORCE_CARDINALITY, match.token.length);
    if (guesses === Number.POSITIVE_INFINITY) {
        guesses = Number.MAX_VALUE;
    }
    // small detail: make bruteforce matches at minimum one guess bigger than smallest allowed
    // submatch guesses, such that non-bruteforce submatches over the same [i..j] take precedence.
    var min_guesses = match.token.length === 1
        ? exports.MIN_SUBMATCH_GUESSES_SINGLE_CHAR + 1
        : exports.MIN_SUBMATCH_GUESSES_MULTI_CHAR + 1;
    return Math.max(guesses, min_guesses);
}
exports.bruteforce_guesses = bruteforce_guesses;
//# sourceMappingURL=bruteforce_guesses.js.map