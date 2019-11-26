import TimelineTypeInterface, {TimelineType} from './TimelineTypeInterface';
import * as d3 from 'd3';

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * IntervalMagnitude timeline
 */
export default class IntervalMagnitude extends TimelineType
  implements TimelineTypeInterface {
  /**
   * Purpose: draws an element as an Interval with a Magnitude
   * @param {any} selection: the selection for the object to draw
   * @param {any} ttOver: tooltip over function
   * @param {any} ttMove: tooltip move function
   * @param {any} ttLeave: tooltip leave function
   */
  draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void {
    selection.append('rect')
        .attr('class', 'bar')
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
   * Purpose: updates dataIdx, data, and ordinals when drawing an
   * IntervalMagnitude Timeline
   */
  getData(): void {
    let dataIdxEnd: number;
    const keyInt1 = this.m.xColumn + '_num';
    const keyInt2 = this.m.xColumn2 + '_num';
    let consecutive = true;

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
      if (consecutive &&
        ((this.m.scale * this.m.timeScale(elem[keyInt1])) < - this.m.deltaX &&
          (this.m.scale * this.m.timeScale(elem[keyInt2])) < - this.m.deltaX)) {
        this.m.dataIdx++;
      } else {
        consecutive = false;
      }

      // If this is true, then the x position of the start of the bar and end
      // of the bar are currently outside of the viewing area
      /* eslint-disable max-len */
      if (!((this.m.scale * this.m.timeScale(elem[keyInt1])) < (-this.m.deltaX + this.m.width) ||
        (((this.m.scale * this.m.timeScale(elem[keyInt2])) <= - this.m.deltaX + this.m.width) &&
          ((this.m.scale * this.m.timeScale(elem[keyInt2])) > - this.m.deltaX)))) {
        break;
      }
      /* eslint-enable max-len */
    }
    this.m.data = this.m.csvData.slice(this.m.dataIdx,
        dataIdxEnd + this.m.barBuffer);
  }

  /**
   *
   */
  applyZoom(): void {
    d3.selectAll('.bar')
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

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.m.marginLeft)
        .attr('x', 0 - (this.m.height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(this.m.yColumn);
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
