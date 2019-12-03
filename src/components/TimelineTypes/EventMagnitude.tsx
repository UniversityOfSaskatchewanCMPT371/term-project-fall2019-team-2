import TimelineTypeInterface from './TimelineTypeInterface';
import EventTimelineType
  from './EventTimelineType';
/**
 * Purpose: to provide methods specific and relevant to drawing an
 * EventMagnitude timeline
 */
export default class EventMagnitude extends EventTimelineType
  implements TimelineTypeInterface {
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
          return newHeight < 0 ? 0 : newHeight;
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
