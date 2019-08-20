"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
var SlackAPI = __importStar(require("./slack"));
var Octokit = require('@octokit/rest');
var octokit = Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: 'TaskBot 1.6.0',
});
module.exports = function (app) {
    app.on('pull_request.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var pattern, _a, number, title, body, name, login, remaining, isMatch, bodyOutput;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pattern = /\b[a-zA-Z]{3}\-{1}\d{1,}\b|\b\d{6}\b/g;
                    _a = context.payload.pull_request, number = _a.number, title = _a.title, body = _a.body, name = _a.head.repo.name, login = _a.base.user.login, remaining = __rest(_a, ["number", "title", "body", "head", "base"]);
                    isMatch = title.match(pattern);
                    if (!!isMatch) return [3 /*break*/, 2];
                    return [4 /*yield*/, app.log("No task ID found. Supplied title data: " + title)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    bodyOutput = "";
                    isMatch.forEach(function (taskId, index) {
                        var link = taskId.match(/\b[a-zA-Z]{3}\b/g) ? "https://bluetent.atlassian.net/browse/" : "https://system.na2.netsuite.com/app/accounting/project/projecttask.nl?id=";
                        var displayIndex = index + 1;
                        var taskCount = isMatch.length > 1 ? " (" + displayIndex + "/" + isMatch.length + ")" : "";
                        bodyOutput += "[This pull request relates to this task." + taskCount + "](" + link + taskId.toUpperCase() + ")";
                        if (taskCount.length > 0 && displayIndex < isMatch.length) {
                            bodyOutput += "\n \n";
                        }
                    });
                    if (body.length > 0) {
                        bodyOutput += "\n \n";
                    }
                    // Post a comment for the PR body
                    return [4 /*yield*/, octokit.pulls.update({
                            repo: name,
                            owner: login,
                            pull_number: number,
                            body: bodyOutput + body
                        })];
                case 3:
                    // Post a comment for the PR body
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // app.on('pull_request.opened', async (context) => {
    //   const { number, url, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    // });
    // When PR Draft is ready for review
    app.on('pull_request.ready_for_review', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, number, html_url, title, body, name, login, remaining, message;
        return __generator(this, function (_b) {
            _a = context.payload.pull_request, number = _a.number, html_url = _a.html_url, title = _a.title, body = _a.body, name = _a.head.repo.name, login = _a.base.user.login, remaining = __rest(_a, ["number", "html_url", "title", "body", "head", "base"]);
            message = {
                "attachments": [
                    {
                        "fallback": "TaskBot: Review Pull Request",
                        "color": "good",
                        "author_name": login,
                        "title": "Review Pull Request (" + name + ")",
                        "title_link": html_url,
                        "text": "Pull request #" + number + " is ready to be reviewed.",
                        "fields": [],
                        "footer": "TaskBot",
                    }
                ]
            };
            SlackAPI.postMessage(message);
            return [2 /*return*/];
        });
    }); });
    // When review is edited, deleted, or submitted on a PR
    // app.on('pull_request_review', async (context) => {
    //   // const { user: { login } } = context.payload.review;
    //   const { number, html_url, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    //   const message = {
    //     "attachments": [
    //         {
    //             "fallback": "TaskBot: Review Pull Request",
    //             "color": "good",
    //             "author_name": login,
    //             "title": "Review Pull Request (" + name + ")",
    //             "title_link": html_url,
    //             "text": "Pull request #" + number + " is ready to be reviewed.",
    //             "fields": [],
    //             "footer": "TaskBot",
    //         }
    //       ]
    //     };
    //   SlackAPI.postMessage(message);
    // });
    app.on('pull_request.closed', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, number, html_url, title, merged, body, _b, name, label, login, remaining, message;
        return __generator(this, function (_c) {
            _a = context.payload.pull_request, number = _a.number, html_url = _a.html_url, title = _a.title, merged = _a.merged, body = _a.body, _b = _a.head, name = _b.repo.name, label = _b.label, login = _b.user.login, remaining = __rest(_a, ["number", "html_url", "title", "merged", "body", "head"]);
            message = {};
            if (!merged) {
                message = {
                    "attachments": [
                        {
                            "fallback": "TaskBot: Closed Pull Request",
                            "color": "warning",
                            "author_name": login,
                            "title": "PR #" + number + " Closed",
                            "title_link": html_url,
                            "text": "*" + title + " (" + number + ")* \n>>>" + body,
                            "fields": [
                                {
                                    "title": "Merged",
                                    "value": "FALSE",
                                    "short": false
                                }
                            ],
                            "footer": "TaskBot",
                        }
                    ]
                };
            }
            else {
                message = {
                    "attachments": [
                        {
                            "fallback": "TaskBot: Merged Pull Request",
                            "color": "good",
                            "author_name": login,
                            "title": "PR #" + number + " Closed",
                            "title_link": html_url,
                            "text": "*" + title + " (" + number + ")* \n>>>" + body,
                            "fields": [
                                {
                                    "title": "Merged",
                                    "value": "TRUE",
                                    "short": false
                                }
                            ],
                            "footer": "TaskBot",
                        }
                    ]
                };
            }
            SlackAPI.postMessage(message);
            return [2 /*return*/];
        });
    }); });
    app.on('deployment_status', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, ref, url, environment, _c, state, login, trackedBranches, message;
        return __generator(this, function (_d) {
            _a = context.payload, _b = _a.deployment, ref = _b.ref, url = _b.url, environment = _b.environment, _c = _a.deployment_status, state = _c.state, login = _c.creator.login;
            trackedBranches = [
                'master',
            ];
            if (!trackedBranches.includes(ref)) {
                return [2 /*return*/];
            }
            message = {
                "attachments": [
                    {
                        "fallback": "TaskBot: Deployment Completed",
                        "color": "#42525A",
                        "author_name": login,
                        "title": ref + " (" + environment + ")",
                        "title_link": url,
                        "text": "Deployment (started by " + login + ") has completed.",
                        "fields": [
                            {
                                "title": "Deployment Status",
                                "value": state,
                                "short": false
                            }
                        ],
                        "footer": "TaskBot",
                    }
                ]
            };
            SlackAPI.postMessage(message);
            return [2 /*return*/];
        });
    }); });
};
//# sourceMappingURL=index.js.map