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
var _this = this;
module.exports = function (app) {
    app.on('pull_request.opened', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var pattern, _a, number, title, body, login, name, remaining, isMatch, bodyOutput;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b|\b\d{6}\b/g;
                    _a = context.payload.pull_request, number = _a.number, title = _a.title, body = _a.body, login = _a.user.login, name = _a.head.repo.name, remaining = __rest(_a, ["number", "title", "body", "user", "head"]);
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
                    });
                    if (body.length > 0) {
                        bodyOutput += "&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                    // Post a comment for the PR body
                    return [4 /*yield*/, context.github.pullRequests.update({
                            repo: name,
                            owner: login,
                            number: number,
                            body: bodyOutput + body,
                        })];
                case 3:
                    // Post a comment for the PR body
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
//# sourceMappingURL=index.js.map