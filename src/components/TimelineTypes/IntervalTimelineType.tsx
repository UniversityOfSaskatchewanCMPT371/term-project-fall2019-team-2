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
   * handles zooming
   */
  applyZoom(): void {
    // console.log(this.m.csvData);
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
            // console.log((scale * (timeScale(new Date(d[keyInt2])) -
            // timeScale(new Date(d[keyInt1])))));
            // console.log(d);

            return (scale * (timeScale(new Date(d[keyInt2])) -
              timeScale(new Date(d[keyInt1]))));
          });
    });

    d3.selectAll('.xtick')
        .attr('transform', (d: any) =>
          `translate(${this.m.scale *
          this.m.timeScale(new Date(d[this.m.xColumn]))},${this.m.height})`);
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
