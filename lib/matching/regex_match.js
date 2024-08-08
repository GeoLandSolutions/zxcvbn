"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex_match = void 0;
var support_1 = require("./support");
//-------------------------------------------------------------------------------
// regex matching ---------------------------------------------------------------
//-------------------------------------------------------------------------------
function regex_match(password, _regexen) {
    if (_regexen === void 0) { _regexen = { recent_year: /19\d\d|200\d|201\d/g }; }
    var matches = [];
    for (var name_1 in _regexen) {
        var rx_match = void 0;
        var regex = _regexen[name_1];
        regex.lastIndex = 0; // keeps regex_match stateless
        while ((rx_match = regex.exec(password))) {
            var token = rx_match[0];
            matches.push({
                pattern: "regex",
                token: token,
                i: rx_match.index,
                j: rx_match.index + rx_match[0].length - 1,
                regex_name: name_1,
                regex_match: rx_match,
            });
        }
    }
    return (0, support_1.sorted)(matches);
}
exports.regex_match = regex_match;
//# sourceMappingURL=regex_match.js.map