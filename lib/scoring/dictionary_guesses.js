"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dictionary_guesses = exports.l33t_variations = exports.uppercase_variations = exports.ALL_UPPER = exports.START_UPPER = void 0;
var support_1 = require("./support");
exports.START_UPPER = /^[A-Z][^A-Z]+$/;
var END_UPPER = /^[^A-Z]+[A-Z]$/;
exports.ALL_UPPER = /^[^a-z]+$/;
var ALL_LOWER = /^[^A-Z]+$/;
function uppercase_variations(match) {
    var word = match.token;
    if (word.match(ALL_LOWER) || word.toLowerCase() === word) {
        return 1;
    }
    // a capitalized word is the most common capitalization scheme,
    // so it only doubles the search space (uncapitalized + capitalized).
    // allcaps and end-capitalized are common enough too, underestimate as 2x factor to be safe.
    for (var _i = 0, _a = [exports.START_UPPER, END_UPPER, exports.ALL_UPPER]; _i < _a.length; _i++) {
        var regex = _a[_i];
        if (word.match(regex)) {
            return 2;
        }
    }
    // otherwise calculate the number of ways to capitalize U+L uppercase+lowercase letters
    // with U uppercase letters or less. or, if there's more uppercase than lower (for eg. PASSwORD),
    // the number of ways to lowercase U+L letters with L lowercase letters or less.
    var U = word.split("").filter(function (c) { return c.match(/[A-Z]/); }).length;
    var L = word.split("").filter(function (c) { return c.match(/[a-z]/); }).length;
    var variations = 0;
    for (var i = 1; i <= Math.min(U, L); i++) {
        variations += (0, support_1.nCk)(U + L, i);
    }
    return variations;
}
exports.uppercase_variations = uppercase_variations;
function l33t_variations(match) {
    if (!match.l33t) {
        return 1;
    }
    var variations = 1;
    var _loop_1 = function (subbed) {
        // lower-case match.token before calculating: capitalization shouldn't affect l33t calc.
        var unsubbed = match.sub[subbed];
        var chrs = match.token.toLowerCase().split("");
        var S = chrs.filter(function (c) { return c === subbed; }).length;
        var U = chrs.filter(function (c) { return c === unsubbed; }).length;
        if (S === 0 || U === 0) {
            // for this sub, password is either fully subbed (444) or fully unsubbed (aaa)
            // treat that as doubling the space (attacker needs to try fully subbed chars in addition to
            // unsubbed.)
            variations *= 2;
        }
        else {
            // this case is similar to capitalization:
            // with aa44a, U = 3, S = 2, attacker needs to try unsubbed + one sub + two subs
            var p = Math.min(U, S);
            var possibilities = 0;
            for (var i = 1; i <= p; i++) {
                possibilities += (0, support_1.nCk)(U + S, i);
            }
            variations *= possibilities;
        }
    };
    for (var subbed in match.sub) {
        _loop_1(subbed);
    }
    return variations;
}
exports.l33t_variations = l33t_variations;
function dictionary_guesses(match) {
    match.base_guesses = match.rank; // keep these as properties for display purposes
    match.uppercase_variations = uppercase_variations(match);
    match.l33t_variations = l33t_variations(match);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    var reversed_variations = (match.reversed && 2) || 1;
    return (match.base_guesses *
        match.uppercase_variations *
        match.l33t_variations *
        reversed_variations);
}
exports.dictionary_guesses = dictionary_guesses;
//# sourceMappingURL=dictionary_guesses.js.map