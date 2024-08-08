"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimate_guesses = exports.most_guessable_match_sequence = void 0;
var bruteforce_guesses_1 = require("./bruteforce_guesses");
var date_guesses_1 = require("./date_guesses");
var dictionary_guesses_1 = require("./dictionary_guesses");
var regex_guesses_1 = require("./regex_guesses");
var repeat_guesses_1 = require("./repeat_guesses");
var sequence_guesses_1 = require("./sequence_guesses");
var spatial_guesses_1 = require("./spatial_guesses");
var support_1 = require("./support");
var MIN_GUESSES_BEFORE_GROWING_SEQUENCE = 10000;
// helper: considers whether a length-l sequence ending at match m is better (fewer guesses)
// than previously encountered sequences, updating state if so.
function update(password, optimal, m, l, exclude_additive) {
    var k = m.j;
    var pi = estimate_guesses(m, password);
    if (l > 1) {
        // we're considering a length-l sequence ending with match m:
        // obtain the product term in the minimization function by multiplying m's guesses
        // by the product of the length-(l-1) sequence ending just before m, at m.i - 1.
        pi *= optimal.pi[m.i - 1][l - 1];
    }
    // calculate the minimization func
    var g = (0, support_1.factorial)(l) * pi;
    if (!exclude_additive) {
        g += Math.pow(MIN_GUESSES_BEFORE_GROWING_SEQUENCE, l - 1);
    }
    // update state if new best.
    // first see if any competing sequences covering this prefix, with l or fewer matches,
    // fare better than this sequence. if so, skip it and return.
    for (var competing_l in optimal.g[k]) {
        var competing_g = optimal.g[k][competing_l];
        if (competing_l > l) {
            continue;
        }
        if (competing_g <= g) {
            return;
        }
    }
    // this sequence might be part of the final optimal sequence.
    optimal.g[k][l] = g;
    optimal.m[k][l] = m;
    optimal.pi[k][l] = pi;
}
// helper: step backwards through optimal.m starting at the end,
// constructing the final optimal match sequence.
function unwind(optimal, n) {
    var optimal_match_sequence = [];
    var k = n - 1;
    // find the final best sequence length and score
    var l = -1;
    var g = Infinity;
    for (var candidate_l in optimal.g[k]) {
        var candidate_g = optimal.g[k][candidate_l];
        if (candidate_g < g) {
            l = parseInt(candidate_l);
            g = candidate_g;
        }
    }
    while (k >= 0) {
        var m = optimal.m[k][l];
        optimal_match_sequence.unshift(m);
        k = m.i - 1;
        l--;
    }
    return optimal_match_sequence;
}
// helper: evaluate bruteforce matches ending at k.
function bruteforce_update(password, optimal, k, exclude_additive) {
    // see if a single bruteforce match spanning the k-prefix is optimal.
    var m = make_bruteforce_match(password, 0, k);
    update(password, optimal, m, 1, exclude_additive);
    for (var i = 1; i <= k; i++) {
        // generate k bruteforce matches, spanning from (i=1, j=k) up to (i=k, j=k).
        // see if adding these new matches to any of the sequences in optimal[i-1]
        // leads to new bests.
        var m_1 = make_bruteforce_match(password, i, k);
        var object = optimal.m[i - 1];
        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
            var l = _a[_i];
            var i_1 = parseInt(l);
            var last_m = object[i_1];
            if (last_m.pattern === "bruteforce")
                continue;
            update(password, optimal, m_1, i_1 + 1, exclude_additive);
        }
    }
}
// helper: make bruteforce match objects spanning i to j, inclusive.
function make_bruteforce_match(password, i, j) {
    return {
        pattern: "bruteforce",
        token: password.slice(i, j + 1),
        i: i,
        j: j,
    };
}
// ------------------------------------------------------------------------------
// search --- most guessable match sequence -------------------------------------
// ------------------------------------------------------------------------------
//
// takes a sequence of overlapping matches, returns the non-overlapping sequence with
// minimum guesses. the following is a O(l_max * (n + m)) dynamic programming algorithm
// for a length-n password with m candidate matches. l_max is the maximum optimal
// sequence length spanning each prefix of the password. In practice it rarely exceeds 5 and the
// search terminates rapidly.
//
// the optimal "minimum guesses" sequence is here defined to be the sequence that
// minimizes the following function:
//
//    g = l! * Product(m.guesses for m in sequence) + D^(l - 1)
//
// where l is the length of the sequence.
//
// the factorial term is the number of ways to order l patterns.
//
// the D^(l-1) term is another length penalty, roughly capturing the idea that an
// attacker will try lower-length sequences first before trying length-l sequences.
//
// for example, consider a sequence that is date-repeat-dictionary.
//  - an attacker would need to try other date-repeat-dictionary combinations,
//    hence the product term.
//  - an attacker would need to try repeat-date-dictionary, dictionary-repeat-date,
//    ..., hence the factorial term.
//  - an attacker would also likely try length-1 (dictionary) and length-2 (dictionary-date)
//    sequences before length-3. assuming at minimum D guesses per pattern type,
//    D^(l-1) approximates Sum(D^i for i in [1..l-1]
//
// ------------------------------------------------------------------------------
function most_guessable_match_sequence(password, matches, _exclude_additive) {
    if (_exclude_additive === void 0) { _exclude_additive = false; }
    var guesses, m;
    var n = password.length;
    // partition matches into sublists according to ending index j
    var matches_by_j = new Array(password.length).fill([]);
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        m = matches_1[_i];
        matches_by_j[m.j].push(m);
    }
    // small detail: for deterministic output, sort each sublist by i.
    for (var _a = 0, matches_by_j_1 = matches_by_j; _a < matches_by_j_1.length; _a++) {
        var lst = matches_by_j_1[_a];
        lst.sort(function (m1, m2) { return m1.i - m2.i; });
    }
    var optimal = {
        // optimal.m[k][l] holds final match in the best length-l match sequence covering the
        // password prefix up to k, inclusive.
        // if there is no length-l sequence that scores better (fewer guesses) than
        // a shorter match sequence spanning the same prefix, optimal.m[k][l] is undefined.
        m: matches_by_j.map(function () { return ({}); }),
        // same structure as optimal.m -- holds the product term Prod(m.guesses for m in sequence).
        // optimal.pi allows for fast (non-looping) updates to the minimization function.
        pi: matches_by_j.map(function () { return ({}); }),
        // same structure as optimal.m -- holds the overall metric.
        g: matches_by_j.map(function () { return ({}); }),
    };
    for (var k = 0; k < n; k++) {
        for (var _b = 0, _c = matches_by_j[k]; _b < _c.length; _b++) {
            m = _c[_b];
            if (m.i > 0) {
                for (var _d = 0, _e = Object.keys(optimal.m[m.i - 1]); _d < _e.length; _d++) {
                    var l = _e[_d];
                    var len = parseInt(l);
                    update(password, optimal, m, len + 1, _exclude_additive);
                }
            }
            else {
                update(password, optimal, m, 1, _exclude_additive);
            }
        }
        bruteforce_update(password, optimal, k, _exclude_additive);
    }
    var optimal_match_sequence = unwind(optimal, n);
    var optimal_l = optimal_match_sequence.length;
    // corner: empty password
    if (password.length === 0) {
        guesses = 1;
    }
    else {
        guesses = optimal.g[n - 1][optimal_l];
    }
    // final result object
    return {
        password: password,
        guesses: guesses,
        guesses_log10: Math.log10(guesses),
        sequence: optimal_match_sequence,
        score: 0,
    };
}
exports.most_guessable_match_sequence = most_guessable_match_sequence;
// ------------------------------------------------------------------------------
// guess estimation -- one function per match pattern ---------------------------
// ------------------------------------------------------------------------------
function estimate_guesses(match, password) {
    if (match.guesses) {
        return match.guesses;
    } // a match's guess estimate doesn't change. cache it.
    var min_guesses = 1;
    if (match.token.length < password.length) {
        min_guesses =
            match.token.length === 1
                ? bruteforce_guesses_1.MIN_SUBMATCH_GUESSES_SINGLE_CHAR
                : bruteforce_guesses_1.MIN_SUBMATCH_GUESSES_MULTI_CHAR;
    }
    var guesses;
    switch (match.pattern) {
        case "bruteforce":
            guesses = (0, bruteforce_guesses_1.bruteforce_guesses)(match);
            break;
        case "date":
            guesses = (0, date_guesses_1.date_guesses)(match);
            break;
        case "dictionary":
            guesses = (0, dictionary_guesses_1.dictionary_guesses)(match);
            break;
        case "regex":
            guesses = (0, regex_guesses_1.regex_guesses)(match);
            break;
        case "repeat":
            guesses = (0, repeat_guesses_1.repeat_guesses)(match);
            break;
        case "sequence":
            guesses = (0, sequence_guesses_1.sequence_guesses)(match);
            break;
        case "spatial":
            guesses = (0, spatial_guesses_1.spatial_guesses)(match);
            break;
    }
    match.guesses = Math.max(guesses, min_guesses);
    match.guesses_log10 = Math.log10(match.guesses);
    return match.guesses;
}
exports.estimate_guesses = estimate_guesses;
//# sourceMappingURL=index.js.map