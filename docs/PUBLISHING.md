## Publishing

### Prerelease

A [prerelease](https://github.com/Turfjs/turf/blob/master/.github/workflows/prerelease.yml) action is available that publishes a canary release for every commit or PR merged to the master branch.  However, this action is only [enabled](https://github.com/Turfjs/turf/actions/workflows/prerelease.yml) when needed.

When used, it publishes an alpha release to NPM (e.g. `7.0.0-alpha.116` where 116 is the number of commits to master since the last release tag).
- The version number is calculated by a combination of the output of `git describe` and the `publish:prerelease` script in the root package.json. It is typically setup to do a `minor` prerelease, but can be changed, such as prior to a `major` release.

### Release

A turf release is initiated from your local computer, and then built and published remotely via a github actions.

To make a release as a core contributor, you will need:
- Turf repository write permission
- Turf npm organization publish permission
- A clean local copy of the Turf Github repository (not a fork!).  Starting with a fresh clone will ensure it's clean.
  - Depending on your auth method
    - `git clone git@github.com:Turfjs/turf.git turf-release`
    - or `git clone https://github.com/Turfjs/turf.git turf-release`
  - `cd turf-release` - start at the top-level of the repo
  - `pnpm install`
  - `pnpm test` - make sure everything is passing

- If you choose to clean up an existing copy instead, be very careful:
  - `git remote -v` - verify your remote origin points to `https://github.com/Turfjs/turf.git`
  - `git checkout master`
  - `git reset --hard` - reset your local working copy, will lose any uncommitted or unstashed work!
  - `git fetch origin` - fetch latest commits
  - `git rev-list master...origin/master` - verify local master in sync with remote, command output should be empty
  - `pnpm install`
  - `pnpm test` - make sure everything is passing

Before release:
- If necessary, make and merge a PR with any last minute housekeeping items.
- Turf's documentation (README.md files) should already be up to date as it is generated automatically on commit from JSDoc comments in source files.
- Review PR's and decide the new version number to be published. See [semantic versioning](https://semver.org/).

Run the following release commands, replacing `7.0.0` with your version number:

- create a release branch and switch to it. All building, tagging and publishing will be done on the release branch, and then merged back into master in a later step.
  - `git checkout origin/master -b release-7.0.0`

- increment the version number of all packages, and create a local commit, without pushing to origin.  This will also create a release tag.
  - `pnpm lerna version --no-commit-hooks --no-push 7.0.0`

- Push the release branch and the release tag.
  - `git push origin release-7.0.0 --follow-tags`
  - Pushing the tag will trigger the Github [release](https://github.com/Turfjs/turf/blob/master/.github/workflows/release.yml) action which you can view the status of at - https://github.com/Turfjs/turf/actions.  If successful, a new [version](https://www.npmjs.com/package/@turf/turf?activeTab=versions) of all turf packages will have been published on NPM.

- If the release action was not successful
  - commit any changes to master to fix it.
    - Make a [prerelease](#prerelease) if helpful to make sure the release action is successful.
  - Then reset by deleting your tag and branch locally and remotely.
    - `git push --delete origin v7.1.0`
    - `git tag --delete v7.1.0`
    - `git push -d origin release-7.0.0`
    - `git branch -d release-7.0.0`
  - Now redo the steps above starting with creating "A clean local copy of the Turf Github repository"

- If the release action was successful, now create a Pull Request for the release to merge back to master.
  - You may be given a link in the output of the branch/tag push command to create the PR.
  - If you don't get this message, just go to https://github.com/Turfjs/turf/pulls and you should be prompted at the top to create a PR for this new branch you just pushed.
  - If that prompt doesn't appear, then just create a new pull request from the PR page and make sure the title is the version number e.g. `v7.0.0` and that it is merging your release branch -> to master.
  - Here is an example PR - https://github.com/Turfjs/turf/pull/2615.
  - Get approval for the release PR, then "Squash and merge" it.
    - Do not delete this branch in Github after merging, the release tag points to it.  If you do, click "Restore branch" at the bottom of the merged PR.

#### Follow-on steps
- As part of the release action, a draft Github release will have been created at https://github.com/Turfjs/turf/releases with an auto-generated changelog.
  - Edit and add to the release notes for readability and completeness, specifically noting any breaking changes.  Use past releases as a guide.
  - Be sure to "Save draft" each time, then ask for a review or edits from other contributors.
  - Try not to leave the notes unpublished more than a day, people rely on these notes for upgrading.
  - Once ready, click `Publish release`.  This will make the release notes publicly accessible and notify all watchers of the project.
  - You can edit and republish your release notes after this, but that will likely notify followers, so best to get it right the first time.
- Release a new version of the [API docs](https://github.com/Turfjs/turf-www/blob/master/CONTRIBUTING.md) for the https://turfjs.org website.
