import TimelineTypeInterface from './TimelineTypeInterface';
import * as d3ScaleChromatic
  from 'd3-scale-chromatic';
import EventTimelineType
  from './EventTimelineType';

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * EventOccurrence timeline
 */
export default class EventOccurrence extends EventTimelineType
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

    if (this.m.yColumn2 !== '') {
      bar.append('rect')
          .attr('class', 'pin-line')
          // .attr('x', (d: any, i: number) =>
          //   (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('x', (d: any) =>
            (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('width', 2)
          .attr('y', (d: any) =>
            this.m.y(d[this.m.yColumn2]) + (this.m.y.bandwidth()/2))
          .attr('height', (d: any) => {
            const newHeight = (this.m.height - (this.m.y(d[this.m.yColumn2]) +
              (this.m.y.bandwidth()/2)));
            return newHeight < 0 ? 0 : newHeight;
          });

      // Circles
      bar.append('circle')
          .attr('class', 'pin-head')
          // .attr('cx', (d: any, i: number) =>
          //   (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('cx', (d: any) =>
            (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('cy', (d:any) =>
            this.m.y(d[this.m.yColumn2]) + (this.m.y.bandwidth()/2))
          .attr('r', '5')
          .style('fill', (d: any) =>
            d3ScaleChromatic.interpolateRainbow(this.m.y(d[this.m.yColumn2])))
          // .style('fill', '#69b3a2')
          .attr('stroke', 'black')
          .on('mouseover', ttOver)
          .on('mousemove', ttMove)
          .on('mouseleave', ttLeave);
    } else {
      bar.append('rect')
          .attr('class', 'pin-line')
          // .attr('x', (d: any, i: number) =>
          //   (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('x', (d: any) =>
            (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('width', 2)
          .attr('y', (d: any) =>
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
        // .attr('cx', (d: any, i: number) =>
        //   (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
        .attr('cx', (d: any) =>
          (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
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
