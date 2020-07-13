# Release process notes

## Prerelease

- create a new branch with some name
- write up changelog changes (manually), commit that
- yarn lerna version --no-push 6.2.0-alpha.2
- git push origin --follow-tags \$branch
- make PR
- merge PR
- re-fetch the new master and check it out locally
- yarn install
- yarn lerna run prepare
- yarn test
- yarn lerna publish --dist-tag prerelease --ignore-scripts from-package
  - you will likely need to publish several times as your OTP expires
  - you might get rate limited as well
  - between publish attempts, you'll have to undo the gitHead changes in the package.json files
