## Stakeholder Meeting November 2nd

# Feedback

1. The button to switch between visualizations is bad, the representation style isn't modal.
  - This should be addressed as we continue in development.  The button is currently a placeholder
  
2. Intervals are randomly disappearing, you should be able to see every single label which
intersects with the current view window.  Intervals shouldn't stop being rendered just because
it's expensive.  (Correctness is more important than efficency)

3. The start and end interval columns should not be labeled X-Axis1 and X-Axis2, it's confusing
and doesn't really convey that the two fields are related to the start and end columns for interval
data.

4. Every transition from either a start or end with interval data should be associated with
a label.  There shouldn't be any start-times, end-times or labels that don't have a time associated
with them.

5. Drawing nominal interval data was brought up, a few options discussed
  - Draw them as non intersecting intervals (probably the hardest)
  - Draw them in distinct categories along individual labels on the Y-axis
It's worth noting that if data is scaled logarithmically, it won't change how these intervals are
drawn relative to the new Y-axis.  They should always be drawn with equidistant spacing

6. Individual point data being drawn by bars isn't looking good, and give the impression of
data being continous over a range, rather than being an individual point in time.  A 'pin' like
representation of this data would be prefered. No matter how close you zoom in, this should never
be drawn larger.

7. Events that happen on the same date aren't currently clear. If events happen at the same time
they should either be layered, or have a 'pincushion' like look, where it's clear that multiple
events are happening at the same time.

8. When scaling gets implemented, it's very possible that data is going right off the screen.  If
that's the case it will be important to have some kind of indicator that the data continues off of
the current canvas.

9. Getting individual event data working is currently the stakeholder top priority.
