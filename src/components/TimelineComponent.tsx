import React from 'react';
import TimelineInterface, {TimelineState} from './TimelineInterface';
import * as d3 from 'd3';


function log(str: string) {
  console.log(str);
}

export default class TimelineComponent extends
  React.Component<TimelineInterface, TimelineState> {
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
  }

  componentDidMount(): void {
    this.drawTimeline();
  }

  render() {
    return (
      <div>
        <div id="svgtarget">
        </div>
      </div>
    );
  }

  drawTimeline() {
    const height = this.state.height -
        (this.state.marginBottom + this.state.marginTop);
    const width = this.state.width -
        (this.state.marginLeft + this.state.marginRight);
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


    // Three function that change the tooltip when user hover/move/leave bar
    const ttover = function(d: any) {
      // log(d3.event);
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
        let tooltip = '';
        keys.forEach(function(key) {
          tooltip += '<strong>' + key + '</strong> <span style=\'color:red\'>' +
              d[key] + '</span>' + '<br/>';
        });

        Tooltip.html(tooltip)
            .style('opacity', 1);
      }
    };

    function ttUpdatePos(xPos: number, yPos: number) {
      d3.selectAll('.tooltip')
          .style('left', (xPos + 70) + 'px')
          .style('top', (yPos + 'px'));
    }

    const ttmove = function(d: any) {
      // event is a mouseEvent
      ttUpdatePos(d3.event.x, d3.event.y);
    };

    const ttleave = function(d: any) {
      // delete all tooltips
      if (d3.event.buttons === 0) {
        d3.selectAll('.tooltip').remove();
      }
    };

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
    const barsLayer = svg
        .append('g')
        .attr('clip-path', 'url(#barsBox)')
        .append('g')
        .attr('id', 'barsLayer')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

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

    // const bars = plot.selectAll('.bar')
    //     .data(data, function(d: any) {
    //       // eslint-disable-next-line no-invalid-this
    //       log(this);
    //       // @ts-ignore
    //       return d ? d.index : this.id;
    //     });

    updateBars();

    // x axis
    const xAxis = barsLayer.append('g')
        .attr('id', 'xaxis')
        .style('color', 'red')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat(function(d) {
        // @ts-ignore
          return ordinals[d];// now for 0 it will return 'a' for 1 b and so on
        }))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-90)');

    function updateChart() {
      // log('updateChart');
      // log(d3.event);
      // recover the new scale

      scale = d3.event.transform.k;
      const newX = d3.event.transform.rescaleX(x);
      const newY = d3.event.transform.rescaleY(y);
      yAxis.call(d3.axisLeft(newY));

      d3.selectAll('.bar')
          .attr('x', (d, i) => scale * barWidth * (i + dataIdx))
          .attr('width', scale * barWidth);

      if (d3.event.sourceEvent.type === 'mousemove') {
        dragged();
      }
      moveChart();
    }

    function updateBars() {
      plot.selectAll('.bar')
          .data(data, function(d: any, i: any, group: any) {
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
                  .on('mouseover', ttover)
                  .on('mousemove', ttmove)
                  .on('mouseleave', ttleave),

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

    function dragstarted(this: any) {
      d3.select(this).raise()
          .classed('active', true);
    }

    function dragged() {
      ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);

      deltaX += d3.event.sourceEvent.movementX;
      if (deltaX > 0) {
        deltaX = 0;
      }

      moveChart();
    }

    function dragended(this: any) {
      d3.select(this).classed('active', false);
    }
  }
}
