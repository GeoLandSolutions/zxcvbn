"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence_match = void 0;
var MAX_DELTA = 5;
function update(password, i, j, result, delta) {
    if (j - i > 1 || Math.abs(delta) === 1) {
        var middle = Math.abs(delta);
        if (0 < middle && middle <= MAX_DELTA) {
            var sequence_name = void 0, sequence_space = void 0;
            var token = password.slice(i, j + 1);
            if (/^[a-z]+$/.test(token)) {
                sequence_name = "lower";
                sequence_space = 26;
            }
            else if (/^[A-Z]+$/.test(token)) {
                sequence_name = "upper";
                sequence_space = 26;
            }
            else if (/^\d+$/.test(token)) {
                sequence_name = "digits";
                sequence_space = 10;
            }
            else {
                // conservatively stick with roman alphabet size.
                // (this could be improved)
                sequence_name = "unicode";
                sequence_space = 26;
            }
            result.push({
                pattern: "sequence",
                i: i,
                j: j,
                token: password.slice(i, j + 1),
                sequence_name: sequence_name,
                sequence_space: sequence_space,
                ascending: delta > 0,
            });
        }
    }
    return;
}
function sequence_match(password) {
    // Identifies sequences by looking for repeated differences in unicode code point.
    // this allows skipping, such as 9753, and also matches some extended unicode sequences
    // such as Greek and Cyrillic alphabets.
    //
    // for example, consider the input 'abcdb975zy'
    //
    // password: a   b   c   d   b    9   7   5   z   y
    // index:    0   1   2   3   4    5   6   7   8   9
    // delta:      1   1   1  -2  -41  -2  -2  69   1
    //
    // expected result:
    // [(i, j, delta), ...] = [(0, 3, 1), (5, 7, -2), (8, 9, 1)]
    if (password.length === 1) {
        return [];
    }
    var result = [];
    var i = 0;
    var last_delta = null;
    for (var k = 1; k < password.length; k++) {
        var delta = password.charCodeAt(k) - password.charCodeAt(k - 1);
        if (last_delta == null) {
            last_delta = delta;
        }
        if (delta === last_delta) {
            continue;
        }
        var j = k - 1;
        update(password, i, j, result, last_delta);
        i = j;
        last_delta = delta;
    }
    update(password, i, password.length - 1, result, last_delta !== null && last_delta !== void 0 ? last_delta : 0);
    return result;
}
exports.sequence_match = sequence_match;
//# sourceMappingURL=sequence_match.js.map