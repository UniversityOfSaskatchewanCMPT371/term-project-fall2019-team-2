# Incremental Deliverable 5 Readme

## Source Code

[Here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/src) is the link to the current source code for the project, and [Here](https://dev.braunson.me/) is a link to the current development build of the software.

### Notable PRs

- [Error Reporting, Telemetry and User Feedback](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/pull/141)
- [Code Refactor and Interface Construction](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/pull/186)
- [Code Refactor, TimelineModel creation](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/pull/133)
- [Tons of Assertions added by the Test Team](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/pull/146)

## Risk Report

[This](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/Risk%20Analysis.pdf) is our final risk report.  It reflects on previous risks as well as risks as risks faced for this deliverable, and discusses the various plans that were put in place for either contingency or mitigation.

## Reviews Conducted
Every member of the group underwent a formal review throughout the course of the semester. It's also worth noting that not only was everyone reviewed, but everyone reviewed someone at least once. <br/>
Camille [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID2FormalReview.pdf)<br/>
Evan [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID2FormalReview.pdf)<br/>
Amanda [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/riskDocReviewID4.pdf)<br/>
Mesa [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID1FormalReview.pdf)<br/>
Eileen [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID4FormalReview.pdf)<br/>
Braunson [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID3FormalReview.pdf)<br/>
Anurag [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID5FormalReview.pdf)<br/>
Kevin [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/reviews/ID5FormalReview2.pdf)<br/>



## Design Documents, Requirements Documents, and System Flow Diagram

Design documents are located [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/As-Built%20Design%20Documents.pdf), and reflect the current as-built design of the system.  Requirements documents  are located [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/Requirements.pdf) and reflect the most recent changes in requirements by the stakeholder. Finally, [this](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/System%20Flow%20Diagram.pdf) diagram outlines the system flow.

## Meetings With Stakeholders

Stakeholder meetings took place every ID as required.<br/>
[ID1](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/documents/meetings/stakeholder10.5.md)<br/>
[ID2](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/documents/meetings/stakeholder9.4.md)<br/>
[ID3](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/documents/meetings/stakeholder10.4.md)<br/>
[ID4](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/documents/meetings/stakeholder11.17.pdf)<br/>
[ID5](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/documents/meetings/stakeholder11.30.md)<br/>

## Testing

Snap-shot tests are found [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/src/__tests__/__snapshots__) and the unit testing suite is located [here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/src/__tests__).  [This](TODO GENERATE THIS LINK AFTER TEST DESIGN DOCS ARE DONE) is a link to our current test design documentation which outlines both manual and automated tests. [This](https://docs.google.com/spreadsheets/d/1ZnNRrXKV4FqdfMf8I6ga-5IDUYAZFbtIXiw5_pEGHTY/edit#gid=0) is a link to our current test matrix.  [Here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/tree/ID5/scripts) is a link to our Selenium driven smoke tests.

This deliverable also saw the production of a massive amount of assertions.  [Here](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/src/components/ParserComponent.tsx) is a link to some source code where almost all pre-conditions were turned into assertions.


## Issue Tracking

Issue tracking was done through GitIssues.  Initially all bugs were tracked in a spreadsheet located [here](https://docs.google.com/spreadsheets/d/11qek3kybW8FDpSQx1hFBbJkoglNe9v7t2hFg5KaAI44/edit#gid=0).  This spreadsheet was also the basis for our defect estimate seen in the continuity document.


## Builds

Builds in this deliverable only changed slightly to upload release source-maps to Sentry. Sentry
is now used to record errors and user feedback when an error occurs. The sourcemaps allow us to view
exactly what line in our code had the error.

For viewing our current code climate and test coverage, refer to sonarcloud [here](https://sonarcloud.io/dashboard?id=cmpt371-team2) which is updated on every push to the repository.

## Continuity 

[This](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/Continuity%20Document.pdf) document outlines the future of the project, it goes over how to set the project up for development, how to get it set up for continous integration, how to set up testing, defect estimates, and known issues.  It also contains a section on what future developers might do moving forward, as well as some ideas for improving the project as a whole.

## Timelogs and Estimates

[This](https://docs.google.com/spreadsheets/d/1NQE-0Cl15hqOMuEmQf0g8BnSgYWp-6AZVLhdm_tuwbE/edit#gid=688492208) document holds our time log information.  [This](https://github.com/UniversityOfSaskatchewanCMPT371/term-project-fall2019-team-2/blob/ID5/documents/ID5/Time%20and%20Estimations%20Compilation.pdf) document is a compilation of all of the estimates made throughout the project, as well as a summation of all individual estimates made, along with a comparison to the actual amount of time put in.

