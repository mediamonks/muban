const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const diff2Html = require('diff2html').Diff2Html;

class Diff2HtmlReportBuilder {
  /**
   * Returns output of git diff command
   *
   * @param {object} args
   * @param {string?} args.from
   * @param {string?} args.to
   * @param {string?} args.ext
   * @returns {string}
   */
  static runGitDiff(args = {}) {
    let gitArgs;
    const { ext, ...rest } = args;

    const wrapper = arg => '"' + arg + '"';

    if (rest.from || rest.to) {
      gitArgs = Object.values(rest)
        .filter(x => x)
        .map(wrapper)
        .join(' ');
    } else {
      gitArgs = '-M -C HEAD';
    }

    gitArgs += ' --';

    if (ext) {
      gitArgs += ` ${wrapper(ext)}`;
    }

    gitArgs += ' --no-color';

    const diffCommand = 'git diff ' + gitArgs;

    return childProcess.execSync(diffCommand).toString('utf8');
  }

  static getCommitHash(commit) {
    const hash = childProcess.execSync(`git rev-parse ${commit}`).toString('utf8');
    const timestamp = childProcess.execSync(`git show -s --format=%ci ${hash}`).toString('utf8');


    return `${hash} - ${timestamp}`;
  }

  /**
   * @param {object} config
   * Options:
   * style: "<side-by-side|line-by-line>"
   * summary: true|false
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Build diff report
   *
   * @param {object} gitArgs
   * @param {string} outputPath
   */
  build(gitArgs, outputPath) {
    const diff = Diff2HtmlReportBuilder.runGitDiff(gitArgs);
    const html = this.generateHTMLReportFromDiff(diff, {
      from: Diff2HtmlReportBuilder.getCommitHash(gitArgs.from),
      to: Diff2HtmlReportBuilder.getCommitHash(gitArgs.to || 'HEAD'),
    });

    fs.writeFileSync(outputPath, html);
  }

  /**
   * @param {string} input
   * @param {object} gitCommits
   * @param {string} gitCommits.from
   * @param {string} gitCommits.to
   * @returns {string}
   */
  generateHTMLReportFromDiff(input, gitCommits) {
    const config = Object.assign({}, this.config);

    config.wordByWord = this.config.diff === 'word';
    config.charByChar = this.config.diff === 'char';

    const jsonContent = diff2Html.getJsonFromDiff(input, config);

    config.inputFormat = 'json';
    config.synchronisedScroll = this.config.synchronisedScroll === 'enabled';

    return this.prepareHTML(diff2Html.getPrettyHtml(jsonContent, config), {
      ...gitCommits,
      ...config,
    });
  }

  /**
   * @param {string} content
   * @param {object} config
   * @returns {string}
   */
  prepareHTML(content, config) {
    const templatePath = path.resolve(__dirname, 'template.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    const diff2htmlPath = path.join(path.dirname(require.resolve('diff2html')), '..');

    const cssFilePath = path.resolve(diff2htmlPath, 'dist', 'diff2html.min.css');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');

    const jsUiFilePath = path.resolve(diff2htmlPath, 'dist', 'diff2html-ui.min.js');
    const jsUiContent = fs.readFileSync(jsUiFilePath, 'utf8');

    return template
      .replace('<!--diff2html-css-->', '<style>\n' + cssContent + '\n</style>')
      .replace('<!--diff2html-js-ui-->', '<script>\n' + jsUiContent + '\n</script>')
      .replace('<!--diff2html-from-->', config.from)
      .replace('<!--diff2html-to-->', config.to)
      .replace(
        '//diff2html-fileListCloseable',
        'diff2htmlUi.fileListCloseable("#diff", ' + config.showFilesOpen + ');',
      )
      .replace(
        '//diff2html-synchronisedScroll',
        'diff2htmlUi.synchronisedScroll("#diff", ' + config.synchronisedScroll + ');',
      )
      .replace('<!--diff2html-diff-->', content);
  }
}

module.exports = Diff2HtmlReportBuilder;
