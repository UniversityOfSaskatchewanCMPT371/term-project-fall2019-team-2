import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';
import * as d3
  from 'd3';

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
    const barWidth = this.m.barWidth;
    const dataIdx = this.m.dataIdx;
    bar.each(function( d: any, i: number) {
      // eslint-disable-next-line no-invalid-this
      d3.select(this).selectAll('.pin-line')
          .attr('x', (d: any) =>
            (scale * barWidth * (i + dataIdx)));
      // eslint-disable-next-line no-invalid-this
      d3.select(this).selectAll('.pin-head')
          .attr('cx', (d: any) =>
            (scale * barWidth * (i + dataIdx)));
    });

    d3.selectAll('.xtick')
        .attr('transform', (d: any) => 'translate(' +
            ((this.m.scale * this.m.barWidth * (d['index'] + this.m.dataIdx)) +
                ((this.m.scale * this.m.barWidth) / 2)) + ',' +
            this.m.height + ')');
  }

  abstract draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;


  abstract checkYPrimType(primType: string): boolean;


  /**
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * EventMagnitude Timeline
   */
  getData(): void {
    // finds starting index
    this.m.dataIdx =
        Math.floor(- this.m.deltaX / (this.m.scale * this.m.barWidth));
    this.m.data =
        this.m.csvData.slice(this.m.dataIdx, this.m.numBars + this.m.dataIdx);
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    return 'translate(' +
        ((this.m.scale * this.m.barWidth * (datum.index + this.m.dataIdx)) +
            ((this.m.scale * this.m.barWidth) / 2)) + ',' + this.m.height + ')';
  }
}
