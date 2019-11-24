import TimelineModel from '../TimelineModel';


interface TimelineTypeInterface {
    m: TimelineModel;
    draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;
    getData(): void;
}

export default TimelineTypeInterface;

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * EventMagnitude timeline
 */
export class EventMagnitude implements TimelineTypeInterface {
    m: TimelineModel;

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

      bar.append('rect')
          .attr('class', 'pin-line')
          .attr('x', (d: any, i: number) =>
            (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('width', 2)
          .attr('y', (d: any) => this.m.y(d[this.m.yColumn]))
          .attr('height', (d: any) => {
            const newHeight = (this.m.height - this.m.y(d[this.m.yColumn]));
            if (newHeight < 0) {
              return 0;
            } else {
              return (this.m.height - this.m.y(d[this.m.yColumn]));
            }
          });
      // Circles
      bar.append('circle')
          .attr('class', 'pin-head')
          .attr('cx', (d: any, i: number) =>
            (this.m.scale * this.m.barWidth * (i + this.m.dataIdx)))
          .attr('cy', (d: any) => this.m.y(d[this.m.yColumn]))
          .attr('r', '5')
          .style('fill', '#69b3a2')
          .attr('stroke', 'black')
          .on('mouseover', ttOver)
          .on('mousemove', ttMove)
          .on('mouseleave', ttLeave);

      console.log('EventMagnitude.draw(): ');
      console.log(bar);
    }

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
      // ordinals = data.map((d: any) => d[xColumn]);
    }

    /**
     * Purpose: constructor
     * @param {TimelineModel} newModel: the TimelineModel to pass into the
     * EventMagnitude object
     */
    constructor(newModel: TimelineModel) {
      this.m = newModel;
    }
}
// class EventOccurrence

/**
 * Purpose: to provide methods specific and relevant to drawing an
 * IntervelMagnitude timeline
 */
export class IntervalMagnitude implements TimelineTypeInterface {
    m: TimelineModel;

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
          .attr('x', (d: any, i: number) =>
            (this.m.scale * this.m.timeScale(new Date(d[this.m.xColumn]))))
          .attr('width', (d: any, i: number) =>
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
     * Purpose: constructor
     * @param {TimelineModel} newModel: the TimelineModel to pass into the
     * IntervalMagnitude object
     */
    constructor(newModel: TimelineModel) {
      this.m = newModel;
    }
}
// class IntervalOccurrence

