import React from 'react';
import TimelineInterface, {TimelineState} from './TimelineInterface';
import * as d3
  from 'd3';
import './Timeline.css';
import * as TimSort
  from 'timsort';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import TimelineModel from './TimelineModel';
import TimelineTypeInterface from './TimelineTypes/TimelineTypeInterface';
import EventMagnitude from './TimelineTypes/EventMagnitude';
import IntervalMagnitude from './TimelineTypes/IntervalMagnitude';
import EventOccurrence
  from './TimelineTypes/EventOccurrence';
import assert from 'assert';


export enum ViewType {
  IntervalMagnitude= 0,
  IntervalOccurrence = 1,
  EventMagnitude = 2,
  EventOccurrence = 3
}

const m = new TimelineModel();
let timelineType: TimelineTypeInterface = new EventMagnitude(m);

/**
 * Purpose: renders and updates a timeline to the screen
 */
export default class TimelineComponent
  extends React.Component<TimelineInterface, TimelineState> {
  /**
   * Purpose: constructor for the TimelineComponent
   * @param {TimelineComponent} props
   */
  constructor(props: TimelineInterface) {
    super(props);
    this.state = {
      data: props.data,
      width: window.innerWidth,
      height: window.innerHeight,
      marginTop: 0,
      marginBottom: 170,
      marginLeft: 40,
      marginRight: 20,
      togglePrompt: 'Switch to Interval Timeline',
      yColumn: '',
      xColumn: '',
      xColumn2: '',
      loading: true,
      view: ViewType.EventMagnitude,
    };

    this.drawTimeline = this.drawTimeline.bind(this);
    this.toggleTimeline = this.toggleTimeline.bind(this);
    this.changeTimelineType = this.changeTimelineType.bind(this);
    this.initTimeline = this.initTimeline.bind(this);
    this.ttOverHelper = this.ttOverHelper.bind(this);
    this.ttOver = this.ttOver.bind(this);
    this.ttUpdatePos = this.ttUpdatePos.bind(this);
    this.ttMove = this.ttMove.bind(this);
    this.ttMove = this.ttMove.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.updateBars = this.updateBars.bind(this);
    this.moveChart = this.moveChart.bind(this);
    this.drawEventMagnitude = this.drawEventMagnitude.bind(this);
    this.drawIntervalMagnitude = this.drawIntervalMagnitude.bind(this);
    this.dragStarted = this.dragStarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragEnded = this.dragEnded.bind(this);
    this.resetTimeline = this.resetTimeline.bind(this);
    this.sortData = this.sortData.bind(this);
    this.changeColumn = this.changeColumn.bind(this);
    this.getEventMagnitudeData = this.getEventMagnitudeData.bind(this);
    this.getIntervalMagnitudeData = this.getIntervalMagnitudeData.bind(this);
  }

  /**
   * Get the current scale data for zooming of keys
   * @return {number}: The scale
   */
  getScale(): number {
    return m.scale;
  }

  /**
   * Get the current delta value for panning left and right
   * @return {number}: The deltaX
   */
  getDeltaX(): number {
    return m.deltaX;
  }

  /**
   * Purpose: waits until the component has properly mounted before drawing the
   * timeline
   */
  componentDidMount(): void {
    if (this.state.data.columns !== null &&
      this.state.data.columns !== undefined) {
      const cols = this.state.data.columns;
      let yColumnSet = false;
      let xColumnSet = false;
      let xColumn2Set = false;

      m.yColumns = [];
      m.xColumns = [];
      m.columns = cols;

      // iterate through columns and set default values
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        // Plotting occurrence data isn't yet supported, so we are only
        // interested in plotting magnitude data for the y-axis
        if (col.primType === 'number') {
          m.yColumns.push(col);
          if (!yColumnSet) {
            this.setState(() => {
              return {
                yColumn: col.key,
              };
            });
            m.yColumn = col.key;
            yColumnSet = true;
          }
        }

        if (col.primType === 'date' || col.primType === 'number') {
          m.xColumns.push(col);
          if (!xColumnSet) {
            this.setState(() => {
              return {
                xColumn: col.key,
              };
            });
            m.xColumn = col.key;
            xColumnSet = true;
            // continue so the next if isn't evaluated on the same element
            continue;
          }
          // if xColumn has already been set, set xColumn2 to the next suitable
          // column
          if (xColumnSet && !xColumn2Set) {
            this.setState(() => {
              return {
                xColumn2: col.key,
              };
            });
            m.xColumn2 = col.key;
            xColumn2Set = true;
          }
        }
      }
      // render the timeline
      this.setState(() => {
        return {
          loading: false,
        };
      }, () => {
        this.initTimeline();
        this.drawTimeline();
      });
    }
  }

  /**
   * Purpose: to sort data by the column passed in
   * @param {string} column
   */
  async sortData(column: string) {
    const cols = this.state.data.columns;
    if (cols !== null && cols !== undefined) {
      const col = cols.find((elem) => {
        return elem.key === column;
      });

      if (col !== null && col !== undefined) {
        const data = this.state.data;
        if (col.primType === 'date') {
          const keyInt = `${column}_num`;
          TimSort.sort(data.arrayOfData, function(a: any, b: any) {
            if (!a.hasOwnProperty(keyInt)) {
              a[keyInt] = Date.parse(a[column]);
            }
            if (!b.hasOwnProperty(keyInt)) {
              b[keyInt] = Date.parse(b[column]);
            }
            return (a[keyInt] - b[keyInt]);
          });
        } else {
          TimSort.sort(data.arrayOfData, function(a: any, b: any) {
            return (a[column] - b[column]);
          });
        }

        this.setState(() => {
          return {
            data,
          };
        });
      }
    }
  }

  /**
   * Purpose: used to change the selected column for the timeline
   * @param {any} e
   * @param {string} column
   */
  async changeColumn(e: any, column: string) {
    const val = e.target.value;

    // @ts-ignore
    if (column === 'yColumn') {
      this.setState(() => {
        return {
          yColumn: val,
        };
      });
      m.yColumn = val;
    } else if (column === 'xColumn') {
      this.setState(() => {
        return {
          xColumn: val,
        };
      }, () => this.sortData(val));
      m.xColumn = val;
    } else if (column === 'xColumn2') {
      this.setState(() => {
        return {
          xColumn2: val,
        };
      });
      m.xColumn2 = val;
    }
    this.resetTimeline();
  }


  /**
   * Purpose: to clear and redraw the timeline
   */
  resetTimeline() {
    d3.selectAll('svg').remove();
    this.initTimeline();
    this.drawTimeline();
  }

  /**
   * Purpose: renders the initial html
   * @return {string}: html output to the page
   */
  render() {
    const contents = this.state.loading ?
      <p>
        <em>loading...</em>
      </p> :
      <div>
        <div>
          <Button
            variant='primary'
            onClick={this.toggleTimeline}>{this.state.togglePrompt}
          </Button>

          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text
                id='inputGroup
                Prepend'>Timeline Type</InputGroup.Text>
            </InputGroup.Prepend>

            <Form.Control
              as='select'
              id='timelineTypeSelect'
              // value={ViewType[this.state.view]}
              onChange={(e) => {
                this.changeTimelineType(e);
              }}>
              <option value={ViewType.IntervalMagnitude}>
                Interval Magnitude
              </option>
              <option value={ViewType.IntervalOccurrence}>
                Interval Occurrence
              </option>
              <option selected value={ViewType.EventMagnitude}>
                Event Magnitude
              </option>
              <option value={ViewType.EventOccurrence}>
                Event Occurrence
              </option>
            </Form.Control>

          </InputGroup>

          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text
                id='inputGroup
                Prepend'>yColumn</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as='select'
              id='ySelect'
              // value={this.state.yColumn}
              value={m.yColumn}
              onChange={async (e) => {
                await this.changeColumn(e, 'yColumn');
              }}>
              {
                m.yColumns.map((col: any, i: number) =>
                  <option
                    key={i}
                    value={col.key}>{col.key}</option>)
              }
            </Form.Control>

            <InputGroup.Prepend>
              <InputGroup.Text
                id='inputGroup
                Prepend'>xColumn</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as='select'
              id='xSelect'
              value={this.state.xColumn}
              onChange={(e) => {
                this.changeColumn(e, 'xColumn');
              }}>
              {
                m.xColumns.map((col: any, i: number) =>
                  <option
                    key={i}
                    value={col.key}>{col.key}</option>)
              }
            </Form.Control>

            <InputGroup.Prepend>
              <InputGroup.Text
                id='inputGroup
                Prepend'>Ending
                Range</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as='select'
              id='x2Select'
              value={this.state.xColumn2}
              onChange={(e) => {
                this.changeColumn(e, 'xColumn2');
              }}>
              {
                m.xColumns.map((col: any, i: number) =>
                  <option
                    key={i}
                    value={col.key}>{col.key}</option>)
              }
            </Form.Control>
          </InputGroup>
        </div>
        <div
          id='svgtarget'>
        </div>
      </div>
    ;
    // @ts-ignore
    return (
      <div id='timelineComponentDiv'>
        {contents}
      </div>);
  }

  /**
   * Purpose: toggles between interval and occurrence timelines
   */
  toggleTimeline() {
    let prompt = this.state.togglePrompt;

    switch (m.view) {
      case ViewType.EventMagnitude:
        prompt = 'Switch to Occurrence Timeline';
        m.view = ViewType.IntervalMagnitude;
        timelineType = new IntervalMagnitude(m);
        break;

      case ViewType.IntervalMagnitude:
        prompt = 'Switch to Interval Timeline';
        m.view = ViewType.EventMagnitude;
        timelineType = new EventMagnitude(m);
        break;
    }

    this.setState(() => {
      return {
        togglePrompt: prompt,
        view: m.view,
      };
    }, () => {
      this.resetTimeline();
    });
  }

  /**
   * Purpose: changes the timeline type to the one desired by the user
   * @param {any} e: the event to pass into the function
   */
  changeTimelineType(e: any) {
    const val = Number.parseInt(e.target.value);
    console.log(e.target.value);
    console.log(ViewType[val]);
    console.log(m.view);
    m.view = val;

    switch (m.view) {
      case ViewType.IntervalMagnitude:
        timelineType = new IntervalMagnitude(m);
        break;

      case ViewType.IntervalOccurrence:
        // timelineType = new IntervalMagnitude(m);
        break;

      case ViewType.EventMagnitude:
        timelineType = new EventMagnitude(m);
        break;

      case ViewType.EventOccurrence:
        timelineType = new EventOccurrence(m);
        break;
    }

    this.setState(() => {
      return {
        view: m.view,
      };
    }, () => {
      this.resetTimeline();
    });
  }

  /**
   * Stores the zoom object for programmatically adjusting the zoom
   */
  private zoom: any;
  /**
   * Stores the D3 svg for appending elements. The SVG is the primary
   * D3 element we use for storing the graph.
   */
  private svg: any;

  /**
   * Purpose: sets the initial values for rendering the actual timeline
   */
  initTimeline() {
    const elem: any = d3.select('#svgtarget');
    let newHeight = this.state.height;

    console.log(elem);
    if (elem !== null && elem.node() !== null) {
      const rect = elem.node().getBoundingClientRect();
      // this is the proper height for our timeline
      newHeight = window.innerHeight - rect.top;

      // Update the height
      this.setState(() => {
        return {
          height: newHeight,
        };
      });
    }

    // m.yColumn = this.state.yColumn;
    // m.xColumn = this.state.xColumn;
    // m.xColumn2 = this.state.xColumn2;
    // this.state.height cannot be trusted to be accurate
    m.fullHeight = newHeight;
    m.fullWidth = this.state.width;
    m.view = this.state.view;
    m.height = m.fullHeight - (m.marginBottom + m.marginTop);

    m.width = m.fullWidth - (m.marginLeft + m.marginRight);

    m.numBars = Math.floor(m.width / m.barWidth) +
      m.barBuffer;// small pixel buffer to ensure smooth transitions

    m.dataIdx = 0;
    m.deltaX = 0;
    m.scale = 1;
    m.csvData = this.state.data.arrayOfData;

    m.data = m.csvData.slice(0, m.numBars);
    // ordinals = data.map((d: any) => d[xColumn]);

    // @ts-ignore
    m.minDate = new Date(d3.min(
        [d3.min(m.csvData, (d: any) => Date.parse(d[m.xColumn])),
          d3.min(m.csvData, (d: any) => Date.parse(d[m.xColumn2]))]));

    // @ts-ignore
    m.maxDate = new Date(d3.max(
        [d3.min(m.csvData, (d: any) => Date.parse(d[m.xColumn])),
          d3.max(m.csvData, (d: any) => Date.parse(d[m.xColumn2]))]));

    m.timeScale = d3.scaleTime()
        .domain([m.minDate, m.maxDate])
        .range([0, 50 * m.csvData.length]);

    m.x = d3.scaleBand()
    // may need this in the future for spacing so leaving in
    // .padding(1)
        .domain(m.data.map((d: any) => d[m.xColumn]))
        .range([0, m.width]).round(true);

    // This has to be used so sonarcloud doesn't freak out about unused
    // variables
    console.log(m.x(0));

    if (m.view == ViewType.IntervalMagnitude ||
        m.view == ViewType.EventMagnitude) {
      m.y = d3.scaleLinear()
          .domain([d3.min(m.csvData,
              (d) => {
                // @ts-ignore
                return d[m.yColumn];
              }),
          d3.max(m.csvData, (d) => {
            // @ts-ignore
            return d[m.yColumn];
          })])
          .range([m.height, 0]);
    } else {
      assert(m.csvData.length > 0);
      m.y = d3.scaleBand()
          .domain(d3.map(m.csvData, (d: any) => d[m.yColumn]).keys())
          .range([m.height, 0]);
    }


    m.extent = [[m.marginLeft, m.marginTop],
      [m.width - m.marginRight, m.height - m.marginTop]];
  }

  /**
   * Purpose: draws the timeline and runs the functions and event handlers for
   * said timeline
   */
  drawTimeline() {
    this.zoom = d3.zoom()
        .scaleExtent([1, 20]) // zoom range
        .translateExtent(m.extent)
        .extent(m.extent)
        .on('zoom', this.updateChart);

    this.svg = d3.select('#svgtarget')
        .append('svg')
        .attr('width', m.width)
        .attr('height', m.height + m.marginTop +
        m.marginBottom)
    // @ts-ignore
        .call(this.zoom)
        .append('g')
        .attr('transform', `translate(${m.marginLeft}, ${m.marginTop})`);

    this.svg.append('rect')
        .attr('width', m.width)
        .attr('height', m.height)
        .style('fill', 'none');

    this.svg.append('defs')
        .append('clipPath')
        .attr('id', 'barsBox')
        .append('rect')
        .attr('width', m.width)
        .attr('height', m.height + m.marginTop +
        m.marginBottom)
        .attr('x', 0)
        .attr('y', 0);

    const barsLayer = this.svg.append('g')
        .attr('clip-path', 'url(#barsBox)')
        .append('g')
        .attr('id', 'barsLayer')
        .call(d3.drag()
            .on('start', this.dragStarted)
            .on('drag', this.dragged)
            .on('end', this.dragEnded));

    const axisLayer = this.svg.append('g')
        .attr('id', 'axisLayer');

    axisLayer.append('g')
        .style('color', 'red')
        .attr('class', 'y axis')
        .call(d3.axisLeft(m.y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('color', 'red')
        .text('yColumn');

    m.plot = barsLayer.append('g')
        .attr('class', 'plot')
        .attr('id', 'bars');

    // Labels
    timelineType.drawLabels(this.svg);

    this.updateBars();

    this.registerEvents();
  }

  /**
   * Draw the axis labels
   * @return {void}: Nothing
   */
  private drawLabels(): void {
    timelineType.drawLabels(this.svg);
  }

  /**
   * Register events on D3 elements.
   * @return {void}: Nothing
   */
  private registerEvents(): void {
    let currKey: string = '';
    let movingTimeout: number = -1;

    const startMoving = (op: string) => {
      if (movingTimeout === -1) {
        loop(op);
      }
    };

    // helper() that loops until key is released
    const loop = (op: string) => {
      // moveChart depending on operation
      if (op === '-' || op === 's') {
        // Zoom out
        const identity = d3.zoomIdentity
            .scale(Math.max(m.scaleMin, m.scale * m.scaleZoomOut));

        this.svg.transition().ease(d3.easeLinear).duration(300)
            .call(this.zoom.transform, identity);
        // Ensure the new scale is saved with a limit on the minimum
        //  zoomed out scope
        m.scale = Math.max(m.scaleMin, m.scale * m.scaleZoomOut);
      } else if (op === '+' || op === 'w') {
        // Zoom In
        const identity = d3.zoomIdentity
            .scale(m.scale * m.scaleZoomIn);

        this.svg.transition().ease(d3.easeLinear).duration(300)
            .call(this.zoom.transform, identity);
        // Ensure the new scale is saved
        m.scale = m.scale * m.scaleZoomIn;
      } else if (op === 'ArrowLeft') {
        // Pan Left
        m.deltaX = Math.min(0, m.deltaX + m.deltaPan);
        // console.log(deltaX);
        this.moveChart();
      } else if (op === 'ArrowRight') {
        // Pan Right
        m.deltaX -= m.deltaPan;
        this.moveChart();
      }
      movingTimeout = setTimeout(loop, 25, op);
    };

    // Handle keypresses
    d3.select('body')
        .on('keydown', () => {
          if (currKey === '') {
            if (d3.event.key === '-' || d3.event.key === 's') {
            // zoom out
              currKey = d3.event.key;
            } else if (d3.event.key === '+' || d3.event.key === 'w') {
            // Zoom in
              currKey = d3.event.key;
            } else if (d3.event.key === 'ArrowLeft') {
            // Pan left
              currKey = d3.event.key;
            } else if (d3.event.key === 'ArrowRight') {
            // Pan right
              currKey = d3.event.key;
            }
            if (currKey !== '') {
              startMoving(currKey);
            }
          }
        });

    d3.select('body')
        .on('keyup', () => {
          clearTimeout(movingTimeout);
          movingTimeout = -1;
          currKey = '';
        });
  }

  /**
   * Purpose: this function exists explicitly so the core functionality of
   * ttOver cna be tested, as testing d3 events is quite difficult
   * @param {any} d
   * @param {number} x
   * @param {number} y
   */
  ttOverHelper(d: any, x: number, y: number) {
    const Tooltip = d3.select('#svgtarget')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .attr('target', null)
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('left', `${x + 70}px`)
        .style('top', `${y}px`);

    const keys = Object.keys(d);
    let tooltip: string = '';
    keys.forEach(function(key) {
      tooltip += '<strong>' + key + '</strong> <span style=\'color:red\'>' +
        d[key] + '</span><br/>';
    });

    Tooltip.html(tooltip);

    if (Tooltip.node() !== null) {
      const ttBox = Tooltip.node()!.getBoundingClientRect();

      if ((ttBox.top + ttBox.height) > m.height) {
        Tooltip.style('top', (m.fullHeight - ttBox.height) + 'px');
      }

      Tooltip.style('opacity', 1);
    } else {
      Tooltip.remove();
      console.warn('Error adding Tooltip to the DOM');
    }
  }

  /**
   * Purpose: adds the tooltip to the canvas when the user mouses over a piece
   * of timeline data.
   * Timeline scope: all elements
   * @param {any} d
   */
  ttOver(d: any) {
    try {
      if (d3.event.buttons === 0) {
        // console.log(d3.event);
        this.ttOverHelper(d, d3.event.x, d3.event.y);
      }
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  /**
   * Purpose: updates the position of the Tooltip
   * Timeline Scope: all elements
   * @param {number} xPos: the current x position of the mouse
   * @param {number} yPos: the current y position of the mouse
   */
  ttUpdatePos(xPos: number, yPos: number) {
    const Tooltip = d3.select('.tooltip');

    if (Tooltip !== null && Tooltip.node() !== null) {
      // @ts-ignore
      const ttBox = Tooltip.node()!.getBoundingClientRect();

      Tooltip.style('left', (xPos + 70) + 'px');

      if ((yPos + ttBox.height) > m.fullHeight) {
        yPos = (m.fullHeight - ttBox.height);
      }
      if (yPos < 0) {
        yPos = 0;
      }
      Tooltip.style('top', (yPos + 'px'));
    }
  }

  /**
   * Purpose: wrapper for ttUpdatePos
   * Timeline Scope: all elements
   * @param {any} d: datum passed into the function
   */
  ttMove(d: any) {
    // event is a mouseEvent
    this.ttUpdatePos(d3.event.x, d3.event.y);
  }


  /**
   * Purpose: called when the cursor moves off of a bar
   * Timeline Scope: all elements
   * @param {any} d
   */
  ttLeave(d: any) {
    // delete all tooltips
    if (d3.event !== null && d3.event.buttons === 0) {
      d3.selectAll('.tooltip').remove();
    }
  }

  /**
   * Purpose: updates the state and positioning of element on the Timeline
   */
  updateChart() {
    // recover the new scale
    if (d3.event !== null) {
      m.scale = d3.event.transform.k;
      console.log(d3.event);
    } else {
      console.warn('d3.event was null');
    }

    timelineType.applyZoom();

    if (d3.event !== null && d3.event.sourceEvent !== null &&
      d3.event.sourceEvent.type === 'mousemove') {
      this.dragged();
    } else {
      this.moveChart();
    }
  }

  /**
   * Purpose: draws an element as Event with a Magnitude. This function is old
   * and has been replaced by the TimelineTypeInterface, it only still exists
   * because some tests rely on it and a workaround has not yet been
   * figured out.
   * @param {any} selection: the selection for the object to draw
   */
  drawEventMagnitude(selection: any): void {
    timelineType.draw(selection, this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: draws an element as Event with a Magnitude. This function is old
   * and has been replaced by the TimelineTypeInterface, it only still exists
   * because some tests rely on it and a workaround has not yet been
   * figured out.
   * @param {any} selection
   */
  drawIntervalMagnitude(selection: any): void {
    timelineType.draw(selection, this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: used to update which bars are being rendered to the screen
   */
  updateBars() {
    timelineType.updateBars(this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an EventMagnitude
   * Timeline. This function is old and has been replaced by the
   * TimelineTypeInterface, it only still exists because some tests rely on it
   * and a workaround has not yet been figured out.
   */
  getEventMagnitudeData() {
    timelineType.getData();
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * IntervalMagnitude Timeline. This function is old and has been replaced by
   * the TimelineTypeInterface, it only still exists because some tests rely on
   * it and a workaround has not yet been figured out.
   */
  getIntervalMagnitudeData() {
    timelineType.getData();
  }

  /**
   * Purpose: called to recalculate the current chart position and data elements
   * being rendered.
   */
  moveChart() {
    d3.select('#barsLayer')
        .attr('transform', () => {
          return `translate(${m.deltaX},0)`;
        });

    timelineType.getData();
    this.updateBars();
  }

  /**
   * @this dragStarted
   * @param {any} caller
   */
  dragStarted(caller: any) {
    d3.select(caller).raise()
        .classed('active', true);
  }

  /**
   * Purpose: called when the timeline is dragged by the user
   */
  dragged() {
    this.ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);

    m.deltaX += d3.event.sourceEvent.movementX;
    if (m.deltaX > 0) {
      m.deltaX = 0;
    }
    this.moveChart();
  }

  /**
   * @this dragEnded
   * @param {any} caller
   */
  dragEnded(caller: any) {
    d3.select(caller).classed('active', false);
  }
};
