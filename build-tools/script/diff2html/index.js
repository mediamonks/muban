const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const { mkdirsSync } = require('fs-extra');
const inquirer = require('inquirer');
const addRootDir = require('app-root-dir');
const Diff2HtmlReportBuilder = require('./diff2html-report-builder');
const config = require('../../config/config');

const OUTPUT_DIR = path.resolve(config.distPath, 'diff');
const REPORT_NAME = 'templates.html';
const EXT = '*.hbs';

const questions = [
  {
    type: 'list',
    name: 'from',
    message:
      `The script will generate diff reports for handlebars templates.\n What do you want to use as a first part of comparison, your ${chalk.yellow('previous')} version ?`,
    choices: [
      {
        name: 'Master branch',
        value: 'master',
      },
      {
        name: 'Commit hash or branch name',
        value: 'value',
      },
    ],
  },
  {
    type: 'input',
    name: 'fromValue',
    message: 'Please enter a commit hash',
    when: answers => answers.from === 'value',
    validate: val => val.length > 0,
  },
  {
    type: 'list',
    name: 'to',
    message: `What do you want to use as a second part of comparison, your ${chalk.yellow('current')} version ?`,
    choices: [
      {
        name: 'Branch HEAD',
        value: 'head',
      },
      {
        name: 'Commit hash or branch name',
        value: 'value',
      },
    ],
  },
  {
    type: 'input',
    name: 'toValue',
    message: 'Please enter a commit hash',
    when: answers => answers.to === 'value',
    validate: val => val.length > 0,
  },
];

inquirer.prompt(questions).then(answers => {
  const from = answers.from === 'value' ? answers.fromValue : 'origin/master';
  const to = answers.from === 'value' ? answers.toValue : '';

  mkdirsSync(OUTPUT_DIR);

  const diff2Html = new Diff2HtmlReportBuilder({
    outputFormat: 'side-by-side',
    showFiles: true,
  });

  diff2Html.build(
    {
      from,
      to,
      ext: `src/**/${EXT}`
    },
    // `-M ${from} ${to} -- ${EXT}`,
    path.resolve(addRootDir.get(), OUTPUT_DIR, REPORT_NAME),
  );
  console.log('');
  console.log(`Diff output generated at ${chalk.blue(path.resolve(addRootDir.get(), OUTPUT_DIR, REPORT_NAME))}`);
  console.log('');
});
