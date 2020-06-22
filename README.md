# Muban Website

This branch is not Muban itself, but the website hosted on https://mediamonks.github.io/muban/.

To deploy a new version:

* do the changes in this branch + commit/push
* optionally; create a PR for approval
* run `yarn build`
* copy the contents of `/dist/site` to the `gp-pages` branch
* commit+push the `gh-pages` branch

Do not directly make changes in the `gh-pages` branch.
