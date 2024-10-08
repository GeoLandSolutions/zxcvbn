"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_dictionary_match_feedback = exports.get_match_feedback = exports.get_feedback = exports.default_feedback = void 0;
var dictionary_guesses_1 = require("./scoring/dictionary_guesses");
exports.default_feedback = {
    warning: "",
    suggestions: [
        "Use a few words, avoid common phrases",
        "No need for symbols, digits, or uppercase letters",
    ],
};
function get_feedback(score, sequence) {
    // starting feedback
    if (sequence.length === 0)
        return exports.default_feedback;
    // no feedback if score is good or great.
    if (score > 2) {
        return {
            warning: "",
            suggestions: [],
        };
    }
    // tie feedback to the longest match for longer sequences
    var first = sequence[0], rest = sequence.slice(1);
    var longest_match = first;
    for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
        var match = rest_1[_i];
        if (match.token.length > longest_match.token.length) {
            longest_match = match;
        }
    }
    var feedback = get_match_feedback(longest_match, sequence.length === 1);
    var extra_feedback = "Add another word or two. Uncommon words are better.";
    if (feedback) {
        feedback.suggestions.unshift(extra_feedback);
    }
    else {
        feedback = {
            warning: "",
            suggestions: [extra_feedback],
        };
    }
    return feedback;
}
exports.get_feedback = get_feedback;
function get_match_feedback(match, is_sole_match) {
    switch (match.pattern) {
        case "dictionary":
            return get_dictionary_match_feedback(match, is_sole_match);
        case "spatial":
            return {
                warning: match.turns === 1
                    ? "Straight rows of keys are easy to guess"
                    : "Short keyboard patterns are easy to guess",
                suggestions: ["Use a longer keyboard pattern with more turns"],
            };
        case "repeat":
            return {
                warning: match.base_token.length === 1
                    ? 'Repeats like "aaa" are easy to guess'
                    : 'Repeats like "abcabcabc" are only slightly harder to guess than "abc"',
                suggestions: ["Avoid repeated words and characters"],
            };
        case "sequence":
            return {
                warning: "Sequences like abc or 6543 are easy to guess",
                suggestions: ["Avoid sequences"],
            };
        case "regex":
            if (match.regex_name === "recent_year") {
                return {
                    warning: "Recent years are easy to guess",
                    suggestions: [
                        "Avoid recent years",
                        "Avoid years that are associated with you",
                    ],
                };
            }
            break;
        case "date":
            return {
                warning: "Dates are often easy to guess",
                suggestions: ["Avoid dates and years that are associated with you"],
            };
    }
    return;
}
exports.get_match_feedback = get_match_feedback;
function get_dictionary_match_feedback(match, is_sole_match) {
    var warning = "";
    if (match.dictionary_name === "passwords") {
        if (is_sole_match && !match.l33t && !match.reversed) {
            if (match.rank <= 10) {
                warning = "This is a top-10 common password";
            }
            else if (match.rank <= 100) {
                warning = "This is a top-100 common password";
            }
            else {
                warning = "This is a very common password";
            }
        }
        else if (match.guesses_log10 != undefined && match.guesses_log10 <= 4) {
            warning = "This is similar to a commonly used password";
        }
    }
    else if (match.dictionary_name === "english_wikipedia") {
        if (is_sole_match) {
            warning = "A word by itself is easy to guess";
        }
    }
    else if (["surnames", "male_names", "female_names"].includes(match.dictionary_name)) {
        if (is_sole_match) {
            warning = "Names and surnames by themselves are easy to guess";
        }
        else {
            warning = "Common names and surnames are easy to guess";
        }
    }
    var suggestions = [];
    var word = match.token;
    if (word.match(dictionary_guesses_1.START_UPPER)) {
        suggestions.push("Capitalization doesn't help very much");
    }
    else if (word.match(dictionary_guesses_1.ALL_UPPER) && word.toLowerCase() !== word) {
        suggestions.push("All-uppercase is almost as easy to guess as all-lowercase");
    }
    if (match.reversed && match.token.length >= 4) {
        suggestions.push("Reversed words aren't much harder to guess");
    }
    if (match.l33t) {
        suggestions.push("Predictable substitutions like '@' instead of 'a' don't help very much");
    }
    return {
        warning: warning,
        suggestions: suggestions,
    };
}
exports.get_dictionary_match_feedback = get_dictionary_match_feedback;
//# sourceMappingURL=feedback.js.map