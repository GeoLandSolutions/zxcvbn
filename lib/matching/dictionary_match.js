"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.l33t_match = exports.enumerate_l33t_subs = exports.relevant_l33t_subtable = exports.set_user_input_dictionary = exports.reverse_dictionary_match = exports.dictionary_match = void 0;
var frequency_lists_1 = __importDefault(require("../frequency_lists"));
//-------------------------------------------------------------------------------
// dictionary match (common passwords, english, last names, etc) ----------------
//-------------------------------------------------------------------------------
var support_1 = require("./support");
var RANKED_DICTIONARIES = {};
function build_ranked_dictionary(ordered_list) {
    var result = {};
    var i = 1; // rank starts at 1, not 0
    for (var _i = 0, ordered_list_1 = ordered_list; _i < ordered_list_1.length; _i++) {
        var word = ordered_list_1[_i];
        result[word] = i;
        i += 1;
    }
    return result;
}
for (var name_1 in frequency_lists_1.default) {
    var lst = frequency_lists_1.default[name_1];
    RANKED_DICTIONARIES[name_1] = build_ranked_dictionary(lst);
}
/**
 * Attempts to match a string with a ranked dictionary of words.
 *
 * @param password - The string to examine
 * @param _ranked_dictionaries - For unit testing only: allows overriding the available dictionaries
 */
function dictionary_match(password, _ranked_dictionaries) {
    if (_ranked_dictionaries === void 0) { _ranked_dictionaries = RANKED_DICTIONARIES; }
    var matches = [];
    var password_lower = password.toLowerCase();
    for (var dictionary_name in _ranked_dictionaries) {
        var ranked_dictionary = _ranked_dictionaries[dictionary_name];
        for (var i = 0; i < password.length; i++) {
            for (var j = i; j < password.length; j++) {
                if (password_lower.slice(i, j + 1) in ranked_dictionary) {
                    var word = password_lower.slice(i, j + 1);
                    var rank = ranked_dictionary[word];
                    matches.push({
                        pattern: "dictionary",
                        i: i,
                        j: j,
                        token: password.slice(i, j + 1),
                        matched_word: word,
                        rank: rank,
                        dictionary_name: dictionary_name,
                        reversed: false,
                        l33t: false,
                    });
                }
            }
        }
    }
    return (0, support_1.sorted)(matches);
}
exports.dictionary_match = dictionary_match;
/**
 * Attempts to match a string with a ranked dictionary of words after it is reversed.
 *
 * @param password - The string to examine
 * @param _ranked_dictionaries - For unit testing only: allows overriding the available dictionaries
 */
function reverse_dictionary_match(password, _ranked_dictionaries) {
    if (_ranked_dictionaries === void 0) { _ranked_dictionaries = RANKED_DICTIONARIES; }
    var reversed_password = password.split("").reverse().join("");
    return dictionary_match(reversed_password, _ranked_dictionaries)
        .map(function (m) {
        var newM = __assign({}, m);
        newM.i = password.length - 1 - m.j;
        newM.j = password.length - 1 - m.i;
        newM.token = m.token.split("").reverse().join(""); // reverse back
        newM.reversed = true;
        return newM;
    })
        .sort(function (m1, m2) { return m1.i - m2.i || m1.j - m2.j; });
}
exports.reverse_dictionary_match = reverse_dictionary_match;
/**
 * Adds a user provided dictionary as a user_inputs dictionary.
 * @param ordered_list The list to add as a dictionary.
 */
function set_user_input_dictionary(ordered_list) {
    RANKED_DICTIONARIES.user_inputs = build_ranked_dictionary(__spreadArray([], ordered_list, true));
}
exports.set_user_input_dictionary = set_user_input_dictionary;
/**
 * Prunes a copy of a l33t_table to only include the substitutions of interest.
 * @param password The password to consider
 * @param table The table to prune.
 */
function relevant_l33t_subtable(password, table) {
    var password_chars = new Set(password.split(""));
    var subtable = {};
    for (var letter in table) {
        var relevant_subs = table[letter].filter(function (sub) {
            return password_chars.has(sub);
        });
        if (relevant_subs.length > 0) {
            subtable[letter] = relevant_subs;
        }
    }
    return subtable;
}
exports.relevant_l33t_subtable = relevant_l33t_subtable;
function dedup(subs) {
    var deduped = [];
    var members = new Set();
    for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
        var sub = subs_1[_i];
        var label = sub
            .map(function (k, v) { return [k, v]; })
            .sort()
            .map(function (k, v) { return "".concat(k.join(","), ",").concat(v); })
            .join("-");
        if (!members.has(label)) {
            members.add(label);
            deduped.push(sub);
        }
    }
    return deduped;
}
function helper(keys, table, subs) {
    if (subs === void 0) { subs = [[]]; }
    if (!keys.length)
        return subs;
    var first_key = keys[0], rest_keys = keys.slice(1);
    var next_subs = [];
    var _loop_1 = function (l33t_chr) {
        for (var _b = 0, subs_2 = subs; _b < subs_2.length; _b++) {
            var sub = subs_2[_b];
            var dup_l33t_index = sub.findIndex(function (s) { return s[0] === l33t_chr; });
            if (dup_l33t_index !== -1)
                next_subs.push(sub);
            next_subs.push(__spreadArray(__spreadArray([], sub, true), [[l33t_chr, first_key]], false));
        }
    };
    for (var _i = 0, _a = table[first_key]; _i < _a.length; _i++) {
        var l33t_chr = _a[_i];
        _loop_1(l33t_chr);
    }
    subs = dedup(next_subs);
    return helper(rest_keys, table, subs);
}
/**
 * Returns the list of possible l33t replacement dictionaries for a given password.
 * @param table The table to create l33t substitutions for.
 */
function enumerate_l33t_subs(table) {
    return helper(Object.keys(table), table).map(function (s) {
        var sub_dictionary = {};
        for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
            var _a = s_1[_i], l33t_chr = _a[0], chr = _a[1];
            sub_dictionary[l33t_chr] = chr;
        }
        return sub_dictionary;
    });
}
exports.enumerate_l33t_subs = enumerate_l33t_subs;
var L33T_TABLE = {
    a: ["4", "@"],
    b: ["8"],
    c: ["(", "{", "[", "<"],
    e: ["3"],
    g: ["6", "9"],
    i: ["1", "!", "|"],
    l: ["1", "|", "7"],
    o: ["0"],
    s: ["$", "5"],
    t: ["+", "7"],
    x: ["%"],
    z: ["2"],
};
//-------------------------------------------------------------------------------
// dictionary match with common l33t substitutions ------------------------------
//-------------------------------------------------------------------------------
function l33t_match(password, _ranked_dictionaries, _l33t_table) {
    if (_ranked_dictionaries === void 0) { _ranked_dictionaries = RANKED_DICTIONARIES; }
    if (_l33t_table === void 0) { _l33t_table = L33T_TABLE; }
    var matches = [];
    for (var _i = 0, _a = enumerate_l33t_subs(relevant_l33t_subtable(password, _l33t_table)); _i < _a.length; _i++) {
        var sub = _a[_i];
        if ((0, support_1.empty)(sub)) {
            break; // corner case: password has no relevant subs.
        }
        var subbed_password = (0, support_1.translate)(password, sub);
        var _loop_2 = function (match) {
            var token = password.slice(match.i, match.j + 1);
            if (token.toLowerCase() === match.matched_word) {
                return "continue";
            }
            var match_sub = {}; // subset of mappings in sub that are in use for this match
            for (var subbed_chr in sub) {
                var chr = sub[subbed_chr];
                if (token.includes(subbed_chr)) {
                    match_sub[subbed_chr] = chr;
                }
            }
            match.l33t = true;
            match.token = token;
            match.sub = match_sub;
            match.sub_display = Object.keys(match_sub)
                .map(function (k) { return "".concat(k, " -> ").concat(match_sub[k]); })
                .join(", ");
            matches.push(match);
        };
        for (var _b = 0, _c = dictionary_match(subbed_password, _ranked_dictionaries); _b < _c.length; _b++) {
            var match = _c[_b];
            _loop_2(match);
        }
    }
    return (0, support_1.sorted)(matches.filter(function (match // filter single-character l33t matches to reduce noise.
    ) {
        // otherwise '1' matches 'i', '4' matches 'a', both very common English words
        // with low dictionary rank.
        return match.token.length > 1;
    }));
}
exports.l33t_match = l33t_match;
//# sourceMappingURL=dictionary_match.js.map