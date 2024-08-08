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
Object.defineProperty(exports, "__esModule", { value: true });
exports.date_match = void 0;
var support_1 = require("../scoring/support");
var support_2 = require("./support");
var DATE_MAX_YEAR = 2050;
var DATE_MIN_YEAR = 1000;
var DATE_SPLITS = {
    4: [
        // for length-4 strings, eg 1191 or 9111, two ways to split:
        [1, 2],
        [2, 3], // 91 1 1
    ],
    5: [
        [1, 3],
        [2, 3], // 11 1 91
    ],
    6: [
        [1, 2],
        [2, 4],
        [4, 5], // 1991 1 1
    ],
    7: [
        [1, 3],
        [2, 3],
        [4, 5],
        [4, 6], // 1991 11 1
    ],
    8: [
        [2, 4],
        [4, 6], // 1991 11 11
    ],
};
/**
 * Attempts to match a string with a date.
 *
 * @remarks
 * A date is recognised if it is:
 * - Any 3-tuple that starts or ends with a 2- or 4-digit year
 * - With 2 or 0 separator chars (1.1.91 or 1191)
 * - Maybe zero-padded (01-01-91 vs 1-1-91)
 * - Has a month between 1 and 12
 * - Has a day between 1 and 31
 *
 * Note: This isn't true date parsing, and allows invalid dates like 31 Feb or 29 Feb on non-leap-years.
 *
 * @param password - The string to examine
 */
function date_match(password) {
    // recipe:
    // start with regex to find maybe-dates, then attempt to map the integers
    // onto month-day-year to filter the maybe-dates into dates.
    // finally, remove matches that are substrings of other matches to reduce noise.
    //
    // note: instead of using a lazy or greedy regex to find many dates over the full string,
    // this uses a ^...$ regex against every substring of the password -- less performant but leads
    // to every possible date match.
    var matches = [];
    var maybe_date_no_separator = /^\d{4,8}$/;
    var maybe_date_with_separator = new RegExp("^(\\d{1,4})([\\s/\\\\_.-])(\\d{1,2})\\2(\\d{1,4})$");
    // dates without separators are between length 4 '1191' and 8 '11111991'
    for (var i = 0; i <= password.length - 4; i++) {
        var _loop_1 = function (j) {
            var token = password.slice(i, j + 1);
            if (!maybe_date_no_separator.exec(token)) {
                return "continue";
            }
            var candidates = DATE_SPLITS[token.length]
                .map(function (_a) {
                var k = _a[0], l = _a[1];
                return map_ints_to_dmy([
                    parseInt(token.slice(0, k)),
                    parseInt(token.slice(k, l)),
                    parseInt(token.slice(l)),
                ]);
            })
                .filter(function (d) { return d; });
            if (!(candidates.length > 0))
                return "continue";
            // At this point: different possible dmy mappings for the same i,j substring.
            // Match the candidate date that likely takes the fewest guesses: a year closest to REFERENCE_YEAR.
            // For example: considering '111504', prefer 11-15-04 to 1-1-1504 (interpreting '04' as 2004)
            var first = candidates[0], rest = candidates.slice(1);
            var best_candidate = first;
            var metric = function (candidate) {
                return Math.abs(candidate.year - support_1.REFERENCE_YEAR);
            };
            var min_distance = metric(candidates[0]);
            for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                var candidate = rest_1[_i];
                var distance = metric(candidate);
                if (distance < min_distance) {
                    best_candidate = candidate;
                    min_distance = distance;
                }
            }
            matches.push(__assign({ pattern: "date", token: token, i: i, j: j, separator: "" }, best_candidate));
        };
        for (var j = i + 3; j <= i + 7 && j < password.length; j++) {
            _loop_1(j);
        }
    }
    // dates with separators are between length 6 '1/1/91' and 10 '11/11/1991'
    for (var i = 0; i < password.length; i++) {
        for (var j = i + 5; j <= i + 9 && j < password.length; j++) {
            var token = password.slice(i, j + 1);
            var rx_match = maybe_date_with_separator.exec(token);
            if (!rx_match)
                continue;
            var dmy = map_ints_to_dmy([
                parseInt(rx_match[1]),
                parseInt(rx_match[3]),
                parseInt(rx_match[4]),
            ]);
            if (!dmy)
                continue;
            matches.push(__assign({ pattern: "date", token: token, i: i, j: j, separator: rx_match[2] }, dmy));
        }
    }
    // matches now contains all valid date strings in a way that is tricky to capture
    // with regexes only. while thorough, it will contain some unintuitive noise:
    //
    // '2015_06_04', in addition to matching 2015_06_04, will also contain
    // 5(!) other date matches: 15_06_04, 5_06_04, ..., even 2015 (matched as 5/1/2020)
    //
    // to reduce noise, remove date matches that are strict substrings of others
    return (0, support_2.sorted)(matches.filter(function (match) {
        var is_submatch = false;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var other_match = matches_1[_i];
            if (match === other_match)
                continue;
            if (other_match.i <= match.i && other_match.j >= match.j) {
                is_submatch = true;
                break;
            }
        }
        return !is_submatch;
    }));
}
exports.date_match = date_match;
function map_ints_to_dmy(ints) {
    // given a 3-tuple, discard if:
    //   middle int is over 31 (for all dmy formats, years are never allowed in the middle)
    //   middle int is zero
    //   any int is over the max allowable year
    //   any int is over two digits but under the min allowable year
    //   2 ints are over 31, the max allowable day
    //   2 ints are zero
    //   all ints are over 12, the max allowable month
    if (ints[1] > 31 || ints[1] <= 0) {
        return;
    }
    var over_12 = 0;
    var over_31 = 0;
    var under_1 = 0;
    for (var _i = 0, ints_1 = ints; _i < ints_1.length; _i++) {
        var int = ints_1[_i];
        if ((99 < int && int < DATE_MIN_YEAR) || int > DATE_MAX_YEAR) {
            return;
        }
        if (int > 31) {
            over_31 += 1;
        }
        if (int > 12) {
            over_12 += 1;
        }
        if (int <= 0) {
            under_1 += 1;
        }
    }
    if (over_31 >= 2 || over_12 === 3 || under_1 >= 2) {
        return;
    }
    // first look for a four digit year: yyyy + daymonth or daymonth + yyyy
    var possible_year_splits = [
        { year: ints[2], rest: ints.slice(0, 2) },
        { year: ints[0], rest: ints.slice(1, 3) },
    ];
    for (var _a = 0, possible_year_splits_1 = possible_year_splits; _a < possible_year_splits_1.length; _a++) {
        var _b = possible_year_splits_1[_a], year = _b.year, rest = _b.rest;
        if (DATE_MIN_YEAR <= year && year <= DATE_MAX_YEAR) {
            var dm = map_ints_to_dm(rest);
            if (dm) {
                return __assign({ year: year }, dm);
            }
            else {
                // for a candidate that includes a four-digit year,
                // when the remaining ints don't match to a day and month,
                // it is not a date.
                return;
            }
        }
    }
    // given no four-digit year, two digit years are the most flexible int to match, so
    // try to parse a day-month out of ints[0..1] or ints[1..0]
    for (var _c = 0, possible_year_splits_2 = possible_year_splits; _c < possible_year_splits_2.length; _c++) {
        var _d = possible_year_splits_2[_c], y = _d.year, rest = _d.rest;
        var dm = map_ints_to_dm(rest);
        if (dm) {
            return __assign({ year: two_to_four_digit_year(y) }, dm);
        }
    }
    return;
}
function map_ints_to_dm(ints) {
    for (var _i = 0, _a = [ints, __spreadArray([], ints, true).reverse()]; _i < _a.length; _i++) {
        var _b = _a[_i], d = _b[0], m = _b[1];
        if (1 <= d && d <= 31 && 1 <= m && m <= 12) {
            return {
                day: d,
                month: m,
            };
        }
    }
    return;
}
function two_to_four_digit_year(year) {
    if (year > 99) {
        return year;
    }
    else if (year > 50) {
        // 87 -> 1987
        return year + 1900;
    }
    else {
        // 15 -> 2015
        return year + 2000;
    }
}
//# sourceMappingURL=date_match.js.map