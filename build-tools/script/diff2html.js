const { exec } = require('child_process');
const { mkdirsSync } = require('fs-extra');
const inquirer = require('inquirer');

const OUTPUT_DIR = 'dist/diff';
const REPORT_NAME = 'templates.html';
const EXT = '*.hbs';

const questions = [
  {
    type: 'list',
    name: 'type',
    message:
      'The script will generate diff reports for handlebars templates.\n What do you want to use as a diff to the current commit?',
    choices: [
      {
        name: 'Commit hash',
        value: 'hash',
      },
      {
        name: 'Master branch',
        value: 'master',
      },
    ],
  },
  {
    type: 'input',
    name: 'commitHash',
    message: 'Please enter a commit hash',
    when: answers => answers.type === 'hash',
    validate: val => val.length > 0,
  },
];

inquirer.prompt(questions).then(answers => {
  const diff = answers.type === 'hash' ? answers.commitHash : 'origin/master';

  const command = `diff2html -s side -f html -F ${OUTPUT_DIR}/${REPORT_NAME} -- -M ${diff} -- ${EXT}`;

  mkdirsSync(OUTPUT_DIR);

  exec(command, err => {
    if (err) {
      console.error(`Diff2html error occurred: ${err}`);

      return false;
    }
  });
});
