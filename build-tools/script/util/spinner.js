const ora = require('ora');

/**
 * Manages a spinner with the same start/done/failed output
 * @param label
 * @returns {{spinner: Ora, succeed(): void, fail(): void}}
 */
function createTaskSpinner(label) {
  const spinner = ora(`Starting ${label}...`);
  spinner.start();

  return {
    spinner,
    succeed() {
      console.log();
      spinner.succeed(`${label} done!`);
      console.log();
    },
    fail() {
      spinner.fail(`${label} failed`);
    }
  }
}

module.exports = {
  createTaskSpinner: createTaskSpinner,
};
