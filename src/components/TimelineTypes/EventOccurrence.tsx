import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';
import * as d3 from 'd3';

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

    bar.append('rect')
        .attr('class', 'pin-line')
        .attr('x', (d: any, i: number) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        .attr('width', 2)
        .attr('y', (d: any, i: number) =>
          this.m.y(d[this.m.yColumn]))
        .attr('height', (d: any) => {
          const newHeight = (this.m.height - this.m.y(d[this.m.yColumn]));
          return newHeight < 0 ? 0 : newHeight;
        });

    bar.append('text')
        .text((d: any) => d[this.m.yColumn])
        .attr('class', 'pin-text')
        .style('text-anchor', 'start')
        .style('font-size', '1rem')
        .attr('x', (d: any, i: number) =>
          (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        .attr('y', (d: any, i: number) =>
          this.m.y(d[this.m.yColumn]));

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
