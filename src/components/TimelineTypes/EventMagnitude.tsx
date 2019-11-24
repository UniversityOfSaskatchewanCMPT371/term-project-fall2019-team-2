import TimelineModel from '../TimelineModel';
import * as d3 from 'd3';
import TimelineTypeInterface from './TimelineTypeInterface';

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * EventMagnitude timeline
 */
export default class EventMagnitude implements TimelineTypeInterface {
  m: TimelineModel;

  /**
   * Purpose: draws an element as Event with a Magnitude
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   */
  draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void {
    const bar = selection.append('g')
        .attr('class', 'bar');

    bar.append('rect')
        .attr('class', 'pin-line')
        .attr('x', (d: any, i: number) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        .attr('width', 2)
        .attr('y', (d: any) => this.m.y(d[this.m.yColumn]))
        .attr('height', (d: any) => {
          const newHeight = (this.m.height - this.m.y(d[this.m.yColumn]));
          if (newHeight < 0) {
            return 0;
          } else {
            return (this.m.height - this.m.y(d[this.m.yColumn]));
          }
        });
    // Circles
    bar.append('circle')
        .attr('class', 'pin-head')
        .attr('cx', (d: any, i: number) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        .attr('cy', (d: any) => this.m.y(d[this.m.yColumn]))
        .attr('r', '5')
        .style('fill', '#69b3a2')
        .attr('stroke', 'black')
        .on('mouseover', ttOver)
        .on('mousemove', ttMove)
        .on('mouseleave', ttLeave);

    console.log('EventMagnitude.draw(): ');
    console.log(bar);
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * EventMagnitude Timeline
   */
  getData(): void {
    // finds starting index
    this.m.dataIdx =
      Math.floor(- this.m.deltaX / (this.m.scale * this.m.barWidth));
    this.m.data =
      this.m.csvData.slice(this.m.dataIdx, this.m.numBars + this.m.dataIdx);
    // ordinals = data.map((d: any) => d[xColumn]);
  }

  /**
   * Purpose: modify the representation of the timeline when a zoom is fired
   */
  applyZoom() {
    d3.selectAll('.pin-line')
        .attr('x', (d, i) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)));
    d3.selectAll('.pin-head')
        .attr('cx', (d, i) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)));

    d3.selectAll('.xtick')
        .attr('transform', (d: any, i) => 'translate(' +
        ((this.m.scale * this.m.barWidth * (d['index'] + this.m.dataIdx)) +
          ((this.m.scale * this.m.barWidth) / 2)) + ',' + this.m.height + ')');
  }

  drawLabels(svg: any): void {
    svg.append('text')
        .attr('transform',
            `translate(${this.m.width / 2},${this.m.height + this.m.marginTop + 20})`)
        .style('text-anchor', 'start')
        .text(this.m.xColumn);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.m.marginLeft)
        .attr('x', 0 - (this.m.height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(this.m.yColumn);
  }

  /**
   * Purpose: constructor
   * @param {TimelineModel} newModel: the TimelineModel to pass into the
   * EventMagnitude object
   */
  constructor(newModel: TimelineModel) {
    this.m = newModel;
  }
}
