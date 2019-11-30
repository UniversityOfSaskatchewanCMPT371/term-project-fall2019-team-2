import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';
import * as d3 from 'd3';
import * as d3ScaleChromatic
  from 'd3-scale-chromatic';

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * EventOccurrence timeline
 */
export default class EventOccurrence extends TimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: modify the representation of the timeline when a zoom is fired
   */
  applyZoom() {
    d3.selectAll('.pin-line')
        .attr('x', (d, i) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)));
    d3.selectAll('.pin-text')
        .attr('x', (d, i) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)));

    d3.selectAll('.xtick')
        .attr('transform', (d: any) => 'translate(' +
            ((this.m.scale * this.m.barWidth * (d['index'] + this.m.dataIdx)) +
                ((this.m.scale * this.m.barWidth) / 2)) + ',' +
            this.m.height + ')');
  }

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

    // console.error(selection.datum());
    // const newY selection.dataum
    if (this.m.yColumn2 !== '') {
      bar.append('rect')
          .attr('class', 'pin-line')
          .attr('x', (d: any, i: number) =>
            (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('width', 2)
          .attr('y', (d: any, i: number) =>
            this.m.y(d[this.m.yColumn2]) + (this.m.y.bandwidth()/2))
          .attr('height', (d: any) => {
            const newHeight = (this.m.height -
                (this.m.y(d[this.m.yColumn2]) + (this.m.y.bandwidth()/2)));
            return newHeight < 0 ? 0 : newHeight;
          });

      // Circles
      bar.append('circle')
          .attr('class', 'pin-head')
          .attr('cx', (d: any, i: number) =>
            (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          // .attr('cy', (d: any) => this.m.y(d[this.m.yColumn]))
          .attr('cy', (d:any) =>
            this.m.y(d[this.m.yColumn2]) + (this.m.y.bandwidth()/2))
          .attr('r', '5')
          .style('fill', (d: any) =>
            d3ScaleChromatic
                .interpolateRainbow(this.m.y(d[this.m.yColumn2])))
          // .style('fill', '#69b3a2')
          .attr('stroke', 'black')
          .on('mouseover', ttOver)
          .on('mousemove', ttMove)
          .on('mouseleave', ttLeave);
    } else {
      bar.append('rect')
          .attr('class', 'pin-line')
          .attr('x', (d: any, i: number) =>
            (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('width', 2)
          .attr('y', (d: any, i: number) =>
            this.m.y(d[this.m.yColumn]) + (this.m.y.bandwidth()/2))
          .attr('height', (d: any) => {
            const newHeight = (this.m.height -
                (this.m.y(d[this.m.yColumn]) + (this.m.y.bandwidth()/2)));
            return newHeight < 0 ? 0 : newHeight;
          });
    }

    // Circles
    bar.append('circle')
        .attr('class', 'pin-head')
        .attr('cx', (d: any, i: number) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        // .attr('cy', (d: any) => this.m.y(d[this.m.yColumn]))
        .attr('cy', (d:any) =>
          this.m.y(d[this.m.yColumn]) + (this.m.y.bandwidth()/2))
        .attr('r', '5')
        .style('fill', (d: any) =>
          d3ScaleChromatic
              .interpolateRainbow(this.m.y(d[this.m.yColumn])))
        // .style('fill', '#69b3a2')
        .attr('stroke', 'black')
        .on('mouseover', ttOver)
        .on('mousemove', ttMove)
        .on('mouseleave', ttLeave);

    console.log('EventMagnitude.draw(): ');
    console.log(bar);
  }

  /**
   * Purpose: draws the initial axis labels when the timeline is first rendered
   * @param {any} svg: the SVG element
   */
  drawLabels(svg: any): void {
    svg.append('text')
        .attr('transform',
            // eslint-disable-next-line max-len
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
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * EventMagnitude Timeline
   */
  getData(): void {
    // finds starting index
    this.m.dataIdx =
        Math.floor(- this.m.deltaX / (this.m.scale * this.m.barWidth));
    this.m.data =
        this.m.csvData.slice(this.m.dataIdx, this.m.numBars + this.m.dataIdx);
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    return 'translate(' +
        ((this.m.scale * this.m.barWidth * (datum.index + this.m.dataIdx)) +
            ((this.m.scale * this.m.barWidth) / 2)) + ',' + this.m.height + ')';
  }

  /**
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   * @return {boolean}: a boolean indicating if the primType is appropriate
   * for the y axis
   */
  checkYPrimType(primType: string): boolean {
    return (primType === 'date' ||
        primType === 'number' ||
        primType === 'string');
  }
}
