# Incremental Deliverable 4 Readme

## Source Code

[Here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID4/src) is the link to the current source code for the project, and [Here](https://dev.braunson.me/) is a link to the current development build of the software.

### Notable PRs

- [Electron Builds](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/pull/109)

## Mini-Milestones


## Risk Report


## Reviews Conducted


## Design and Requirements Documents


## Meetings With Stakeholders


## Testing

Smoke tests are run on every push to the repository using Jest on each individual component to check that 
the HTML was rendered correctly.

Furthermore, we test the final build output by using a Python script with Selenium to ensure our production
build has the homepage that we expect. **TODO ADD LINK**

## Builds

Builds in this deliverable changed to automatically create our electron builds on MacOS, Linux and Windows
completely automatically whenever we create a new tagged release for this repository. The tagged release will
automatically have build artifacts in the following formats attached to it:

- .snap file type for Linux amd64
- .AppImage file type for Linux amd64
- .exe setup file for Windows amd64
- .dmg setup file for MacOS

In order to create the builds on all the platforms we use a docker image with wine on Linux and run the build
natively on MacOS for the Mac builds.

For viewing our current code climate and test coverage, refer to sonarcloud [here](https://sonarcloud.io/dashboard?id=cmpt371-team2) which is updated on every push to the repository.

## Timelog

[This](https://docs.google.com/spreadsheets/d/1NQE-0Cl15hqOMuEmQf0g8BnSgYWp-6AZVLhdm_tuwbE/edit#gid=688492208) document holds our time log information.

