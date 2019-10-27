import React
  from 'react';
import TimelineInterface, {TimelineState} from './TimelineInterface';
import * as d3
  from 'd3';
import './Timeline.css';

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
      marginBottom: 100,
      marginLeft: 40,
      marginRight: 20,
    };

    this.drawTimeline = this.drawTimeline.bind(this);
    this.drawTimeline2 = this.drawTimeline2.bind(this);
    this.drawTimeline3 = this.drawTimeline3.bind(this);
    this.drawTimeline4 = this.drawTimeline4.bind(this);
  }

  /**
   * Purpose: waits until the component has properly mounted before drawing the
   * timeline
   */
  componentDidMount(): void {
    this.drawTimeline();
  }

  /**
   * Purpose: renders the initial html
   * @return {string}: html output to the page
   */
  render() {
    return (
      <div>
        <div
          id="svgtarget">
        </div>
      </div>
    );
  }

  /* eslint-disable */

  drawTimeline4() {
    // set the dimensions and margins of the graph
    const margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
      },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
    // append the SVG object to the body of the page
    const SVG = d3.select("#svgtarget")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function (data) {
      // Add X axis
      const x = d3.scaleLinear()
        .domain([4, 8])
        .range([0, width]);
      const xAxis = SVG.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 9])
        .range([height, 0]);
      const yAxis = SVG.append("g")
        .call(d3.axisLeft(y));

      // Add a clipPath: everything out of this area won't be drawn.
      const clip = SVG.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      const scatter = SVG.append('g')
        .attr("clip-path", "url(#clip)");
      // Add circles
      scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          // @ts-ignore
          return x(d.Sepal_Length);
        })
        .attr("cy", function (d) {
          // @ts-ignore
          return y(d.Petal_Length);
        })
        .attr("r", 8)
        .style("fill", "#61a3a9")
        .style("opacity", 0.5);

      // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
      const zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);
      // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom

      SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        // @ts-ignore
        .call(zoom);

      // now the user can zoom and it will trigger the function called updateChart
      // A function that updates the chart when the user zoom and thus new boundaries are available
      function updateChart() {
        // recover the new scale
        const newX = d3.event.transform.rescaleX(x);
        const newY = d3.event.transform.rescaleY(y);
        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));
        // update circle position
        scatter
          .selectAll("circle")
          .attr('cx', function (d) {
            // @ts-ignore
            return newX(d.Sepal_Length)
          })
          .attr('cy', function (d) {
            // @ts-ignore
            return newY(d.Petal_Length)
          });
      }
    });
  }

  drawTimeline3() {
    // set the dimensions and margins of the graph
    const margin = {
      top: this.state.marginTop,
      right: this.state.marginRight,
      bottom: this.state.marginBottom,
      left: this.state.marginLeft
    };

    const height = this.state.height -
      (this.state.marginBottom + this.state.marginTop);
    const width = this.state.width -
      (this.state.marginLeft + this.state.marginRight);

    // append the SVG object to the body of the page
    const SVG = d3.select("#svgtarget")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function (data) {
      // Add X axis
      const x = d3.scaleLinear()
        .domain([4, 8])
        .range([0, width]);
      const xAxis = SVG.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 9])
        .range([height, 0]);
      const yAxis = SVG.append("g")
        .call(d3.axisLeft(y));

      // Add a clipPath: everything out of this area won't be drawn.
      const clip = SVG.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      const scatter = SVG.append('g')
        .attr("clip-path", "url(#clip)");
      // Add circles
      scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          // @ts-ignore
          return x(d.Sepal_Length);
        })
        .attr("cy", function (d) {
          // @ts-ignore
          return y(d.Petal_Length);
        })
        .attr("r", 8)
        .style("fill", "#61a3a9")
        .style("opacity", 0.5);

      // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
      const zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);
      // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom

      SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        // @ts-ignore
        .call(zoom);

      // now the user can zoom and it will trigger the function called updateChart
      // A function that updates the chart when the user zoom and thus new boundaries are available
      function updateChart() {
        // recover the new scale
        const newX = d3.event.transform.rescaleX(x);
        const newY = d3.event.transform.rescaleY(y);
        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));
        // update circle position
        scatter
          .selectAll("circle")
          .attr('cx', function (d) {
            // @ts-ignore
            return newX(d.Sepal_Length)
          })
          .attr('cy', function (d) {
            // @ts-ignore
            return newY(d.Petal_Length)
          });
      }
    });
  }

  /**
   * Purpose: test
   */
  drawTimeline2() {
    const csvData = this.state.data.arrayOfData;
    const data: Array<object> = csvData;

    const height = this.state.height;
    const width = this.state.width;
    const margin = ({
      top: 20,
      right: 0,
      bottom: 30,
      left: 40
    });

    const xColumn = 'Order Date';
    const yColumn = 'Units Sold';

    const svg = d3.select('#svgtarget')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(zoom);


    const x = d3.scaleBand()
      .domain(data.map((d: any) => d[xColumn]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => d[yColumn])]).nice()
      .range([height - margin.bottom, margin.top]);

    // @ts-ignore
    svg.append('g')
      .attr('class', 'bars')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(data)
      .join('rect')
      // @ts-ignore
      .attr('x', (d: any, i: number) => (x(d[xColumn])))
      .attr('y', (d: any) => y(d[yColumn]))
      .attr('height', (d: any) => y(0) - y(d[yColumn]))
      .attr('width', x.bandwidth());

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));


    // eslint-disable-next-line require-jsdoc
    function zoom(svg: any) {
      const extent: [[number, number], [number, number]] = [[margin.left, margin.top], [width - margin.right, height - margin.top]];

      svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on('zoom', zoomed));

      function zoomed() {
        // @ts-ignore
        x.range([margin.left, width - margin.right].map((d: any) => d3.event.transform.applyX(d)));
        svg.selectAll('.bars rect').attr('x', (d: any) => x(d[xColumn])).attr('width', x.bandwidth());
        svg.selectAll('.x-axis')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickSizeOuter(0));
      }
    }
  }


  /**
   * Purpose: draws the timeline and runs the functions and event handlers for
   * said timeline
   */
  drawTimeline() {
    const height = this.state.height -
      (this.state.marginBottom + this.state.marginTop);
    const width = this.state.width -
      (this.state.marginLeft + this.state.marginRight);

    const fullWidth = this.state.width;
    const fullHeight = this.state.height;
    const barWidth = 50;
    const barBuffer = 1;
    const numBars = Math.floor(width / barWidth) +
      barBuffer;// small pixel buffer to ensure smooth transitions
    let dataIdx = 0;
    let deltaX = 0;
    let scale = 1;
    const xColumn = 'Order Date';
    const yColumn = 'Units Sold';

    const csvData = this.state.data.arrayOfData;
    let data: Array<object> = csvData.slice(0, numBars);
    // @ts-ignore
    const ordinals = data.map((d) => d[xColumn]);

    const x = d3.scaleLinear()
      .domain([0, ordinals.length])
      .rangeRound([0, width]);

    const y = d3.scaleLinear()
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

    const extent: [[number, number], [number, number]] =
      [[this.state.marginLeft, this.state.marginTop],
        [width - this.state.marginRight,
          height - this.state.marginTop]];

    const zoom = d3.zoom()
      .scaleExtent([1, 20]) // zoom range
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', updateChart);

    const svg = d3.select('#svgtarget')
      .append('svg')
      .attr('width', width)
      .attr('height', height + this.state.marginTop +
        this.state.marginBottom)
      // @ts-ignore
      .call(zoom)
      .append('g')
      .attr('transform', 'translate(' + this.state.marginLeft +
        ',' + this.state.marginTop + ')');

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none');

    svg.append('defs')
      .append('clipPath')
      .attr('id', 'barsBox')
      .append('rect')
      .attr('width', width)
      .attr('height', height + this.state.marginTop +
        this.state.marginBottom)
      .attr('x', 0)
      .attr('y', 0);

    // Create layers in order so that the bars will disapear under the axis
    const barsLayer = svg.append('g')
      .attr('clip-path', 'url(#barsBox)')
      .append('g')
      .attr('id', 'barsLayer')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    const axisLayer = svg.append('g')
      .attr('id', 'axisLayer');

    // y axis
    const yAxis = axisLayer.append('g')
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

    // Create bars
    const plot = barsLayer.append('g')
      .attr('class', 'plot')
      .attr('id', 'bars');

    // x axis
    const xAxis = barsLayer.append('g')
      .attr('id', 'xaxis')
      .style('color', 'red')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickFormat(function (d) {
        // @ts-ignore
        return ordinals[d];// now for 0 it will return 'a' for 1 b and so on
      }))
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '1rem')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-90)');

    // Three function that change the tooltip when user hover/move/leave bar
    /**
     * Purpose: adds the tooltip to the canvas when the user mouses over a piece
     * of timeline data.
     * Timeline scope: all elements
     * @param {any} d
     */
    function ttOver(d: any) {
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
        keys.forEach(function (key) {
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
    function ttUpdatePos(xPos: number, yPos: number) {
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
    function ttMove(d: any) {
      // event is a mouseEvent
      ttUpdatePos(d3.event.x, d3.event.y);
    }

    /**
     * Purpose: called when the cursor moves off of a bar
     * Timeline Scope: all elements
     * @param {any} d
     */
    function ttLeave(d: any) {
      // delete all tooltips
      if (d3.event.buttons === 0) {
        d3.selectAll('.tooltip').remove();
      }
    }

    /**
     * Purpose: updates the state and positioning of element on the Timeline
     */
    function updateChart() {
      // recover the new scale
      scale = d3.event.transform.k;
      const newX = d3.event.transform.rescaleX(x);
      const newY = d3.event.transform.rescaleY(y);

      log('newX: ' + newX(10));

      d3.selectAll('#xaxis').remove();

      barsLayer.append('g')
        .attr('id', 'xaxis')
        .style('color', 'red')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(newX).tickFormat(function (d) {
          // @ts-ignore
          return ordinals[d];// now for 0 it will return 'a' for 1 b and so on
        }))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '1rem')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-90)');

      yAxis.call(d3.axisLeft(newY));

      // deltaX = newX(deltaX);

      // log("deltaX: " + deltaX);

      d3.selectAll('.bar')
        .attr('x', (d, i) => scale * barWidth * (i + dataIdx))
        .attr('width', scale * barWidth);

      if (d3.event.sourceEvent.type === 'mousemove') {
        dragged();
      }
      moveChart();
    }

    /**
     * Purpose: used to update which bars are being rendered to the screen
     */
    function updateBars() {
      plot.selectAll('.bar')
        .data(data, function (d: any, i: any, group: any) {
          return d.index;
        })
        .join(
          (enter: any) => enter.append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any, i: number) =>
              (scale * barWidth * (i + dataIdx)))
            .attr('width', scale * barWidth)
            .attr('y', (d: any) => y(d[yColumn]))
            .attr('height', (d: any) => {
              const newHeight = (height - y(d[yColumn]));
              if (newHeight < 0) {
                console.log('Bad height: ' + d[yColumn]);
                return 0;
              } else {
                return (height - y(d[yColumn]));
              }
            })
            .on('mouseover', ttOver)
            .on('mousemove', ttMove)
            .on('mouseleave', ttLeave),

          (update: any) => update,

          (exit: { remove: () => void; }) => exit.remove()
        );
    }

    /**
     *
     */
    function moveChart() {
      d3.select('#barsLayer')
        .attr('transform', (d) => {
          return `translate(${deltaX},0)`;
        });

      dataIdx = Math.floor(-deltaX / (scale * barWidth));
      data = csvData.slice(dataIdx, numBars + dataIdx);

      log('moveChart dataIdx: ' + dataIdx);

      updateBars();
    }

    /**
     * @this dragStarted
     * @param {any} this
     */
    function dragStarted(this: any) {
      d3.select(this).raise()
        .classed('active', true);
    }

    /**
     * Purpose: called when the timeline is dragged by the user
     */
    function dragged() {
      ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);

      deltaX += d3.event.sourceEvent.movementX;
      if (deltaX > 0) {
        deltaX = 0;
      }
      moveChart();
    }

    /**
     * @this dragEnded
     * @param {any} this
     */
    function dragEnded(this: any) {
      d3.select(this).classed('active', false);
    }

    updateBars();
  }
}
