"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex_guesses = void 0;
var support_1 = require("./support");
function regex_guesses(match) {
    var year_space;
    switch (match.regex_name) {
        case "recent_year":
            // conservative estimate of year space: num years from REFERENCE_YEAR.
            // if year is close to REFERENCE_YEAR, estimate a year space of MIN_YEAR_SPACE.
            year_space = Math.abs(parseInt(match.regex_match[0]) - support_1.REFERENCE_YEAR);
            year_space = Math.max(year_space, support_1.MIN_YEAR_SPACE);
            return year_space;
    }
    return 0;
}
exports.regex_guesses = regex_guesses;
//# sourceMappingURL=regex_guesses.js.map