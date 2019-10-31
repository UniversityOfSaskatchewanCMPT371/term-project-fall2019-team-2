import React
  from 'react';
import TimelineInterface, {TimelineState} from './TimelineInterface';
import * as d3
  from 'd3';
import './Timeline.css';
import Data
  from './Data';


const marginTop: number = 40;
const marginBottom: number = 170;
const marginLeft: number = 40;
const marginRight: number = 20;

let fullWidth: number = 0;
let fullHeight: number = 0;
let height: number = 0;
let width: number = 0;
const barWidth: number = 50;
const barBuffer: number = 5;
let numBars: number = 0;
let dataIdx: number = 0;
let deltaX: number = 0;
let scale: number = 1;
const xColumn = 'Order Date';
const xColumn2 = 'Ship Date';
const yColumn = 'Units Sold';

let csvData: Object[];
let data: Array<object>;
let ordinals;
let minDate: any;
let maxDate: any;

let timeScale: any;
let x: any;
let y: any;

let extent: [[number, number], [number, number]];

// d3 stuff
let zoom: any;
let svg: any;
// Create layers in order so that the bars will disappear under the axis
let barsLayer: any;
let axisLayer: any;
// y axis
let yAxis: any;
// Create bars
let plot: any;

/**
 * Purpose: shorthand for console.log()
 * @param {any} str: thing to log
 */
function log(str: any) {
  console.log(str);
}

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
      marginTop: 40,
      marginBottom: 170,
      marginLeft: 40,
      marginRight: 20,
      toggleTimeline: 0,
      togglePrompt: 'Switch to Interval Timeline',
    };

    // eslint-disable-next-line require-jsdoc


    this.drawTimeline = this.drawTimeline.bind(this);
    // this.drawTimeline2 = this.drawTimeline2.bind(this);
    this.toggleTimeline = this.toggleTimeline.bind(this);
    this.initTimeline = this.initTimeline.bind(this);
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
    // this. = this..bind(this);
    // this. = this..bind(this);
    // this. = this..bind(this);
    // this. = this..bind(this);
  }

  /**
   * Purpose: waits until the component has properly mounted before drawing the
   * timeline
   */
  componentDidMount(): void {
    this.initTimeline();
    this.drawTimeline();
  }

  /**
   * Purpose: renders the initial html
   * @return {string}: html output to the page
   */
  render() {
    return (
      <div>
        <button
          onClick={this.toggleTimeline}>{this.state.togglePrompt}</button>
        <div
          id="svgtarget">
        </div>
      </div>
    );
  }

  /**
   * Purpose: toggles between interval and occurrence timelines
   */
  toggleTimeline() {
    const toggle: number = this.state.toggleTimeline;
    if (toggle === 0) {
      this.setState(() => ({
        toggleTimeline: 1,
        togglePrompt: 'Switch to Occurrence Timeline',
      }), () => {
        d3.selectAll('svg').remove();
        this.initTimeline();
        this.drawTimeline();
      });
    } else {
      this.setState(() => ({
        toggleTimeline: 0,
        togglePrompt: 'Switch to Interval Timeline',
      }), () => {
        d3.selectAll('svg').remove();
        this.initTimeline();
        this.drawTimeline();
      });
    }
  }

  // /**
  //  *
  //  */
  // drawTimeline() {
  //   init(this.state.height, this.state.width, this.state.data);
  //   draw();
  // }


  /**
   *
   * @param {number} newFullHeight
   * @param {number} newFullWidth
   * @param {Data} newData
   */
  initTimeline() {
    fullHeight = this.state.height;
    fullWidth = this.state.width;

    height = fullHeight - (marginBottom - marginTop);

    width = fullWidth - (marginLeft + marginRight);

    numBars = Math.floor(width / barWidth) +
        barBuffer;// small pixel buffer to ensure smooth transitions

    dataIdx = 0;
    deltaX = 0;
    scale = 1;
    csvData = this.state.data.arrayOfData.filter((d: any) => {
      return d['Region'] === 'North America';
    });

    data = csvData.slice(0, numBars);
    ordinals = data.map((d: any) => d[xColumn]);

    // @ts-ignore
    minDate = new Date(d3.min(
        [d3.min(csvData, (d: any) => Date.parse(d[xColumn])),
          d3.min(csvData, (d: any) => Date.parse(d['Ship Date']))]));

    // @ts-ignore
    maxDate = new Date(d3.max(
        [d3.min(csvData, (d: any) => Date.parse(d[xColumn])),
          d3.max(csvData, (d: any) => Date.parse(d['Ship Date']))]));

    timeScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, 50 * csvData.length]);

    x = d3.scaleLinear()
        .domain([0, ordinals.length])
        .rangeRound([0, width]);

    y = d3.scaleLinear()
        .domain([d3.min(csvData,
            (d) => {
              // @ts-ignore
              return d[yColumn];
            }),
        d3.max(csvData, (d) => {
          // @ts-ignore
          return d[yColumn];
        })])
        .range([height, 0]);

    extent = [[marginLeft, marginTop],
      [width - marginRight, height - marginTop]];
  }

  /**
   *
   * @param {number} timelineType
   */
  changeTimeline(timelineType: number) {
    d3.selectAll('svg').remove();
  }

  /**
   * draws the timeline
   */
  drawTimeline() {
    zoom = d3.zoom()
        .scaleExtent([1, 20]) // zoom range
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', this.updateChart);

    svg = d3.select('#svgtarget')
        .append('svg')
        .attr('width', width)
        .attr('height', height + marginTop +
            marginBottom)
        // @ts-ignore
        .call(zoom)
        .append('g')
        .attr('transform', 'translate(' + marginLeft +
            ',' + marginTop + ')');

    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'none');

    svg.append('defs')
        .append('clipPath')
        .attr('id', 'barsBox')
        .append('rect')
        .attr('width', width)
        .attr('height', height + marginTop +
            marginBottom)
        .attr('x', 0)
        .attr('y', 0);

    barsLayer = svg.append('g')
        .attr('clip-path', 'url(#barsBox)')
        .append('g')
        .attr('id', 'barsLayer')
        .call(d3.drag()
            .on('start', this.dragStarted)
            .on('drag', this.dragged)
            .on('end', this.dragEnded));

    axisLayer = svg.append('g')
        .attr('id', 'axisLayer');

    yAxis = axisLayer.append('g')
        .style('color', 'red')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('color', 'red')
        .text('yColumn');

    plot = barsLayer.append('g')
        .attr('class', 'plot')
        .attr('id', 'bars');

    this.updateBars();
  }

  // Three function that change the tooltip when user hover/move/leave bar
  /**
   * Purpose: adds the tooltip to the canvas when the user mouses over a piece
   * of timeline data.
   * Timeline scope: all elements
   * @param {any} d
   */
  ttOver(d: any) {
    if (d3.event.buttons === 0) {
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
          .style('left', (d3.event.x + 70) + 'px')
          .style('top', d3.event.y + 'px');

      const keys = Object.keys(d);
      let tooltip: string = '';
      keys.forEach(function(key) {
        tooltip += '<strong>' + key + '</strong> <span style=\'color:red\'>' +
            d[key] + '</span><br/>';
      });

      Tooltip.html(tooltip);

      // Use ! to assert that this is not null
      log(Tooltip.node()!.getBoundingClientRect());

      const ttBox = Tooltip.node()!.getBoundingClientRect();

      if ((ttBox.top + ttBox.height) > height) {
        Tooltip.style('top', (fullHeight - ttBox.height) + 'px');
      }

      Tooltip.style('opacity', 1);
    }
  }

  /**
   * Purpose: updates the position of the Tooltip
   * Timeline Scope: all elements
   * @param {number} xPos: the current x position of the mouse
   * @param {number} yPos: the current y postion of the mouse
   */
  ttUpdatePos(xPos: number, yPos: number) {
    const Tooltip = d3.select('.tooltip');

    if (Tooltip !== null && Tooltip.node() !== null) {
      // @ts-ignore
      const ttBox = Tooltip.node()!.getBoundingClientRect();

      Tooltip
          .style('left', (xPos + 70) + 'px');

      if ((yPos + ttBox.height) > fullHeight) {
        yPos = (fullHeight - ttBox.height);
      }
      if (yPos < 0) {
        yPos = 0;
      }
    }
    Tooltip.style('top', (yPos + 'px'));
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
    if (d3.event.buttons === 0) {
      d3.selectAll('.tooltip').remove();
    }
  }

  /**
   * Purpose: updates the state and positioning of element on the Timeline
   */
  updateChart() {
    // recover the new scale
    scale = d3.event.transform.k;
    const newX = d3.event.transform.rescaleX(x);
    const newY = d3.event.transform.rescaleY(y);

    log('newX: ' + newX(10));

    d3.selectAll('#xaxis').remove();

    // yAxis.call(d3.axisLeft(newY));

    if (this.state.toggleTimeline === 0) {
      d3.selectAll('.bar')
          .attr('x', (d, i) => scale * barWidth * (i + dataIdx))
          .attr('width', scale * barWidth);

      d3.selectAll('.xtick')
          .attr('transform', (d: any, i) => 'translate(' +
              ((scale * barWidth * (d['index'] + dataIdx)) +
                  ((scale * barWidth) / 2)) + ',' + height + ')');
    } else {
      d3.selectAll('.bar')
          .attr('x', (d: any, i: number) =>
            scale * timeScale(new Date(d[xColumn])))
          .attr('width', (d: any, i: number) =>
            scale * (timeScale(new Date(d[xColumn2])) -
              timeScale(new Date(d[xColumn]))));

      d3.selectAll('.xtick')
          .attr('transform', (d: any, i: number) =>
            `translate(${scale * timeScale(new Date(d.text))},${height})`);
    }

    if (d3.event.sourceEvent.type === 'mousemove') {
      this.dragged();
    }
    this.moveChart();
  }

  /**
   * Purpose: draws an element as Event with a Magnitude
   * @param {any} selection: the selection for the object to draw
   */
  drawEventMagnitude(selection: any): void {
    selection.append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any, i: number) =>
          (scale * barWidth * (i + dataIdx)))
        .attr('width', scale * barWidth)
        .attr('y', (d: any) => y(d[yColumn]))
        .attr('height', (d: any) => {
          const newHeight = (height - y(d[yColumn]));
          if (newHeight < 0) {
            return 0;
          } else {
            return (height - y(d[yColumn]));
          }
        })
        .on('mouseover', this.ttOver)
        .on('mousemove', this.ttMove)
        .on('mouseleave', this.ttLeave);
  }

  /**
   *
   * @param {any} selection
   */
  drawIntervalMagnitude(selection: any): void {
    selection.append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any, i: number) =>
          (scale * timeScale(new Date(d[xColumn]))))
        // (scale * barWidth * (i + dataIdx)))
        .attr('width', (d: any, i: number) =>
          (timeScale(new Date(d[xColumn2])) -
                timeScale(new Date(d[xColumn]))))
        .attr('y', (d: any) => y(d[yColumn]))
        .attr('height', (d: any) => {
          const newHeight = (height - y(d[yColumn]));
          if (newHeight < 0) {
            return 0;
          } else {
            return (height - y(d[yColumn]));
          }
        })
        .style('fill', '#61a3a9')
        .style('opacity', 0.2)
        .on('mouseover', this.ttOver)
        .on('mousemove', this.ttMove)
        .on('mouseleave', this.ttLeave);
  }

  /**
   * Purpose: used to update which bars are being rendered to the screen
   */
  updateBars() {
    // @ts-ignore
    const ticks: [any] = [];
    plot.selectAll('.bar')
        .data(data, function(d: any, i: any, group: any) {
          return d['index'];
        })
        .join(
            (enter: any) => this.state.toggleTimeline === 0 ?
                this.drawEventMagnitude(enter) :
                this.drawIntervalMagnitude(enter),
            (update: any) => update,

            (exit: any) => exit.remove()
        );

    data.forEach(function(d: any, i: number) {
      if (((i + dataIdx) % 5) === 0) {
        ticks.push({
          id: d['index'],
          index: i,
          text: d[xColumn],
        });
      }
    });

    plot.selectAll('.xtick')
        .data(ticks, function(d: any, i: any, group: any) {
          return d.id;
        })
        .join(
            (enter: any) => {
              const tick = enter.append('g')
                  .attr('class', 'xtick')
                  .attr('opacity', 1)
                  .attr('transform', (d: any, i: number) => {
                    if (this.state.toggleTimeline === 0) {
                      return 'translate(' +
                          ((scale * barWidth * (d.index + dataIdx)) +
                              ((scale * barWidth) / 2)) + ',' + height + ')';
                    } else {
                      return `translate(${timeScale(new Date(d.text))} ,
                    ${height})`;
                    }
                  });

              tick.append('line')
                  .attr('stroke', 'blue')
                  .attr('y2', 6);

              tick.append('text')
                  .text((d: any) => d.text)
                  .style('text-anchor', 'end')
                  .style('font-size', '1rem')
                  .attr('dx', '-.8em')
                  .attr('dy', '.15em')
                  .attr('transform', 'rotate(-90)');
            },
            (update: any) => update,
            (exit: { remove: () => void; }) => exit.remove()
        );
  }

  /**
   *
   */
  moveChart() {
    d3.select('#barsLayer')
        .attr('transform', (d) => {
          return `translate(${deltaX},0)`;
        });

    // finds starting index
    dataIdx = Math.floor(-deltaX / (scale * barWidth));
    data = csvData.slice(dataIdx, numBars + dataIdx);
    ordinals = data.map((d: any) => d[xColumn]);

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

    deltaX += d3.event.sourceEvent.movementX;
    if (deltaX > 0) {
      deltaX = 0;
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

  /**
   * Purpose: draws the timeline and runs the functions and event handlers for
   * said timeline
   */
  // drawTimeline() {
  //   const height = this.state.height -
  //     (this.state.marginBottom + this.state.marginTop);
  //   const width = this.state.width -
  //     (this.state.marginLeft + this.state.marginRight);
  //
  //   // const fullWidth = this.state.width;
  //   const fullHeight = this.state.height;
  //   const barWidth = 50;
  //   const barBuffer = 5;
  //   const numBars = Math.floor(width / barWidth) +
  //     barBuffer;// small pixel buffer to ensure smooth transitions
  //   let dataIdx = 0;
  //   let deltaX = 0;
  //   let scale = 1;
  //   const xColumn = 'Order Date';
  //   const xColumn2 = 'Ship Date';
  //   const yColumn = 'Units Sold';
  //
  //   const toggleTimeline = this.state.toggleTimeline;
  //
  //   const csvData = this.state.data.arrayOfData.filter((d: any) => {
  //     return d['Region'] === 'North America';
  //   });
  //   let data: Array<object> = csvData.slice(0, numBars);
  //   // @ts-ignore
  //   let ordinals = data.map((d) => d[xColumn]);
  //
  //
  //   // @ts-ignore
  //   const minDate = new Date(d3.min(
  //       [d3.min(csvData, (d: any) => Date.parse(d[xColumn])),
  //         d3.min(csvData, (d: any) => Date.parse(d['Ship Date']))]));
  //
  //   // @ts-ignore
  //   const maxDate = new Date(d3.max(
  //       [d3.min(csvData, (d: any) => Date.parse(d[xColumn])),
  //         d3.max(csvData, (d: any) => Date.parse(d['Ship Date']))]));
  //
  //   const timeScale = d3.scaleTime()
  //       .domain([minDate, maxDate])
  //       .range([0, 50 * csvData.length]);
  //
  //   const x = d3.scaleLinear()
  //       .domain([0, ordinals.length])
  //       .rangeRound([0, width]);
  //
  //   const y = d3.scaleLinear()
  //       .domain([d3.min(csvData,
  //           (d) => {
  //             // @ts-ignore
  //             return d[yColumn];
  //           }),
  //       d3.max(csvData, (d) => {
  //         // @ts-ignore
  //         return d[yColumn];
  //       })])
  //       .range([height, 0]);
  //
  //   const extent: [[number, number], [number, number]] =
  //     [[this.state.marginLeft, this.state.marginTop],
  //       [width - this.state.marginRight,
  //         height - this.state.marginTop]];
  //
  //   const zoom = d3.zoom()
  //       .scaleExtent([1, 20]) // zoom range
  //       .translateExtent(extent)
  //       .extent(extent)
  //       .on('zoom', updateChart);
  //
  //   const svg = d3.select('#svgtarget')
  //       .append('svg')
  //       .attr('width', width)
  //       .attr('height', height + this.state.marginTop +
  //       this.state.marginBottom)
  //   // @ts-ignore
  //       .call(zoom)
  //       .append('g')
  //       .attr('transform', 'translate(' + this.state.marginLeft +
  //       ',' + this.state.marginTop + ')');
  //
  //   svg.append('rect')
  //       .attr('width', width)
  //       .attr('height', height)
  //       .style('fill', 'none');
  //
  //   svg.append('defs')
  //       .append('clipPath')
  //       .attr('id', 'barsBox')
  //       .append('rect')
  //       .attr('width', width)
  //       .attr('height', height + this.state.marginTop +
  //       this.state.marginBottom)
  //       .attr('x', 0)
  //       .attr('y', 0);
  //
  //   // Create layers in order so that the bars will disappear under the axis
  //   const barsLayer = svg.append('g')
  //       .attr('clip-path', 'url(#barsBox)')
  //       .append('g')
  //       .attr('id', 'barsLayer')
  //       .call(d3.drag()
  //           .on('start', dragStarted)
  //           .on('drag', dragged)
  //           .on('end', dragEnded));
  //
  //   const axisLayer = svg.append('g')
  //       .attr('id', 'axisLayer');
  //
  //   // y axis
  //   const yAxis = axisLayer.append('g')
  //       .style('color', 'red')
  //       .attr('class', 'y axis')
  //       .call(d3.axisLeft(y))
  //       .append('text')
  //       .attr('transform', 'rotate(-90)')
  //       .attr('y', 6)
  //       .attr('dy', '.71em')
  //       .style('text-anchor', 'end')
  //       .style('color', 'red')
  //       .text('yColumn');
  //
  //   // Create bars
  //   const plot = barsLayer.append('g')
  //       .attr('class', 'plot')
  //       .attr('id', 'bars');
  //
  //   // Three function that change the tooltip when user hover/move/leave bar
  //   /**
  //    * Purpose: adds the tooltip to the canvas when the user mouses over a piece
  //    * of timeline data.
  //    * Timeline scope: all elements
  //    * @param {any} d
  //    */
  //   function ttOver(d: any) {
  //     if (d3.event.buttons === 0) {
  //       const Tooltip = d3.select('#svgtarget')
  //           .append('div')
  //           .style('opacity', 0)
  //           .attr('class', 'tooltip')
  //           .attr('target', null)
  //           .style('background-color', 'white')
  //           .style('border', 'solid')
  //           .style('border-width', '2px')
  //           .style('border-radius', '5px')
  //           .style('padding', '5px')
  //           .style('left', (d3.event.x + 70) + 'px')
  //           .style('top', d3.event.y + 'px');
  //
  //       const keys = Object.keys(d);
  //       let tooltip: string = '';
  //       keys.forEach(function(key) {
  //         tooltip += '<strong>' + key + '</strong> <span style=\'color:red\'>' +
  //           d[key] + '</span><br/>';
  //       });
  //
  //       Tooltip.html(tooltip);
  //
  //       // Use ! to assert that this is not null
  //       log(Tooltip.node()!.getBoundingClientRect());
  //
  //       const ttBox = Tooltip.node()!.getBoundingClientRect();
  //
  //       if ((ttBox.top + ttBox.height) > height) {
  //         Tooltip.style('top', (fullHeight - ttBox.height) + 'px');
  //       }
  //
  //       Tooltip.style('opacity', 1);
  //     }
  //   }
  //
  //   /**
  //    * Purpose: updates the position of the Tooltip
  //    * Timeline Scope: all elements
  //    * @param {number} xPos: the current x position of the mouse
  //    * @param {number} yPos: the current y postion of the mouse
  //    */
  //   function ttUpdatePos(xPos: number, yPos: number) {
  //     const Tooltip = d3.select('.tooltip');
  //
  //     if (Tooltip !== null && Tooltip.node() !== null) {
  //       // @ts-ignore
  //       const ttBox = Tooltip.node()!.getBoundingClientRect();
  //
  //       Tooltip
  //           .style('left', (xPos + 70) + 'px');
  //
  //       if ((yPos + ttBox.height) > fullHeight) {
  //         yPos = (fullHeight - ttBox.height);
  //       }
  //       if (yPos < 0) {
  //         yPos = 0;
  //       }
  //     }
  //     Tooltip.style('top', (yPos + 'px'));
  //   }
  //
  //   /**
  //    * Purpose: wrapper for ttUpdatePos
  //    * Timeline Scope: all elements
  //    * @param {any} d: datum passed into the function
  //    */
  //   function ttMove(d: any) {
  //     // event is a mouseEvent
  //     ttUpdatePos(d3.event.x, d3.event.y);
  //   }
  //
  //   /**
  //    * Purpose: called when the cursor moves off of a bar
  //    * Timeline Scope: all elements
  //    * @param {any} d
  //    */
  //   function ttLeave(d: any) {
  //     // delete all tooltips
  //     if (d3.event.buttons === 0) {
  //       d3.selectAll('.tooltip').remove();
  //     }
  //   }
  //
  //   /**
  //    * Purpose: updates the state and positioning of element on the Timeline
  //    */
  //   function updateChart() {
  //     // recover the new scale
  //     scale = d3.event.transform.k;
  //     const newX = d3.event.transform.rescaleX(x);
  //     const newY = d3.event.transform.rescaleY(y);
  //
  //     log('newX: ' + newX(10));
  //
  //     d3.selectAll('#xaxis').remove();
  //
  //     yAxis.call(d3.axisLeft(newY));
  //
  //     if (toggleTimeline === 0) {
  //       d3.selectAll('.bar')
  //           .attr('x', (d, i) => scale * barWidth * (i + dataIdx))
  //           .attr('width', scale * barWidth);
  //
  //       d3.selectAll('.xtick')
  //           .attr('transform', (d: any, i) => 'translate(' +
  //           ((scale * barWidth * (d['index'] + dataIdx)) +
  //             ((scale * barWidth) / 2)) + ',' + height + ')');
  //     } else {
  //       d3.selectAll('.bar')
  //           .attr('x', (d: any, i: number) =>
  //             scale * timeScale(new Date(d[xColumn])))
  //           .attr('width', (d: any, i: number) =>
  //             scale * (timeScale(new Date(d[xColumn2])) -
  //           timeScale(new Date(d[xColumn]))));
  //
  //       d3.selectAll('.xtick')
  //           .attr('transform', (d: any, i: number) =>
  //             `translate(${scale * timeScale(new Date(d.text))},${height})`);
  //     }
  //
  //     if (d3.event.sourceEvent.type === 'mousemove') {
  //       dragged();
  //     }
  //     moveChart();
  //   }
  //
  //   /**
  //    * Purpose: draws an element as Event with a Magnitude
  //    * @param {any} selection: the selection for the object to draw
  //    */
  //   function drawEventMagnitude(selection: any): void {
  //     selection.append('rect')
  //         .attr('class', 'bar')
  //         .attr('x', (d: any, i: number) =>
  //           (scale * barWidth * (i + dataIdx)))
  //         .attr('width', scale * barWidth)
  //         .attr('y', (d: any) => y(d[yColumn]))
  //         .attr('height', (d: any) => {
  //           const newHeight = (height - y(d[yColumn]));
  //           if (newHeight < 0) {
  //             return 0;
  //           } else {
  //             return (height - y(d[yColumn]));
  //           }
  //         })
  //         .on('mouseover', ttOver)
  //         .on('mousemove', ttMove)
  //         .on('mouseleave', ttLeave);
  //   }
  //
  //   /**
  //    *
  //    * @param {any} selection
  //    */
  //   function drawIntervalMagnitude(selection: any): void {
  //     selection.append('rect')
  //         .attr('class', 'bar')
  //         .attr('x', (d: any, i: number) =>
  //           (scale * timeScale(new Date(d[xColumn]))))
  //     // (scale * barWidth * (i + dataIdx)))
  //         .attr('width', (d: any, i: number) =>
  //           (timeScale(new Date(d[xColumn2])) -
  //           timeScale(new Date(d[xColumn]))))
  //         .attr('y', (d: any) => y(d[yColumn]))
  //         .attr('height', (d: any) => {
  //           const newHeight = (height - y(d[yColumn]));
  //           if (newHeight < 0) {
  //             return 0;
  //           } else {
  //             return (height - y(d[yColumn]));
  //           }
  //         })
  //         .style('fill', '#61a3a9')
  //         .style('opacity', 0.2)
  //         .on('mouseover', ttOver)
  //         .on('mousemove', ttMove)
  //         .on('mouseleave', ttLeave);
  //   }
  //
  //   /**
  //    * Purpose: used to update which bars are being rendered to the screen
  //    */
  //   function updateBars() {
  //     // @ts-ignore
  //     const ticks: [any] = [];
  //     plot.selectAll('.bar')
  //         .data(data, function(d: any, i: any, group: any) {
  //           return d['index'];
  //         })
  //         .join(
  //             (enter: any) => toggleTimeline === 0 ?
  //           drawEventMagnitude(enter) :
  //           drawIntervalMagnitude(enter),
  //             (update: any) => update,
  //
  //             (exit: any) => exit.remove()
  //         );
  //
  //     data.forEach(function(d: any, i: number) {
  //       if (((i + dataIdx) % 5) === 0) {
  //         ticks.push({
  //           id: d['index'],
  //           index: i,
  //           text: d[xColumn],
  //         });
  //       }
  //     });
  //
  //     plot.selectAll('.xtick')
  //         .data(ticks, function(d: any, i: any, group: any) {
  //           return d.id;
  //         })
  //         .join(
  //             (enter: any) => {
  //               const tick = enter.append('g')
  //                   .attr('class', 'xtick')
  //                   .attr('opacity', 1)
  //                   .attr('transform', (d: any, i: number) => {
  //                     if (toggleTimeline === 0) {
  //                       return 'translate(' +
  //                   ((scale * barWidth * (d.index + dataIdx)) +
  //                     ((scale * barWidth) / 2)) + ',' + height + ')';
  //                     } else {
  //                       return `translate(${timeScale(new Date(d.text))}
  //                         ,${height})`;
  //                     }
  //                   });
  //
  //               tick.append('line')
  //                   .attr('stroke', 'blue')
  //                   .attr('y2', 6);
  //
  //               tick.append('text')
  //                   .text((d: any) => d.text)
  //                   .style('text-anchor', 'end')
  //                   .style('font-size', '1rem')
  //                   .attr('dx', '-.8em')
  //                   .attr('dy', '.15em')
  //                   .attr('transform', 'rotate(-90)');
  //             },
  //             (update: any) => update,
  //             (exit: { remove: () => void; }) => exit.remove()
  //         );
  //   }
  //
  //   /**
  //    *
  //    */
  //   function moveChart() {
  //     d3.select('#barsLayer')
  //         .attr('transform', (d) => {
  //           return `translate(${deltaX},0)`;
  //         });
  //
  //     // finds starting index
  //     dataIdx = Math.floor(-deltaX / (scale * barWidth));
  //     data = csvData.slice(dataIdx, numBars + dataIdx);
  //     ordinals = data.map((d: any) => d[xColumn]);
  //
  //     updateBars();
  //   }
  //
  //   /**
  //    * @this dragStarted
  //    * @param {any} this
  //    */
  //   function dragStarted(this: any) {
  //     d3.select(this).raise()
  //         .classed('active', true);
  //   }
  //
  //   /**
  //    * Purpose: called when the timeline is dragged by the user
  //    */
  //   function dragged() {
  //     ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);
  //
  //     deltaX += d3.event.sourceEvent.movementX;
  //     if (deltaX > 0) {
  //       deltaX = 0;
  //     }
  //     moveChart();
  //   }
  //
  //   /**
  //    * @this dragEnded
  //    * @param {any} this
  //    */
  //   function dragEnded(this: any) {
  //     d3.select(this).classed('active', false);
  //   }
  //
  //   updateBars();
  // }
}
