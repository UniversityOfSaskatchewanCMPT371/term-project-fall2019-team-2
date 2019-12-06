import React from 'react';
import TimelineInterface, {TimelineState} from './TimelineInterface';
import * as d3
  from 'd3';
import './Timeline.css';
import * as TimSort
  from 'timsort';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import TimelineModel from './TimelineModel';
import TimelineTypeInterface from './TimelineTypes/TimelineTypeInterface';
import EventMagnitude from './TimelineTypes/EventMagnitude';
import IntervalMagnitude from './TimelineTypes/IntervalMagnitude';
import {strict as assert} from 'assert';
import EventOccurrence
  from './TimelineTypes/EventOccurrence';
import CONSTANTS from '../constants';
import IntervalOccurrence from './TimelineTypes/IntervalOccurrence';
import Column from './Column';

/**
 * Purpose: an enum to differentiate the data being drawn
 */
export enum ViewType {
  IntervalMagnitude = 'IntervalMagnitude',
  IntervalOccurrence = 'IntervalOccurrence',
  EventMagnitude = 'EventMagnitude',
  EventOccurrence = 'EventOccurrence'
}

/**
 * Purpose: renders and updates a timeline to the screen
 */
export default class TimelineComponent
  extends React.Component<TimelineInterface, TimelineState> {
  public m = new TimelineModel();
  // @ts-ignore
  public timelineType: TimelineTypeInterface;

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
      yColumn2: '',
      xColumn: '',
      xColumn2: '',
      loading: true,
      view: ViewType.EventMagnitude,
    };
    this.timelineType = new EventMagnitude(this.m);

    this.drawTimeline = this.drawTimeline.bind(this);
    this.changeTimelineType = this.changeTimelineType.bind(this);
    this.initTimeline = this.initTimeline.bind(this);
    this.ttOverHelper = this.ttOverHelper.bind(this);
    this.ttOver = this.ttOver.bind(this);
    this.ttUpdatePos = this.ttUpdatePos.bind(this);
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
    return this.m.scale;
  }

  /**
   * Get the current delta value for panning left and right
   * @return {number}: The deltaX
   */
  getDeltaX(): number {
    return this.m.deltaX;
  }

  /**
   * Purpose: waits until the component has properly mounted before drawing the
   * timeline
   * @precondition: the component mounted correctly
   * @postcondition: default x and y columns are chosen
   */
  componentDidMount(): void {
    if (this.state.data.columns !== null &&
      this.state.data.columns !== undefined) {
      const cols = this.state.data.columns;
      let yColumnSet = false;
      let xColumnSet = false;
      let xColumn2Set = false;

      // data (columns) should exist to mount the component
      assert.notStrictEqual(cols, [],
          'componentDidMount(): cols (data) is empty');

      this.m.yColumns = [];
      this.m.xColumns = [];
      this.m.columns = cols;

      // iterate through columns and set default values
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        assert.notStrictEqual(col, null,
            'componentDidMount(): col is null');
        // inferTypes shouldn't leave the type undefined
        assert.notStrictEqual(col.primType, undefined,
            'componentDidMount(): col.primType is undefined');
        // Plotting occurrence data isn't yet supported, so we are only
        // interested in plotting magnitude data for the y-axis
        if (col.primType === 'number') {
          this.m.yColumns.push(col);
          assert.strictEqual(this.m.yColumns[this.m.yColumns.length - 1], col,
              'componentDidMount(): col not added to this.m.yColumns');
          if (!yColumnSet) {
            this.setState(() => {
              return {
                yColumn: col.key,
              };
            });
            this.m.yColumn = col.key;
            yColumnSet = true;
          }
        }

        if (col.primType === 'date' || col.primType === 'number') {
          this.m.xColumns.push(col);
          assert.strictEqual(this.m.xColumns[this.m.xColumns.length - 1], col,
              'componentDidMount(): col not added to this.m.xColumns');
          if (!xColumnSet) {
            this.setState(() => {
              return {
                xColumn: col.key,
              };
            });
            this.m.xColumn = col.key;
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
            this.m.xColumn2 = col.key;
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
    assert.notStrictEqual(this.state.data, [],
        'TimelineComp - sortData(): this.state.data is empty');
    const cols = this.state.data.columns;
    if (cols !== null && cols !== undefined) {
      assert.notStrictEqual(cols, [],
          'TimelineComp - sortData(): cols (array) is empty');
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

        // there should still be data after being sorted
        assert.notStrictEqual(data, [],
            'TimelineComp - sortData(): data is empty');
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
    assert.notStrictEqual(e, null,
        'changeColumn(): event obj is null');
    assert.notStrictEqual(e, undefined,
        'changeColumns(): event obj is undefined');
    assert.notStrictEqual(e.target, null,
        'changeColumns(): event.target obj is null');
    assert.notStrictEqual(e.target, undefined,
        'changeColumns(): event.target obj is undefined');

    const val = e.target.value;
    assert.notStrictEqual(val, undefined,
        'changeColumns(): event.target.value is undefined');

    // make sure the values actually get updated before calling resetTimeline
    const valSet = new Promise((resolver, agent) => {
      // @ts-ignore
      if (column === 'yColumn') {
        this.m.yColumn = val;
        this.setState(() => {
          return {
            yColumn: this.m.yColumn,
          };
        }, () => resolver(true));
      } else if (column === 'yColumn2') {
        this.m.yColumn2 = val;
        this.setState(() => {
          return {
            yColumn2: this.m.yColumn2,
          };
        }, () => resolver(true));
      } else if (column === 'xColumn') {
        this.m.xColumn = val;
        this.setState(() => {
          return {
            xColumn: this.m.xColumn,
          };
        }, () => {
          this.sortData(val);
          resolver(true);
        });
      } else if (column === 'xColumn2') {
        this.m.xColumn2 = val;
        this.setState(() => {
          return {
            xColumn2: this.m.xColumn2,
          };
        }, () => resolver(true));
      }
    });

    await valSet;

    this.resetTimeline();
  }


  /**
   * Purpose: to clear and redraw the timeline
   */
  resetTimeline() {
    d3.selectAll('svg').remove();
    // make sure svg removed
    assert(d3.selectAll('svg').empty(),
        'resetTimeline(): svg tags not removed');
    this.initTimeline();
    this.drawTimeline();
    // make sure svg redrawn
    assert(!d3.selectAll('svg').empty(),
        'resetTimeline(): new svg not drawn');
  }

  /**
   * Internal function that maps columns to HTML optional values
   * Pre-Conditions: None
   * Post-Conditions: None. This function does not change the state
   * of the visualization.
   * @param {Column[]} column An array of columns
   * @return {JSX.Element[]} The HTML option values for the drop downs
   */
  private mapColumnsToOptions(column: Column[]): JSX.Element[] {
    return column.map((col: any, i: number) =>
      <option key={i} value={col.key}>{col.key}</option>
    );
  }

  /**
   * Purpose: renders the initial html
   * @return {string}: html output to the page
   */
  render() {
    const yDropdowns = ViewType[this.state.view] === ViewType.EventOccurrence ||
        ViewType[this.state.view] === ViewType.IntervalOccurrence ?
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text
              id='inputGroup
                Prepend'>First Y Column</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            as='select'
            id='ySelect'
            // value={this.state.yColumn}
            value={this.m.yColumn}
            onChange={async (e) => {
              await this.changeColumn(e, 'yColumn');
            }}>
            {
              this.mapColumnsToOptions(this.m.yColumns)
            }
          </Form.Control>

          <InputGroup.Prepend>
            <InputGroup.Text
              id='inputGroup
                Prepend'>Second Y Column</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            as='select'
            id='y2Select'
            // value={this.state.yColumn}
            value={this.m.yColumn2}
            onChange={async (e) => {
              await this.changeColumn(e, 'yColumn2');
            }}>
            <option key={''} value={''}>Select another Column</option>
            {
              this.mapColumnsToOptions(this.m.yColumns)
            }
          </Form.Control>

        </InputGroup> :
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text
              id='inputGroup
                Prepend'>Y Column</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            as='select'
            id='ySelect'
            // value={this.state.yColumn}
            value={this.m.yColumn}
            onChange={async (e) => {
              await this.changeColumn(e, 'yColumn');
            }}>
            {
              this.mapColumnsToOptions(this.m.yColumns)
            }
          </Form.Control>
        </InputGroup>;

    const xDropdowns =
        ViewType[this.state.view] === ViewType.IntervalOccurrence ||
        ViewType[this.state.view] === ViewType.IntervalMagnitude ?
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text
              id='inputGroup
                Prepend'>Starting Range</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            as='select'
            id='xSelect'
            // value={this.state.xColumn}
            value={this.m.xColumn}
            onChange={async (e) => {
              await this.changeColumn(e, 'xColumn');
            }}>
            {
              this.mapColumnsToOptions(this.m.xColumns)
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
            // value={this.state.xColumn2}
            value={this.m.xColumn2}
            onChange={async (e) => {
              await this.changeColumn(e, 'xColumn2');
            }}>
            {
              this.mapColumnsToOptions(this.m.xColumns)
            }
          </Form.Control>
        </InputGroup> :
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text
              id='inputGroup
                Prepend'>X Column</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            as='select'
            id='xSelect'
            // value={this.state.xColumn}
            value={this.m.xColumn}
            onChange={async (e) => {
              await this.changeColumn(e, 'xColumn');
            }}>
            {
              this.mapColumnsToOptions(this.m.xColumns)
            }
          </Form.Control>
        </InputGroup>;


    const contents = this.state.loading ?
      <p>
        <em>loading...</em>
      </p> :
        <div>
          <div>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text
                  id='inputGroup
                Prepend'>Timeline Type</InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                as='select'
                id='timelineTypeSelect'
                value={this.state.view}
                onChange={(e) => {
                  this.changeTimelineType(e);
                }}>
                <option value={ViewType.IntervalMagnitude}>
                  Interval Magnitude
                </option>
                <option value={ViewType.IntervalOccurrence}>
                  Interval Occurrence
                </option>
                <option value={ViewType.EventMagnitude}>
                  Event Magnitude
                </option>
                <option value={ViewType.EventOccurrence}>
                  Event Occurrence
                </option>
              </Form.Control>
            </InputGroup>

            {yDropdowns}
            {xDropdowns}
          </div>
          <div style={{marginTop: '10px'}}
            id='svgtarget'>
          </div>
        </div>;
    // @ts-ignore
    return (
      <div id='timelineComponentDiv'>
        {contents}
      </div>);
  }


  /**
   * Purpose: changes the timeline type to the one desired by the user
   * @param {any} e: the event to pass into the function
   */
  changeTimelineType(e: any) {
    const val = e.target.value;
    console.log(e.target.value);
    console.log(val);
    console.log(this.m.view);
    this.m.view = val;

    switch (this.m.view) {
      case ViewType.IntervalMagnitude:
        this.timelineType = new IntervalMagnitude(this.m);
        break;

      case ViewType.IntervalOccurrence:
        this.timelineType = new IntervalOccurrence(this.m);
        break;

      case ViewType.EventMagnitude:
        this.timelineType = new EventMagnitude(this.m);
        break;

      case ViewType.EventOccurrence:
        this.timelineType = new EventOccurrence(this.m);
        break;
    }

    this.setState(() => {
      return {
        view: this.m.view,
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
    assert.notStrictEqual(this.state.data, [],
        'initTimeline(): this.state.data is empty');
    const elem: any = d3.select(CONSTANTS.SVG_SELECTOR);
    let newHeight = this.state.height;
    console.log('working');
    console.log(elem);
    if (elem !== null && elem.node() !== null) {
      const rect = elem.node().getBoundingClientRect();
      // this is the proper height for our timeline
      newHeight = window.innerHeight - (rect.top + this.m.marginTop);

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
    this.m.fullHeight = newHeight;
    this.m.fullWidth = this.state.width;
    this.m.view = this.state.view;
    this.m.height = this.m.fullHeight -
        (this.m.marginBottom + this.m.marginTop);

    this.m.width = this.m.fullWidth - (this.m.marginLeft + this.m.marginRight);

    this.m.numBars = Math.floor(this.m.width / this.m.barWidth) +
      this.m.barBuffer;// small pixel buffer to ensure smooth transitions

    this.m.dataIdx = 0;
    this.m.deltaX = 0;
    this.m.scale = 1;
    this.m.csvData = this.state.data.arrayOfData;

    this.m.data = this.m.csvData.slice(0, this.m.numBars);

    let xColumnVals: number[] = [];

    console.log(this.m.csvData);
    if (this.m.xColumn !== '') {
      // @ts-ignore
      // eslint-disable-next-line max-len
      xColumnVals = xColumnVals.concat(this.m.csvData.map((d: any) =>
        Date.parse(new Date(d[this.m.xColumn]).toJSON())));
    }

    if ((this.m.view === ViewType.IntervalMagnitude ||
      this.m.view === ViewType.IntervalOccurrence) &&
      this.m.xColumn2 !== '') {
      console.log(this.m.xColumn2);
      // @ts-ignore
      // eslint-disable-next-line max-len
      xColumnVals = xColumnVals.concat(this.m.csvData.map((d: any) =>
        Date.parse(new Date(d[this.m.xColumn2]).toJSON())));
    }
    // @ts-ignore
    this.m.minDate = new Date(d3.min(xColumnVals)).toJSON();

    // @ts-ignore
    this.m.maxDate = new Date(d3.max(xColumnVals)).toJSON();

    this.m.timeScale = d3.scaleTime()
        .domain([new Date(this.m.minDate), new Date(this.m.maxDate)])
        .range([0, 50 * this.m.csvData.length]);

    this.m.x = d3.scaleBand()
        .domain(this.m.data.map((d: any) => d[this.m.xColumn]))
        .range([0, this.m.width]).round(true);

    // This has to be used so sonarcloud doesn't freak out about unused
    // variables
    console.log(this.m.x(0));

    console.log(this.m.view);
    console.log(ViewType[this.m.view]);


    if (ViewType[this.m.view] === ViewType.IntervalMagnitude ||
        ViewType[this.m.view] === ViewType.EventMagnitude) {
      this.m.y = d3.scaleLinear()
          .domain([d3.min(this.m.csvData,
              (d) => {
                // @ts-ignore
                return d[this.m.yColumn];
              }),
          d3.max(this.m.csvData, (d) => {
            // @ts-ignore
            return d[this.m.yColumn];
          })])
          .range([this.m.height, 0]);
    } else {
      assert(this.m.csvData.length > 0);
      let domain: any = [];

      if (this.m.yColumn !== '') {
        domain = domain.concat(
            d3.map(this.m.csvData, (d: any) => d[this.m.yColumn]).keys());
      }
      if (this.m.yColumn2 !== '') {
        domain = domain.concat(
            d3.map(this.m.csvData, (d: any) => d[this.m.yColumn2]).keys());
      }
      console.log(this.m.yColumn2);

      console.log(domain);
      this.m.y = d3.scaleBand()
          .domain(domain)
          .range([this.m.height, 0]);
    }

    this.m.extent = [[this.m.marginLeft, this.m.marginTop],
      [this.m.width - this.m.marginRight, this.m.height - this.m.marginTop]];
  }

  /**
   * Purpose: draws the timeline and runs the functions and event handlers for
   * said timeline
   * @precondition : initTimeline has already been called
   * @postcondition : the Timeline and it's axis have been drawn.
   */
  drawTimeline() {
    // should only draw timeline if there is data
    assert.notStrictEqual(this.state.data, [],
        'drawTimeline(): this.state.data is empty');
    this.zoom = d3.zoom()
        .scaleExtent([0.5, 20]) // zoom range
        .translateExtent(this.m.extent)
        .extent(this.m.extent)
        .on('zoom', this.updateChart);

    this.svg = d3.select(CONSTANTS.SVG_SELECTOR)
        .append('svg')
        .attr('width', this.m.width)
        .attr('height', this.m.height + this.m.marginTop +
        this.m.marginBottom)
    // @ts-ignore
        .call(this.zoom)
        .append('g')
        .attr('transform',
            `translate(${this.m.marginLeft}, ${this.m.marginTop})`);

    this.svg.append('rect')
        .attr('width', this.m.width)
        .attr('height', this.m.height)
        .style('fill', 'none');

    this.svg.append('defs')
        .append('clipPath')
        .attr('id', 'barsBox')
        .append('rect')
        .attr('width', this.m.width)
        .attr('height', this.m.height + this.m.marginTop +
        this.m.marginBottom)
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


    console.log(ViewType[this.m.view] === ViewType.EventMagnitude);

    axisLayer.append('g')
        .style('color', 'black')
        .attr('class', 'y axis')
        .call(d3.axisLeft(this.m.y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('color', 'red')
        .text('yColumn');

    this.m.plot = barsLayer.append('g')
        .attr('class', 'plot')
        .attr('id', 'bars');

    // Labels
    this.drawLabels();

    this.updateBars();

    this.registerEvents();
  }

  /**
   * Draw the axis labels
   * @return {void}: Nothing
   */
  private drawLabels(): void {
    this.timelineType.drawLabels(this.svg);
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
        const lowerRange: number = Math.max(
            this.m.scaleMin, this.m.scale * this.m.scaleZoomOut);
        const identity = d3.zoomIdentity.scale(lowerRange);
        this.svg.transition().ease(d3.easeLinear).duration(300)
            .call(this.zoom.transform, identity);
        // Ensure the new scale is saved with a limit on the minimum
        //  zoomed out scope
        this.m.scale = lowerRange;
      } else if (op === '+' || op === 'w') {
        // Zoom In
        const identity = d3.zoomIdentity
            .scale(this.m.scale * this.m.scaleZoomIn);

        this.svg.transition().ease(d3.easeLinear).duration(300)
            .call(this.zoom.transform, identity);
        // Ensure the new scale is saved
        this.m.scale = this.m.scale * this.m.scaleZoomIn;
      } else if (op === 'ArrowLeft') {
        // Pan Left
        this.m.deltaX = Math.min(0, this.m.deltaX + this.m.deltaPan);
        this.m.deltaXDirection = -1;
        this.moveChart();
      } else if (op === 'ArrowRight') {
        this.m.deltaXDirection = 1;
        // Pan Right
        this.m.deltaX -= this.m.deltaPan;
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
    const Tooltip = d3.select(CONSTANTS.SVG_SELECTOR)
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
      tooltip += `<strong>${key}</strong>
      <span style='color:#000000'>${d[key]}</span><br/>`;
    });

    Tooltip.html(tooltip);

    if (Tooltip.node() !== null) {
      const ttBox = Tooltip.node()!.getBoundingClientRect();

      if ((ttBox.top + ttBox.height) > this.m.height) {
        Tooltip.style('top', `${(this.m.fullHeight - ttBox.height)}px`);
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

      Tooltip.style('left', `${(xPos + 70)}px`);

      if ((yPos + ttBox.height) > this.m.fullHeight) {
        yPos = (this.m.fullHeight - ttBox.height);
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
    const additionalBars: number = 1; // number of additional bars rendered
    // recover the new scale
    if (d3.event !== null) {
      this.m.scale = d3.event.transform.k;
    } else {
      console.warn('d3.event was null');
    }
    this.timelineType.applyZoom();
    this.m.numBars += additionalBars;

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
    this.timelineType.draw(selection, this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: draws an element as Event with a Magnitude. This function is old
   * and has been replaced by the TimelineTypeInterface, it only still exists
   * because some tests rely on it and a workaround has not yet been
   * figured out.
   * @param {any} selection
   */
  drawIntervalMagnitude(selection: any): void {
    this.timelineType.draw(selection, this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: used to update which bars are being rendered to the screen
   */
  updateBars() {
    this.timelineType.updateBars(this.ttOver, this.ttMove, this.ttLeave);
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an EventMagnitude
   * Timeline. This function is old and has been replaced by the
   * TimelineTypeInterface, it only still exists because some tests rely on it
   * and a workaround has not yet been figured out.
   */
  getEventMagnitudeData() {
    this.timelineType.getData();
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * IntervalMagnitude Timeline. This function is old and has been replaced by
   * the TimelineTypeInterface, it only still exists because some tests rely on
   * it and a workaround has not yet been figured out.
   */
  getIntervalMagnitudeData() {
    this.timelineType.getData();
  }

  /**
   * Purpose: called to recalculate the current chart position and data elements
   * being rendered.
   */
  moveChart() {
    d3.select('#barsLayer')
        .attr('transform', () => {
          return `translate(${this.m.deltaX},0)`;
        });

    this.timelineType.getData();
    this.updateBars();
  }

  /**
   * @this dragStarted
   * @param {any} caller
   */
  dragStarted(caller: any) {
    console.log(caller);
    console.log('dragStarted');
    d3.select(caller).raise()
        .classed('active', true);
    console.log(caller);
  }

  /**
   * Purpose: called when the timeline is dragged by the user
   *
   * @preconditions: the timeline is being dragged by the user
   * @postconditions: the timeline is translated to the position that the user
   * has specified
   */
  dragged() {
    console.log(d3.event);
    console.log('dragged');
    this.ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);

    if (d3.event.sourceEvent.movementX > 0) {
      this.m.deltaXDirection = -1;
    } else if (d3.event.sourceEvent.movementX < 0) {
      this.m.deltaXDirection = 1;
    }
    this.m.deltaX += d3.event.sourceEvent.movementX;
    if (this.m.deltaX > 0) {
      this.m.deltaX = 0;
    }
    this.moveChart();
  }

  /**
   * @this dragEnded
   * @param {any} caller
   */
  dragEnded(caller: any) {
    const hoveredBars: any = d3.selectAll('.bar:hover');

    // if nothing is being hovered over, remove the tooltip
    if (hoveredBars.empty()) {
      d3.selectAll('.tooltip').remove();
    } else {
      // make sure the tooltip is up to date.
      hoveredBars.each((d: any) => {
        this.ttOverHelper(d, d3.event.x, d3.event.y);
      });
    }


    d3.select(caller).classed('active', false);
  }
}
