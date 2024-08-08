"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_YEAR_SPACE = exports.REFERENCE_YEAR = exports.factorial = exports.nCk = void 0;
function nCk(n, k) {
    // http://blog.plover.com/math/choose.html
    if (k > n) {
        return 0;
    }
    if (k === 0) {
        return 1;
    }
    var r = 1;
    for (var d = 1; d <= k; d++) {
        r *= n;
        r /= d;
        n -= 1;
    }
    return r;
}
exports.nCk = nCk;
function factorial(n) {
    // unoptimized, called only on small n
    if (n < 2) {
        return 1;
    }
    var f = 1;
    for (var i = 2; i <= n; i++) {
        f *= i;
    }
    return f;
}
exports.factorial = factorial;
exports.REFERENCE_YEAR = new Date().getFullYear();
exports.MIN_YEAR_SPACE = 20;
//# sourceMappingURL=support.js.map