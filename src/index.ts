import { Compiler, sources } from "webpack";
const { execSync } = require("child_process");

export interface GitCommitHistoryWebpackPluginOptions {
  /**
   * 生成的文件名
   * @default git-commit-history.txt
   */
  fileName?: string;
}

class GitCommitHistoryWebpackPlugin {
  options: GitCommitHistoryWebpackPluginOptions;

  constructor(options: GitCommitHistoryWebpackPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(
      "GitCommitHistoryWebpackPlugin",
      (compilation, callback) => {
        const fileName = this.options?.fileName ?? "git-commit-history.txt";

        // 设置 execSync 执行的通用参数
        const execSyncParams = { cwd: compiler.context, encoding: "utf8" };

        // 获取当前 git 分支
        const gitBranch = execSync(
          "git symbolic-ref --short HEAD",
          execSyncParams
        );

        // 执行git log命令获取commit记录
        const gitLog = execSync(
          'git log --date=format:"%Y-%m-%d %H:%M:%S" --pretty=format:"%h - %an, %cd: %s" --abbrev-commit',
          execSyncParams
        );

        // 当前时间
        const currentTime = new Date().toLocaleString();

        // 生成文件内容
        const res = `File generation time: ${currentTime}\r\n\r\ncurrent branch: ${gitBranch}\r\n${gitLog}`;

        compilation.assets[fileName] = {
          source: () => res,
          size: () => res.length,
        } as sources.Source;

        callback();
      }
    );
  }
}

module.exports = GitCommitHistoryWebpackPlugin;
