const { exec } = require('child_process');
const { mkdirsSync } = require('fs-extra');
const inquirer = require('inquirer');

const OUTPUT_DIR = 'dist/diff';
const REPORT_NAME = 'templates.html';
const EXT = '*.hbs';

const questions = [
  {
    type: 'list',
    name: 'from',
    message:
      'The script will generate diff reports for handlebars templates.\n What do you want to use as a first part of comparison?',
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
    message: 'What do you want to use as a second part of comparison?',
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

  const command = `diff2html -s side -f html -F ${OUTPUT_DIR}/${REPORT_NAME} -- -M ${from} ${to} -- ${EXT}`;

  mkdirsSync(OUTPUT_DIR);

  exec(command, err => {
    if (err) {
      console.error(`Diff2html error occurred: ${err}`);

      return false;
    }
  });
});
