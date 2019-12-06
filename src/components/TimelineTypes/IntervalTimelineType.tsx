import * as d3
  from 'd3';
import assert
  from 'assert';
import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';

/**
 * Purpose: this class exists to minimize code duplication between
 * IntervalOccurrence and IntervalMagnitude
 */
export default abstract class IntervalTimelineType extends TimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: modify the representation of the timeline when a zoom is fired
   *
   * @preconditions: A timeline is being rendered
   * @postconditions: The zoom factor is changed if possible
   */
  applyZoom(): void {
    const bar = d3.selectAll('.bar');
    const scale = this.m.scale;
    const timeScale = this.m.timeScale;
    const keyInt1 = this.m.xColumn;
    const keyInt2 = this.m.xColumn2;
    bar.each(function(d: any, i: number) {
      // eslint-disable-next-line no-invalid-this
      d3.select(this)
          .selectAll('.box')
          .attr('x', (d: any) =>
            scale * timeScale(new Date(d[keyInt1])))
          .attr('width', (d: any) => {
            return (scale * (timeScale(new Date(d[keyInt2])) -
              timeScale(new Date(d[keyInt1]))));
          });
    });

    d3.selectAll('.xtick')
        .attr('transform', (d: any) =>
          `translate(${this.m.scale *
          this.m.timeScale(new Date(d[this.m.xColumn]))},${this.m.height})`);
  }

  /**
   * Purpose: draws an element on the interval timeline
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
   *
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
