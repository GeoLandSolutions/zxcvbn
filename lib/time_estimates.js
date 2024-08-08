"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display_time = exports.guesses_to_score = exports.estimate_attack_times = void 0;
function estimate_attack_times(guesses) {
    var crack_times_seconds = {
        online_throttling_100_per_hour: guesses / (100 / 3600),
        online_no_throttling_10_per_second: guesses / 10,
        offline_slow_hashing_1e4_per_second: guesses / 1e4,
        offline_fast_hashing_1e10_per_second: guesses / 1e10,
    };
    var crack_times_display = {};
    for (var scenario in crack_times_seconds) {
        var seconds = crack_times_seconds[scenario];
        crack_times_display[scenario] = display_time(seconds);
    }
    return {
        crack_times_seconds: crack_times_seconds,
        crack_times_display: crack_times_display,
        score: guesses_to_score(guesses),
    };
}
exports.estimate_attack_times = estimate_attack_times;
function guesses_to_score(guesses) {
    var DELTA = 5;
    if (guesses < 1e3 + DELTA) {
        // risky password: "too guessable"
        return 0;
    }
    else if (guesses < 1e6 + DELTA) {
        // modest protection from throttled online attacks: "very guessable"
        return 1;
    }
    else if (guesses < 1e8 + DELTA) {
        // modest protection from unthrottled online attacks: "somewhat guessable"
        return 2;
    }
    else if (guesses < 1e10 + DELTA) {
        // modest protection from offline attacks: "safely unguessable"
        // assuming a salted, slow hash function like bcrypt, scrypt, PBKDF2, argon, etc
        return 3;
    }
    else {
        // strong protection from offline attacks under same scenario: "very unguessable"
        return 4;
    }
}
exports.guesses_to_score = guesses_to_score;
function display_time(seconds) {
    var minute = 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 31;
    var year = month * 12;
    var century = year * 100;
    var display_num;
    var display_str;
    if (seconds < 1) {
        display_str = "less than a second";
    }
    else if (seconds < minute) {
        display_num = Math.round(seconds);
        display_str = "".concat(display_num, " second");
    }
    else if (seconds < hour) {
        display_num = Math.round(seconds / minute);
        display_str = "".concat(display_num, " minute");
    }
    else if (seconds < day) {
        display_num = Math.round(seconds / hour);
        display_str = "".concat(display_num, " hour");
    }
    else if (seconds < month) {
        display_num = Math.round(seconds / day);
        display_str = "".concat(display_num, " day");
    }
    else if (seconds < year) {
        display_num = Math.round(seconds / month);
        display_str = "".concat(display_num, " month");
    }
    else if (seconds < century) {
        display_num = Math.round(seconds / year);
        display_str = "".concat(display_num, " year");
    }
    else {
        display_str = "centuries";
    }
    if (display_num !== undefined && display_num !== 1) {
        return display_str + "s";
    }
    return display_str;
}
exports.display_time = display_time;
//# sourceMappingURL=time_estimates.js.map