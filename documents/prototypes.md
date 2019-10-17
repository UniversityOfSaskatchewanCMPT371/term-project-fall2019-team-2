# Prototypes

The following document describes all the prototypes we have created, why, and the result
of our testing.

## Bootcamp Prototype

This bootcamp prototypes a C# ASP.NET Project with a React Client app
working together. This bootcamp was used in the meeting on Sept. 25th
to give the team a tutorial on using the GitFlow workflow.

### Objective

This prototype is mainly used as a proof of concept so the team can
get familiar with both technologies. This example code is provided by
Microsoft.

### Result

The project was successfully used to show team members how to use Git,
and to set up their development environments at the meeting on Sept. 25th.

## Jest Prototype

This is a small spike prototype just doing some exploratory work with
Jest, determining the set-up and ease of use.

### Objective

This was just done to test setting up jest, understand dependencies
and help understand what type of config files Jest worked with and
how those config files were formatted

### Results

- Jest requires (like most JS things) npm to run
- The automated testing is set up by making an extra file
called "X.test.js" where X is the name of the file you want
to write tests for.
- Make sure the json config file for the react project has
the 'test' field set to 'jest'
- Run the automated testing via 'npm test'

### Issues of Note

- I couldn't get Jest to work without also installing babel.

## Timeline

Displays a simple timeline from a CSV.

### Objective

Initial spike/throwaway prototype to learn about react and related libraries.

### Results

What did we find out and how are we applying it?
Tested chart.js functionality to see if it will suit our needs for this project - it will not,
however, we may still be able to utilize chart.js for displaying auxiliary charts on the website.
