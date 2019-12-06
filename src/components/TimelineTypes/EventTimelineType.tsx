import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';
import * as d3
  from 'd3';
import assert from 'assert';

/**
 * Purpose: this class exists to minimize code duplication between
 * EventOccurrence and EventMagnitude
 */
export default abstract class EventTimelineType extends TimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: modify the representation of the timeline when a zoom is fired
   *
   * @preconditions: A timeline is being rendered
   * @postconditions: The zoom factor is changed if possible
   */
  applyZoom() {
    const bar = d3.selectAll('.bar');
    const scale = this.m.scale;
    const timeScale = this.m.timeScale;
    const key = `${this.m.xColumn}_num`;

    d3.select('#barsLayer');

    bar.each(function( d: any, i: number) {
      // eslint-disable-next-line no-invalid-this
      d3.select(this).selectAll('.pin-line')
          .attr('x', (d: any) =>
            (scale * timeScale(d[key])));
      // eslint-disable-next-line no-invalid-this
      d3.select(this).selectAll('.pin-head')
          .attr('cx', (d: any) =>
            (scale * timeScale(d[key])));
    });

    d3.selectAll('.xtick')
        .attr('transform', (d: any) =>
          `translate(${this.m.scale * this.m.timeScale(d[key])},
          ${this.m.height})`);
  }

  /**
   * Purpose: draws an element on the event timeline
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   *
   * @preconditions: Event elements exist to be rendered
   * @postconditions: The selected components are drawn, any tooltips are also
   * drawn
   */
  abstract draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;

  /**
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   * @return {boolean}: a boolean indicating if the primType is appropriate
   * for the x axis
   * @precondition: the primType accurately represents one of the columns from
   * the parsed csv.
   * @postcondition: true or false, based on whether or not the primType is
   * valid for the timeline type
   */
  abstract checkYPrimType(primType: string): boolean;

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   *
   * @precondition: a csv has been parsed and sent to the timeline component
   * @postcondition: the bars and x-axis ticks are drawn correctly
   */
  getTickTranslate(datum: any): string {
    assert(datum !== undefined && datum !== null,
        'datum is null');
    const key = this.m.xColumn;
    return `translate(${this.m.scale * this.m.timeScale(new Date(datum[key]))},
    ${this.m.height})`;
  }
}
