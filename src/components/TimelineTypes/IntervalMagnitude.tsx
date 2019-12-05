import TimelineTypeInterface from './TimelineTypeInterface';
import IntervalTimelineType
  from './IntervalTimelineType';

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * IntervalMagnitude timeline
 */
export default class IntervalMagnitude extends IntervalTimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: draws an element as an Interval with a Magnitude
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   */
  draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void {
    const newBar = selection.append('g')
        .attr('class', 'bar');

    newBar.append('rect')
        .attr('class', 'box')
        .attr('x', (d: any) =>
          (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('width', (d: any) =>
          (this.m.timeScale(new Date(d[this.m.xColumn2])) -
          this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('y', (d: any) => this.m.y(d[this.m.yColumn]))
        .attr('height', (d: any) => {
          const newHeight = (this.m.height - this.m.y(d[this.m.yColumn]));
          if (newHeight < 0) {
            return 0;
          } else {
            return (this.m.height - this.m.y(d[this.m.yColumn]));
          }
        })
        .style('fill', '#61a3a9')
        .style('opacity', 0.2)
        .on('mouseover', ttOver)
        .on('mousemove', ttMove)
        .on('mouseleave', ttLeave);
  }

  /**
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   * @return {boolean}: a boolean indicating if the primType is appropriate
   * for the y axis
   */
  checkYPrimType(primType: string): boolean {
    return (primType === 'date' ||
        primType === 'number');
  }
}
