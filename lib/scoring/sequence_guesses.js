"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence_guesses = void 0;
function sequence_guesses(match) {
    var base_guesses;
    var first_chr = match.token.charAt(0);
    // lower guesses for obvious starting points
    if (["a", "A", "z", "Z", "0", "1", "9"].includes(first_chr)) {
        base_guesses = 4;
    }
    else {
        if (first_chr.match(/\d/)) {
            base_guesses = 10; // digits
        }
        else {
            // could give a higher base for uppercase,
            // assigning 26 to both upper and lower sequences is more conservative.
            base_guesses = 26;
        }
    }
    if (!match.ascending) {
        // need to try a descending sequence in addition to every ascending sequence ->
        // 2x guesses
        base_guesses *= 2;
    }
    return base_guesses * match.token.length;
}
exports.sequence_guesses = sequence_guesses;
//# sourceMappingURL=sequence_guesses.js.map