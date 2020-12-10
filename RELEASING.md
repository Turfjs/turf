# Release process notes

## Prerelease

- create a new branch with some name
- write up changelog changes (manually), commit that
- yarn lerna version --no-push --no-commit-hooks 6.2.0-alpha.2
  This lets lerna update the package.json versions (and dependencies) and commits the result as well as adds a tag
  --no-push because we can't push to master
  --no-commit-hooks because otherwise the commit hooks will prevent the commit
- git push origin --follow-tags \$branch
- make PR
- merge PR
- re-fetch the new master and check it out locally
- yarn install
- yarn lerna publish --dist-tag prerelease --ignore-scripts from-package
  - --dist-tag is important to avoid tagging this release as the stable release
  - --ignore-scripts skips the build steps since they already ran during yarn install
  - you will likely need to publish several times as your OTP expires
  - you might get rate limited as well
  - between publish attempts, you'll have to undo the gitHead changes in the package.json files
