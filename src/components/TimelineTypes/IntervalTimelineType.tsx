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
    d3.selectAll('.box')
        .attr('x', (d: any) =>
          this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn])))
        .attr('width', (d: any) =>
          this.m.scale * (this.m.timeScale(new Date(d[this.m.xColumn2])) -
            this.m.timeScale(new Date(d[this.m.xColumn]))));

    d3.selectAll('.xtick')
        .attr('transform', (d: any) =>
          `translate(${this.m.scale * this.m.timeScale(new Date(d.text))},
            ${this.m.height})`);
  }

  abstract draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;


  abstract checkYPrimType(primType: string): boolean;

  /**
   * Purpose: updates the range of elements currently being rendered on the
   * timeline
   *
   * @preconditions: the timeline component has correctly mounted and has a
   * non-empty set of data
   *
   * @postconditions: the array of data to be rendered is updated to accurately
   * reflect the information from the timeline
   */
  getData(): void {
    let dataIdxEnd: number = 0;
    let dataIdxStart: number = 0;
    const keyInt1 = this.m.xColumn + '_num';
    const keyInt2 = this.m.xColumn2 + '_num';
    let consecutive = true;

    assert(this.m.deltaXDirection === 1 ||
        this.m.deltaXDirection === -1);

    // console.log(this.m.deltaXDirection);
    if (this.m.deltaXDirection === 1) {
      for (dataIdxEnd = this.m.dataIdx;
        dataIdxEnd < this.m.csvData.length;
        dataIdxEnd++) {
        const elem: any = this.m.csvData[dataIdxEnd];

        if (!elem.hasOwnProperty(keyInt1)) {
          elem[keyInt1] = Date.parse(elem[this.m.xColumn]);
        }

        if (!elem.hasOwnProperty(keyInt2)) {
          elem[keyInt2] = Date.parse(elem[this.m.xColumn2]);
        }

        // We can only increment dataIdx if the preceding elements have also
        // been moved off of the current screen area, otherwise elements will be
        // removed prematurely
        /* eslint-disable max-len */
        if (consecutive &&
            ((this.m.scale * this.m.timeScale(elem[keyInt1])) < -this.m.deltaX &&
                (this.m.scale * this.m.timeScale(elem[keyInt2])) < -this.m.deltaX)) {
          this.m.dataIdx++;
        } else {
          consecutive = false;
        }
        /* eslint-enable max-len */

        // If this is true, then the x position of the start of the bar and end
        // of the bar are currently outside of the viewing area
        /* eslint-disable max-len */
        if (!((this.m.scale * this.m.timeScale(elem[keyInt1])) < (-this.m.deltaX + this.m.width) ||
            (((this.m.scale * this.m.timeScale(elem[keyInt2])) <= -this.m.deltaX + this.m.width) &&
                ((this.m.scale * this.m.timeScale(elem[keyInt2])) > -this.m.deltaX)))) {
          break;
        }
        /* eslint-enable max-len */
      }
      this.m.data = this.m.csvData.slice(this.m.dataIdx,
          dataIdxEnd + this.m.barBuffer);
    } else if (this.m.deltaXDirection === -1) {
      dataIdxStart = this.m.dataIdx + this.m.data.length;
      if (dataIdxStart >= this.m.csvData.length) {
        dataIdxStart = this.m.csvData.length - 1;
      }
      dataIdxEnd = dataIdxStart;
      for (dataIdxStart;
        dataIdxStart > 0;
        dataIdxStart--) {
        // console.log(dataIdxStart);
        const elem: any = this.m.csvData[dataIdxStart];

        if (!elem.hasOwnProperty(keyInt1)) {
          elem[keyInt1] = Date.parse(elem[this.m.xColumn]);
        }

        if (!elem.hasOwnProperty(keyInt2)) {
          elem[keyInt2] = Date.parse(elem[this.m.xColumn2]);
        }

        // We can only increment dataIdx if the preceding elements have also
        // been moved off of the current screen area, otherwise elements will be
        // removed prematurely
        /* eslint-disable max-len */
        if (consecutive &&
            !((this.m.scale * this.m.timeScale(elem[keyInt1])) < (-this.m.deltaX + this.m.width) ||
                (((this.m.scale * this.m.timeScale(elem[keyInt2])) <= -this.m.deltaX + this.m.width) &&
                    ((this.m.scale * this.m.timeScale(elem[keyInt2])) > -this.m.deltaX)))) {
          dataIdxEnd--;
        } else {
          consecutive = false;
        }
        /* eslint-enable max-len */

        // If this is true, then the x position of the start of the bar and end
        // of the bar are currently outside of the viewing area
        /* eslint-disable max-len */
        if (((this.m.scale * this.m.timeScale(elem[keyInt1])) < -this.m.deltaX &&
            // right end of block
            (this.m.scale * this.m.timeScale(elem[keyInt2])) < -this.m.deltaX)) {
          break;
        }
        /* eslint-enable max-len */
      }


      this.m.data = this.m.csvData.slice(dataIdxStart,
          dataIdxEnd + this.m.barBuffer);
      this.m.dataIdx = dataIdxStart;
    }
    console.log(`this.m.dataIdx ${this.m.dataIdx}\n` +
        `dataIdxStart ${dataIdxStart}\n` +
        `dataIdxEnd ${dataIdxEnd}`);
    console.log(this.m.data);
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translations string
   */
  getTickTranslate(datum: any): string {
    assert(datum !== undefined && datum !== null,
        'datum is null');
    return `translate(${this.m.timeScale(new Date(datum.text))},
      ${this.m.height})`;
  }
}
