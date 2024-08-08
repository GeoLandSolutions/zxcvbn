"use strict";
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
exports.omnimatch = void 0;
var support_1 = require("./support");
var dictionary_match_1 = require("./dictionary_match");
var spatial_match_1 = require("./spatial_match");
var repeat_match_1 = require("./repeat_match");
var sequence_match_1 = require("./sequence_match");
var regex_match_1 = require("./regex_match");
var date_match_1 = require("./date_match");
// ------------------------------------------------------------------------------
// omnimatch -- combine everything ----------------------------------------------
// ------------------------------------------------------------------------------
function omnimatch(password) {
    var matches = [];
    var matchers = [
        dictionary_match_1.dictionary_match,
        dictionary_match_1.reverse_dictionary_match,
        dictionary_match_1.l33t_match,
        spatial_match_1.spatial_match,
        repeat_match_1.repeat_match,
        sequence_match_1.sequence_match,
        regex_match_1.regex_match,
        date_match_1.date_match,
    ];
    for (var _i = 0, matchers_1 = matchers; _i < matchers_1.length; _i++) {
        var matcher = matchers_1[_i];
        matches = __spreadArray(__spreadArray([], matches, true), matcher(password), true);
    }
    return (0, support_1.sorted)(matches);
}
exports.omnimatch = omnimatch;
//# sourceMappingURL=index.js.map