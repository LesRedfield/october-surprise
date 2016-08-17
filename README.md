# October Surprise

MVP

US States map with states colored by electoral preference, complemented by demographic-segmented
electoral preferences next to the map. When the cursor hovers over a state, those segmented
preferences will update to those of the specific state.

An electoral college forecast will also display for both the nation and individual states. The
segmented preferences will be interactive, allowing the user to adjust preference strength for
individual demographics, updating other segments and the forecasts in real time. There will be
an option to freeze specific demographics, keeping those static so adjusting a single segment
will only proportionally update other segments.

Phase 1: Map

Render map of states (and dummy segments) and set up structure for click events.

Phase 2: Interactivity

Get map to respond to clicks by updating segments, and make segments adjustable by user.

Phase 3: Dependence

Make segment adjustments proportionally change other segments to reflect the changes, and
implement responsive forecasts.

I'll use d3.js and try not to have any backend.
