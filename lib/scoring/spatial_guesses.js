"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spatial_guesses = exports.KEYBOARD_STARTING_POSITIONS = exports.KEYBOARD_AVERAGE_DEGREE = void 0;
var adjacency_graphs_1 = require("../adjacency_graphs");
var support_1 = require("./support");
exports.KEYBOARD_AVERAGE_DEGREE = calc_average_degree(adjacency_graphs_1.qwerty);
// slightly different for keypad/mac keypad, but close enough
var KEYPAD_AVERAGE_DEGREE = calc_average_degree(adjacency_graphs_1.keypad);
exports.KEYBOARD_STARTING_POSITIONS = Object.keys(adjacency_graphs_1.qwerty).length;
var KEYPAD_STARTING_POSITIONS = Object.keys(adjacency_graphs_1.keypad).length;
// on qwerty, 'g' has degree 6, being adjacent to 'ftyhbv'. '\' has degree 1.
// this calculates the average over all keys.
function calc_average_degree(graph) {
    var average = 0;
    for (var key in graph) {
        var neighbors = graph[key];
        average += neighbors.filter(function (n) { return n; }).length;
    }
    average /= Object.keys(graph).length;
    return average;
}
function spatial_guesses(match) {
    var d, s;
    if (["qwerty", "dvorak"].includes(match.graph)) {
        s = exports.KEYBOARD_STARTING_POSITIONS;
        d = exports.KEYBOARD_AVERAGE_DEGREE;
    }
    else {
        s = KEYPAD_STARTING_POSITIONS;
        d = KEYPAD_AVERAGE_DEGREE;
    }
    var guesses = 0;
    var L = match.token.length;
    var t = match.turns;
    // estimate the number of possible patterns w/ length L or less with t turns or less.
    for (var i = 2; i <= L; i++) {
        var possible_turns = Math.min(t, i - 1);
        for (var j = 1; j <= possible_turns; j++) {
            guesses += (0, support_1.nCk)(i - 1, j - 1) * s * Math.pow(d, j);
        }
    }
    // add extra guesses for shifted keys. (% instead of 5, A instead of a.)
    // math is similar to extra guesses of l33t substitutions in dictionary matches.
    if (match.shifted_count) {
        var S = match.shifted_count;
        var U = match.token.length - match.shifted_count; // unshifted count
        if (S === 0 || U === 0) {
            guesses *= 2;
        }
        else {
            var shifted_variations = 0;
            for (var i = 1; i <= Math.min(S, U); i++) {
                shifted_variations += (0, support_1.nCk)(S + U, i);
            }
            guesses *= shifted_variations;
        }
    }
    return guesses;
}
exports.spatial_guesses = spatial_guesses;
//# sourceMappingURL=spatial_guesses.js.map