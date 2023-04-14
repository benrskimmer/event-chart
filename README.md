# Timeline Component

## To Run

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Time Spent:
~60hrs 🙃

## Aspects I appreciate about the design:

### Features
Flexibility
* Supports widely varying event durations.
* Efficiently uses space on page by stacking events only when necessary.
* Highly configurable themes.

Configurability
* Tick configuration
  * Configurable max tick count.
  * Configurable Bars.
  * Configurable padding (crowding).
* Themes
  * Background color.
  * Event color.
  * Border color.
  * Event text color.
  * Tick text color.
  * Tick color.
  * Swimlanes.
  * Swimlane color.
  * Box shadow.
  * Timeline radius.
  * Event Radius.
  * Font.

Usability
* Zoom and pan with smooth scrolling.
* Cleanly truncates event text that is too large.
* Tooltip for events.
* Click + drag to pan.
* Alt scroll pan.
* Disables "back" gesture when cursor is over component.
* Disables page scroll boundary animations when cursor is over component.
* Disables page scrolling when cursor is over component.
* Occupies the full space available for zooming.
* Resizes to screen width.
  * Supports narrow screen width (split screen / mobile).
  * Maintains zoom level.
    * Scales chart size to maintain the same zoom on resize.
  * Maintains view of current events.
    * Recalculates chart container offset on resize.
  * Dynamically scales tick count to avoid crowding.
    * Optimizes tick density within provided limits.
* Reasonably performant
  * Only renders tick marks that are viewable to reduce overhead.
  * Manually inlines css rather than using styled components for frequently updating values.
  * Only calculates stacking order when events update.

### Basis for design decisions
Appearance
* chart.js
  * Ticks and bars.
  * Tick interval scaling and configuration.
    * Max ticks.
    * Tick padding.
  * Zoom and pan.
    * Disables browser page scrolling and default behavior in component.
    * Disables back behavior for two finger scroll on trackpads.
* Monday.com
  * Bars and some of the themes.

Technical
* styled-components vs direct style updates due to performance reasons.
* Decoupled events passed to the timeline from events on the chart by maintaining state internally which allows updating events.
* Only rendering ticks that are on the screen for performance reasons.
* `props` for themes instead of Context API.
* Using `useLayoutEffect` to dynamically figure out tick scaling before rendering.
  * This comes at a performance cost.0
* One-click clear schedule easter egg 🥳
  * On a more serious note, demonstrates event modification which I would've completed with event title changes based on UX.

### Changes I would make if I did it again
* Testing. I have very little experience with frontend testing frameworks and unit testing so would need to learn about this to implement frontend tests. I did break out functions so they'd be testable.
* Context API for themes instead of prop drilling.
* Be more careful about what functions are being run on render and what functions are being redefined.
* Add memoization for callbacks using `useCallback`. Not sure how this works but potentially would give better performance.
* Consider memoizing styled-components or figuring out how to get better performance out of it. A lot of this would depend on figuring out why performance is suffering. It's likely due to CSS class changes on the components or movement of the components.
* Add event title renaming tooltip. Would need to figure out the best UX for this especially given that event names could be truncated inside the event. (eg. modal)
* Would add draggable event handles to change event duration. Also, would add animations so that the user could see where the event ends up. Otherwise this could be a jarring UX for resizing events.
* Support scaling font sizes and rotating tick date text to be vertical instead of horizontal for more dense packing.
* Support inclusive end dates as a configuration item.
* Adding a border to the event skews the offset so events are off center vertically. Fix this offset so events are centered properly with that theme option set.
* When zooming all the way in dates repeat. Maybe limit ticks to one per day or do sub day tick intervals.
* Single day events either don't render or render as lines if a border is enabled. Figure out the ideal UX for this given the end day is currently non-inclusive.
