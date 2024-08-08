"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sorted = exports.mod = exports.translate = exports.empty = void 0;
function empty(obj) {
    return Object.keys(obj).length === 0;
}
exports.empty = empty;
function translate(string, chr_map) {
    return string
        .split("")
        .map(function (chr) { return chr_map[chr] || chr; })
        .join("");
}
exports.translate = translate;
function mod(n, m) {
    return ((n % m) + m) % m;
} // mod impl that works for negative numbers
exports.mod = mod;
function sorted(matches) {
    // sort on i primary, j secondary
    return matches.sort(function (m1, m2) { return m1.i - m2.i || m1.j - m2.j; });
}
exports.sorted = sorted;
//# sourceMappingURL=support.js.map