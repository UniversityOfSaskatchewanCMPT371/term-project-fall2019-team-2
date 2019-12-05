# Meeting Agenda (NOV 30th, 2019)

Meeting with Osgood for Verification of Requirements

## Topics

During this meeting we got the stakeholder to actually use the software in the way they want to use it. This helped us discover many issues.
The most important issues for the stakeholder were:

1. X axis labels weren't scaled according to their values
2. Occurance data should be re-named ad 'labelled'
3. The dropdown menus are ordered Y-X, they should be X-Y.
4. You can select two sets of data for event nominal data, but not in magnitude
  - This is probably too much to add for the coming deliverable as it's more of a feature than a fix
5. A file with a newline character in a row parses the row as entirely null for all entries

Most bugs the stakeholder experienced were already being tracked in git issues. Those that weren't were added, see issue #181, and #180
