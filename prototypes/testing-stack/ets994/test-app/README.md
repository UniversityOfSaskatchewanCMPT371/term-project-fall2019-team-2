# Jest Prototype

This is a small spike prototype just doing some exploratory work with
Jest, determining the set-up and ease of use.

## Objective

This was just done to test setting up jest, understand dependencies
and help understand what type of config files Jest worked with and
how those config files were formatted

## Results

- Jest requires (like most JS things) npm to run
- The automated testing is set up by making an extra file
called "X.test.js" where X is the name of the file you want
to write tests for.
- Make sure the json config file for the react project has
the 'test' field set to 'jest'
- Run the automated testing via 'npm test'

## Issues of Note

- I couldn't get Jest to work without also installing babel.