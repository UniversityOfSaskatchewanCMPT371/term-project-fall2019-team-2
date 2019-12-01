import TimelineTypeInterface, {TimelineType}
  from './TimelineTypeInterface';
import * as d3
  from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import assert
  from 'assert';

/**
 * Purpose: provides methods relevant to drawing intervalOccurrence
 * data
 */
export default class IntervalOccurrence extends TimelineType
  implements TimelineTypeInterface {
  /**
   * handles zooming
   */
  applyZoom(): void {
    d3.selectAll('.box')
        .attr('x', (d: any) =>
          this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn])))
        .attr('width', (d: any) =>
          this.m.scale * (this.m.timeScale(new Date(d[this.m.xColumn2])) -
            this.m.timeScale(new Date(d[this.m.xColumn]))));

    d3.selectAll('.xtick')
        .attr('transform', (d: any) =>
          `translate(${this.m.scale * this.m.timeScale(new Date(d.text))},
            ${this.m.height})`);

    d3.selectAll('.line')
        .attr('x2', (d: any) =>
          this.m.scale * (this.m.timeScale(new Date(d[this.m.xColumn2]))));
    d3.selectAll('.text')
        .attr('x', (d: any) =>
          this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn])));
  }

  /**
   * handles drawing the data correctly; as interval occurrence data
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   */
  draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void {
    const newBar = selection.append('g')
        .attr('class', 'bar');

    // shows the intervals
    newBar.append('rect')
        .attr('class', 'box')
        .attr('x', (d: any) =>
          (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('width', (d: any) =>
          (this.m.timeScale(new Date(d[this.m.xColumn2])) -
          this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('y', (d: any, i: number) =>
          this.m.y(d[this.m.yColumn]))
        .attr('height', (d: any) => {
          const newHeight = this.m.y.bandwidth();
          return newHeight < 0 ? 0 : newHeight;
        })
        .style('fill', (d: any) =>
          d3ScaleChromatic
              .interpolateRainbow(this.m.y(d[this.m.yColumn])))
        .style('opacity', 0.2)
        .on('mouseover', ttOver)
        .on('mousemove', ttMove)
        .on('mouseleave', ttLeave);

    if (this.m.yColumn2 !== '') {
      newBar.append('rect')
          .attr('class', 'box')
          .attr('x', (d: any) =>
            (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('width', (d: any) =>
            (this.m.timeScale(new Date(d[this.m.xColumn2])) -
                  this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('y', (d: any, i: number) =>
            this.m.y(d[this.m.yColumn2]))
          .attr('height', (d: any) => {
            const newHeight = this.m.y.bandwidth();
            return newHeight < 0 ? 0 : newHeight;
          })
          .style('fill', (d: any) =>
            d3ScaleChromatic
                .interpolateRainbow(this.m.y(d[this.m.yColumn2])))
          .style('opacity', 0.2)
          .on('mouseover', ttOver)
          .on('mousemove', ttMove)
          .on('mouseleave', ttLeave);
    }
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    assert(datum !== undefined && datum !== null,
        'datum is null');
    return `translate(${this.m.timeScale(new Date(datum.text))},
      ${this.m.height})`;
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
