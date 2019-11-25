import TimelineTypeInterface, {TimelineType}
  from './TimelineTypes/TimelineTypeInterface';

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
  }

  /**
   * handles drawing the data correctly; as interval occurrence data
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   */
  draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void {
  }

  /**
   * Purpose: draws the initial axis labels when the timeline is first rendered
   * @param {any} svg: the SVG element
   */
  drawLabels(svg: any): void {
    svg.append('text')
        .attr('transform',
            `translate(${(this.m.width / 2) + 10},${this.m.height +
        this.m.marginTop + 20})`)
        .style('text-anchor', 'start')
        .text('end: ' + this.m.xColumn2);

    svg.append('text')
        .attr('transform',
        // eslint-disable-next-line max-len
            `translate(${this.m.width / 2},${this.m.height + this.m.marginTop + 20})`)
        .style('text-anchor', 'end')
        .text('start: ' + this.m.xColumn + ',');
  }

  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * IntervalOccurrence Timeline
   */
  getData(): void {
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    return `translate(${this.m.timeScale(new Date(datum.text))},
      ${this.m.height})`;
  }
}
