import TimelineTypeInterface, {TimelineType}
  from './TimelineTypeInterface';

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
    const lineHeight = this.m.height/2;
    // Show the main vertical line
    selection.append('line')
        .attr('x', (d: any) =>
          this.m.timeScale(new Date(d[this.m.xColumn])))
        .attr('x2', (d: any) =>
          this.m.timeScale(new Date(d[this.m.xColumn2])))
        .attr('y1', (lineHeight))
        .attr('y2', (lineHeight))
        .attr('stroke', 'black')
        .style('width', 40);

    // shows the intervals
    selection.append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) =>
          (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('width', (d: any) =>
          (this.m.timeScale(new Date(d[this.m.xColumn2])) -
          this.m.timeScale(new Date(d[this.m.xColumn]))))
        .attr('y', (d: any, i: number) => {
          if (i % 2 === 0) {
            return this.m.height/4;
          } else {
            return this.m.height/2;
          }
        })
        .attr('height', (this.m.height/4))
        .style('fill', '#61a3a9')
        .style('opacity', 0.2)
        .on('mouseover', ttOver)
        .on('mousemove', ttMove)
        .on('mouseleave', ttLeave);
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
