import TimelineTypeInterface
  from './TimelineTypeInterface';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import IntervalTimelineType
  from './IntervalTimelineType';

/**
 * Purpose: provides methods relevant to drawing intervalOccurrence
 * data
 */
export default class IntervalOccurrence extends IntervalTimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: draws an element on the interval occurrence timeline
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   *
   * @preconditions: Event elements exist to be rendered
   * @postconditions: The selected components are drawn, any tooltips are also
   * drawn
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
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   * @return {boolean}: a boolean indicating if the primType is appropriate
   * for the x axis
   *
   * @precondition: the primType accurately represents one of the columns from
   * the parsed csv.
   * @postcondition: true or false, based on whether or not the primType is
   * valid for the timeline type
   */
  checkYPrimType(primType: string): boolean {
    return (primType === 'date' ||
      primType === 'number' ||
      primType === 'string');
  }
}
