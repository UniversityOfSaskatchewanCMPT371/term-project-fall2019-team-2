# Meeting Agenda (October 11th, 2019)

DESCRIPTION

## Topics

[Group members can add topics if there is something to share/bring up/solve]
0. Review Design
1. Stubs and Pre/Post Conditions are supposed to be done tonight
  - Once this is done then we can begin implementation
2. How many people are needed for implementation?
3. How many people are needed to write tests?
4. Are we on track? Is the current Gantt chart fair/appropriate?
  - Is it possible to parallelize this more?
    - Would mocks aid with this?
5. Bug party after feature freeze?
6. Is Trello premium worth it?

## After Action Report (Minutes)

>Duration: ~1.5 hours

0. Design underwent considerable change.
 	- We now have a data class, this class has allowed us to do away with storing things
  globally.
		- It stores an array of data for each row
		- It has a "filter" object (specified later)
    
	- We now how a filter class, this class specifies the range a data is being drawn
	as well as a list of predicates which allow the user to query the data, and a
	boolean which specifies whether or not a row is being drawn
	
	- These two changes should help to make the code more modular, and allow for more
	scalability in the future.
	
1. Stubs and Pre/Post Conditions
	- Still not done
	
2. Mesa believes he will need roughly 2 people on the dev team with him, as of now that will be
Camille and Anurag

3. Eileen believes she will need 3 people to help her write tests, as of now that will be
Kevin and Amanda

4. The Gantt chart seems reasonable

5. We agreed on a bug party after the feature freeze. We will need to solidify this into a date

6. Trello premium would be great, but we learned that it isn't just $10 a month, it's $10/user/month
which is entirely out of our budget.

[Check off who attended]

- [x] Camille
- [x] Anurag
- [x] Mesa
- [x] Braunson
- [x] Evan
- [ ] Eileen
- [x] Kevin
- [ ] Amanda
- [ ] Clinton
