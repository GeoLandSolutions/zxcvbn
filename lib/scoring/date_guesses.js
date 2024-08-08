"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date_guesses = void 0;
var support_1 = require("./support");
function date_guesses(match) {
    // base guesses: (year distance from REFERENCE_YEAR) * num_days * num_years
    var year_space = Math.max(Math.abs(match.year - support_1.REFERENCE_YEAR), support_1.MIN_YEAR_SPACE);
    var guesses = year_space * 365;
    // add factor of 4 for separator selection (one of ~4 choices)
    if (match.separator) {
        guesses *= 4;
    }
    return guesses;
}
exports.date_guesses = date_guesses;
//# sourceMappingURL=date_guesses.js.map