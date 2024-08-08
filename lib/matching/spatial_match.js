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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spatial_match_helper = exports.spatial_match = void 0;
var support_1 = require("./support");
var adjacency_graphs = __importStar(require("../adjacency_graphs"));
// ------------------------------------------------------------------------------
// spatial match (qwerty/dvorak/keypad) -----------------------------------------
// ------------------------------------------------------------------------------
function spatial_match(password, _graphs) {
    var _a;
    if (_graphs === void 0) { _graphs = __assign({}, adjacency_graphs); }
    return (0, support_1.sorted)((_a = []).concat.apply(_a, Object.keys(_graphs).map(function (graph_name) {
        return spatial_match_helper(password, _graphs[graph_name], graph_name);
    })));
}
exports.spatial_match = spatial_match;
var SHIFTED_RX = /[~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?]/;
function spatial_match_helper(password, graph, graph_name) {
    var _a;
    var matches = [];
    var i = 0;
    while (i < password.length - 1) {
        var shifted_count = void 0;
        var j = i + 1;
        var last_direction = null;
        var turns = 0;
        if (["qwerty", "dvorak"].includes(graph_name) &&
            SHIFTED_RX.exec(password.charAt(i))) {
            // initial character is shifted
            shifted_count = 1;
        }
        else {
            shifted_count = 0;
        }
        for (;;) {
            var prev_char = password.charAt(j - 1);
            var found = false;
            var found_direction = -1;
            var cur_direction = -1;
            var adjacents = (_a = graph[prev_char]) !== null && _a !== void 0 ? _a : [];
            // consider growing pattern by one character if j hasn't gone over the edge.
            if (j < password.length) {
                var cur_char = password[j];
                for (var _i = 0, adjacents_1 = adjacents; _i < adjacents_1.length; _i++) {
                    var adj = adjacents_1[_i];
                    cur_direction += 1;
                    if (adj === null || adj === void 0 ? void 0 : adj.includes(cur_char)) {
                        found = true;
                        found_direction = cur_direction;
                        if (adj.indexOf(cur_char) === 1) {
                            // index 1 in the adjacency means the key is shifted,
                            // 0 means unshifted: A vs a, % vs 5, etc.
                            // for example, 'q' is adjacent to the entry '2@'.
                            // @ is shifted w/ index 1, 2 is unshifted.
                            shifted_count += 1;
                        }
                        if (last_direction !== found_direction) {
                            // adding a turn is correct even in the initial case when last_direction is null:
                            // every spatial pattern starts with a turn.
                            turns += 1;
                            last_direction = found_direction;
                        }
                        break;
                    }
                }
            }
            // if the current pattern continued, extend j and try to grow again
            if (found) {
                j += 1;
                // otherwise push the pattern discovered so far, if any...
            }
            else {
                if (j - i > 2) {
                    // don't consider length 1 or 2 chains.
                    matches.push({
                        pattern: "spatial",
                        i: i,
                        j: j - 1,
                        token: password.slice(i, j),
                        graph: graph_name,
                        turns: turns,
                        shifted_count: shifted_count,
                    });
                }
                // ...and then start a new search for the rest of the password.
                i = j;
                break;
            }
        }
    }
    return matches;
}
exports.spatial_match_helper = spatial_match_helper;
//# sourceMappingURL=spatial_match.js.map