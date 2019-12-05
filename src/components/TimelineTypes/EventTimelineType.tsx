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
   */
  applyZoom() {
    const bar = d3.selectAll('.bar');
    const scale = this.m.scale;
    const timeScale = this.m.timeScale;
    const key = this.m.xColumn + '_num';

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


    // const from = ((this.m.width + this.m.deltaX) / 2);
    // const to = ((((this.m.deltaX + this.m.width) / 2)) * this.m.scale);
    //
    // console.log({to, from});
    // d3.select('#barsLayer')
    //     .attr('transform', `translate(${100},10)`);
    // d3.select('#barsLayer')
    //     .attr('transform', `translate(${(to-from)},0)`);
  }

  abstract draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;


  abstract checkYPrimType(primType: string): boolean;

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    assert(datum !== undefined && datum !== null,
        'datum is null');
    const key = this.m.xColumn;
    return `translate(${this.m.scale * this.m.timeScale(new Date(datum[key]))},
    ${this.m.height})`;
  }
}
