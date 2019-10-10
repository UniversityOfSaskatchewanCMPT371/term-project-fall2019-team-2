# Meeting Agenda (OCT 4th, 2019)

Meeting with Osgood for Verification of Requirements

## Topics

1. GUI Mocks
    - Which of the mocks look reasonable?
    - What is your priority of usability features?
    - Our current priority list for design looks like this:
        - Simplicity 5
        - Readability 10
        - User Control 15
        - Conveyance/Intution 7
        - Flexibility Between Data 11
        - Organization 5
        - Effectively Display Info 12
        - Reactivity 7
        - Consistency 5
        - Aesthetically Pleasing 8

2. General Requirements Questions
    - We've assumed this is geared towards power-users, is that correct?
    - What's the priority of the features you have listed in the ideas document?
    - What is the target demographic?
    - Can we get a maximum datasize upper bound?
    
3. Implicit Requirements Questions
    - How robust does the system need to be (maybe wrt bad data)
    - How extensible does this system need to be? (Will there be interest in DB support in the future?)
    
4. Clarification from Syllabus
    - What type of analysis is required for ID2?
        - We currently believe this is an umbrella term for risk analysis/code reviews/testing
    


## After Action Report (Minutes)

- GUI is on the right track.
    - Consider that context menus take up screen real-estate which is important for this project
    - Static menus are okay, but slide-in menus are a nice to have
    - Horizontal real-estate is prefered to vertical real-estate
    - Want the ability to show or hide lines (piecewise linear, and quantification lines) for quantified points
    - Support for different label styles for discrete events (arrows with string labels, individual points on the timeline)
    - Hover-over tool-tips are important
    - For a selected point, we want to be able to display how it relates to other data in it's dataset (how does it
    compare to the mean, the median, etc etc)
    - Switching from one timeline to another is a key feature not currently in use-cases
    - The data isn't deleted, it's just hidden, this should be reflected in the requirements
    - Clustering of data (similar to google maps) would be a good feature
    - A legend is very important, but should probably be hidden unless requested or hovered over
    - Mouse scroll for zoom in/out would be nice, but most people use trackpads so it's a nice to have
    
- Some default behavior is needed:
    - When loading a csv, it should have some type of default behavior for showing the data that covers the average use case
    - We can expect that users have properly shaped the data to fit the system and are aware of it's default behavior
    - One potential way of doing this was that everything to the left of an ID column is automatically shown, everything
    to the right isn't
    - The abililty to override this default behavior is required
    
- End users
    -They won't be PhD's, but we can consider them to be fairly skilled
    
- Missing Use Cases:
    - The ability to select a specific point of data
    - The ability to switch between timelines
    - A granularity option for how often labels show up
    - Having a selection (marquee style) tool is very important
    - A summary of selected the data is very important
    - Y-axis scaling for data (ex: think percent data vs GDP data)
    
- The system needs to be robust with respect to unsorted data, and missing data
    - Missing data should not be displayed
    - The ability of the user to fix how missing data is displayed maybe required in the future
    
- Data set sizes; We're expected to deal with very large data-sets
    - Millions of points is a stretch goal
    - Hundreds of thousands of points is a goal
    - Tens of thousands of points is minimally acceptable, but very bad

- Design considerations out of order:
    - Readability isn't our concern, we should give the user the power to make their own data readable
    
- Other general remarks:
    - Robustness is a huge requirement of the stakeholder, we should probably address this in the req's doc
    - Extensibility to server-side database stuff is beyond the current scope, not on the horizon for
    this semester (although it could be a future project)
    - Analysis in ID2 refers to our analysis of the object oriented design of the system

[Responsibility of the person who created the agenda to fill out the action report]


## Attendance

[Check off who attended]

- [ ] Camille
- [*] Mesa
- [*] Evan
- [ ] Amanda
- [*] Clinton
