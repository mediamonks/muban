# Code Quality Tools

## EditorConfig

We use [EditorConfig](http://editorconfig.org/) define and maintain consistent coding styles between
different editors and IDEs. Please make sure to enable/install the EditorConfig plugin in your IDE
of choice.

* indentation of `2 spaces`
* use `lf` line endings
* use `utf-8` charset
* trim trailing whitespaces
* add en empty newline at the end of each file

## Prettier

We use [Prettier](https://github.com/prettier/prettier) to format all our code. This is enabled for
`js`, `ts`, `scss` and `yaml` files. The corresponding linters are configured to adhere to the rules
from prettier (so they won't conflict), and linting errors should only occur for non-stylistic
errors.

Prettier is configured for:

* indentation of `2 spaces`
* the use of `semicolons`
* the use of `single quotes`
* a tab width of `100`

Prettier is configured to run on the `pre-commit` using `husky` and `lint-staged` hook, and can also
be manually invoked by:

```
yarn prettify
```

Settings can be changed in `.prettierrc` and files can be ignored in `.prettierignore`.

Please check the [editor integration](https://github.com/prettier/prettier#editor-integration)
section of the Prettier readme to enable running Prettier within your IDE of choice.

Keep in mind, that if you choose to automatically run Prettier when saving your file, Webpack will
run twice (on your manual save, and when prettier reformats your code), slowing down the developer
experience.

## Linting

The below tools are used to lint our code. They can be all executed with:

```
yarn lint
```

### eslint

We use [eslint](https://eslint.org/) lint our JavaScript code. It's configured for use with
Prettier, and set up to understand Webpack imports. It follows the
[AirBnB styleguide](https://github.com/airbnb/javascript) with some super small tweaks.

Settings can be changed in `.eslintrc.js` and files can be ignored in `.eslintignore`.

```
yarn lint:js
```

### tslint

We use [tslint](https://palantir.github.io/tslint/) lint our TypeScript code. It's configured for
use with Prettier. It follows the [AirBnB styleguide](https://github.com/airbnb/javascript) with
some super small tweaks. It's consistent with the eslint settings.

Settings can be changed in `.tslintrc.js`.

```
yarn lint:ts
```

### stylelint

We use [stylelint](https://github.com/stylelint/stylelint) lint our SCSS code. It's configured for
use with Prettier and uses
[stylelint-config-recommended-scss](https://github.com/kristerkari/stylelint-config-recommended-scss)
without any modifications.

Settings can be changed in `.stylelintrc` and files can be ignored in `.stylelintignore`.

```
yarn lint:css
```

## pre-commit hook

To make sure all code checked in to git, we use [husky](https://github.com/typicode/husky) to
configure git commit hooks. The `pre-commit` hook is configured to run
[lint-staged](https://github.com/okonet/lint-staged) on the files that are about to be committed.

It will run all linters on the appropriate files, and allows Prettier to reformat any code before
doing the actual commit.

You can also run the command manually:

```
yarn precommit
```

Keep in mind that some lint errors might pop up in files that are not updated by changing other
things (like imports that are not correct after renaming a file), so it's good practice to run
`yarn lint` once in while to verify the complete codebase is valid.
