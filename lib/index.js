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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zxcvbn = void 0;
var matching_1 = require("./matching");
var time_estimates_1 = require("./time_estimates");
var feedback_1 = require("./feedback");
var scoring_1 = require("./scoring");
var dictionary_match_1 = require("./matching/dictionary_match");
var time = function () { return new Date().getTime(); };
function zxcvbn(password, user_inputs) {
    if (user_inputs === void 0) { user_inputs = []; }
    var start = time();
    // reset the user inputs matcher on a per-request basis to keep things stateless
    var sanitized_inputs = [];
    for (var _i = 0, user_inputs_1 = user_inputs; _i < user_inputs_1.length; _i++) {
        var arg = user_inputs_1[_i];
        sanitized_inputs.push(arg.toString().toLowerCase());
    }
    (0, dictionary_match_1.set_user_input_dictionary)(sanitized_inputs);
    var matches = (0, matching_1.omnimatch)(password);
    var result = (0, scoring_1.most_guessable_match_sequence)(password, matches);
    var calc_time = time() - start;
    var attack_times = (0, time_estimates_1.estimate_attack_times)(result.guesses);
    var fb = (0, feedback_1.get_feedback)(result.score, result.sequence);
    return __assign(__assign(__assign({}, result), attack_times), { calc_time: calc_time, feedback: fb });
}
exports.zxcvbn = zxcvbn;
exports.default = zxcvbn;
//# sourceMappingURL=index.js.map