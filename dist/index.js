"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execSync = require("child_process").execSync;
var chalk = require("chalk");
var GitCommitHistoryWebpackPlugin = /** @class */ (function () {
    function GitCommitHistoryWebpackPlugin(options) {
        this.options = options;
    }
    GitCommitHistoryWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync("GitCommitHistoryWebpackPlugin", function (compilation, callback) {
            var _a, _b;
            var fileName = (_b = (_a = _this.options) === null || _a === void 0 ? void 0 : _a.fileName) !== null && _b !== void 0 ? _b : "git-commit-history.txt";
            // 设置 execSync 执行的通用参数
            var execSyncParams = { cwd: compiler.context, encoding: "utf8" };
            var gitBranch = '';
            var gitLog = '';
            try {
                // 获取当前 git 分支
                gitBranch = execSync("git symbolic-ref --short HEAD", execSyncParams);
            }
            catch (error) {
                console.log(chalk.red("Error: Failed to get git commit history. Please check whether the current repository uses git."));
            }
            try {
                // 执行git log命令获取commit记录
                gitLog = execSync('git log --date=format:"%Y-%m-%d %H:%M:%S" --pretty=format:"%h - %an, %cd: %s" --abbrev-commit', execSyncParams);
            }
            catch (error) {
                console.log(chalk.red("Error: Failed to get git commit history. Please check whether the current repository uses git."));
            }
            // 当前时间
            var currentTime = new Date().toLocaleString();
            // 生成文件内容
            var res = "File generation time: ".concat(currentTime, "\r\n\r\ncurrent branch: ").concat(gitBranch, "\r\n").concat(gitLog);
            compilation.assets[fileName] = {
                source: function () { return res; },
                size: function () { return res.length; },
            };
            callback();
        });
    };
    return GitCommitHistoryWebpackPlugin;
}());
module.exports = GitCommitHistoryWebpackPlugin;
