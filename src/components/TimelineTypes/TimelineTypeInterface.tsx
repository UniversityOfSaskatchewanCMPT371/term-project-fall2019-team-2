import TimelineModel from '../TimelineModel';
import {ViewType} from '../TimelineComponent';
import assert from 'assert';
import * as d3 from 'd3';


interface TimelineTypeInterface {
    m: TimelineModel;
    draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;
    updateBars(ttOver: any, ttMove: any, ttLeave: any): void;
    getData(): void;
    applyZoom(): void;
    drawLabels(svg: any): void;
}

export default TimelineTypeInterface;

/**
 * Purpose: base TimelineType class
 */
export abstract class TimelineType implements TimelineTypeInterface {
  public m: TimelineModel;

  /**
   * Purpose: applies zooming
   */
  abstract applyZoom(): void;

  /**
   * Purpose
   * @param {any} selection
   * @param {any} ttOver
   * @param {any} ttMove
   * @param {any} ttLeave
   */
  abstract draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;

  /**
   * Purpose: draws the initial axis labels when the timeline is first rendered
   * @param {any} svg: the SVG element
   */
  drawLabels(svg: any): void {
    let xString: string;
    let yString: string;

    if (this.m.view === ViewType.EventOccurrence ||
      this.m.view === ViewType.IntervalOccurrence) {
      // Occurrence timelines may have either one or two y columns
      yString = this.m.yColumn;
      if (this.m.yColumn2 !== '') {
        yString += `, ${this.m.yColumn2}`;
      }
    } else {
      yString = this.m.yColumn;
    }

    if (this.m.view === ViewType.IntervalOccurrence ||
      this.m.view === ViewType.IntervalMagnitude) {
      // Interval timelines always have two x columns
      xString = `start: ${this.m.xColumn}, end: ${this.m.xColumn2}`;
    } else {
      // Event timelines only ever have one x column
      xString = this.m.xColumn;
    }

    svg.append('text')
        .attr('transform',
            `translate(${this.m.width / 2},` +
        `${this.m.height + this.m.marginTop + 20})`)
        .style('text-anchor', 'middle')
        .text(xString);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.m.marginLeft)
        .attr('x', 0 - (this.m.height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(yString);
  }

  /**
   * Purpose: checks if arguments are greater than the left bound of the
   * timeline
   * @param {number[]} args: values to compare to the left bound of the
   * timeline
   * @return {boolean}: true if all of the args are less than the right bound
   */
  outsideLeftBound(...args: number[]): boolean {
    const lBound: number = -this.m.deltaX;
    let result = true;

    if (args.length === 0) {
      result = false;
    }

    for (let i = 0; i < args.length; i++) {
      const arg: number = args[i];
      result = result && (arg < lBound);
    }
    return result;
  }

  /**
   * Purpose: checks if arguments are greater than the right bound of the
   * timeline
   * @param {number[]} args: values to compare to the right bound of the
   * timeline
   * @return {boolean}: true if all of the args are greater than the right bound
   */
  outsideRightBound(...args: number[]): boolean {
    const rBound: number = -this.m.deltaX + this.m.width;
    let result = true;

    if (args.length === 0) {
      result = false;
    }

    for (let i = 0; i < args.length; i++) {
      const arg: number = args[i];
      result = result && (arg > rBound);
    }
    return result;
  }

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
    console.log(this.m.csvData);
    let dataIdxEnd: number = 0;
    let dataIdxStart: number = 0;
    let consecutive = true;
    const keys = [];

    const direction = this.m.deltaXDirection;

    if (this.m.view === ViewType.IntervalOccurrence ||
      this.m.view === ViewType.IntervalMagnitude) {
      keys.push(this.m.xColumn);
      keys.push(this.m.xColumn2);
    } else {
      keys.push(this.m.xColumn);
    }

    assert(this.m.deltaXDirection === 1 ||
      this.m.deltaXDirection === -1);

    if (direction === 1) {
      dataIdxStart = dataIdxEnd = this.m.dataIdx;
    } else if (direction === -1) {
      // @ts-ignore
      dataIdxStart = dataIdxEnd =
        d3.max([this.m.dataIdx + this.m.data.length,
          this.m.csvData.length-1]);
    }
    console.log(this.m.csvData);

    for (dataIdxEnd;
      (direction === 1 && dataIdxEnd < this.m.csvData.length) ||
         (direction === -1 && dataIdxEnd > 0);
      dataIdxEnd+=direction) {
      const elem: any = this.m.csvData[dataIdxEnd];
      const bounds: number[] = [];

      // get the bounds to test against for this object
      keys.forEach((key) => {
        if (!elem.hasOwnProperty(key + '_num')) {
          elem[key + '_num'] = Date.parse(elem[key]);
        }
        bounds.push((this.m.scale * this.m.timeScale(elem[key + '_num'])));
      });

      // We can only increment dataIdx if the preceding elements have also
      // been moved off of the current screen area
      if (consecutive) {
        if (direction === 1 && this.outsideLeftBound(...bounds)) {
          dataIdxStart+=direction;
        } else if (direction === -1 && this.outsideRightBound(...bounds)) {
          dataIdxStart+=direction;
        } else {
          consecutive = false;
        }
      } else {
        consecutive = false;
      }

      // Check if this element is outside of the bound in which elements are
      // entering
      if (direction === 1 && this.outsideRightBound(...bounds)) {
        break;
      } else if (direction === -1 && this.outsideLeftBound(...bounds)) {
        break;
      }
    }

    console.log({dataIdxStart, dataIdxEnd});

    if (direction === 1) {
      dataIdxStart = dataIdxStart >= this.m.csvData.length ?
        this.m.csvData.length - 1 :
        dataIdxStart;

      dataIdxEnd = dataIdxEnd + this.m.barBuffer >= this.m.csvData.length ?
        this.m.csvData.length - 1 :
        dataIdxEnd + this.m.barBuffer;

      this.m.data = this.m.csvData.slice(dataIdxStart, dataIdxEnd);
      this.m.dataIdx = dataIdxStart;
    } else if (direction === -1) {
      dataIdxStart = dataIdxStart + this.m.barBuffer >= this.m.csvData.length ?
        this.m.csvData.length - 1 :
        dataIdxStart + this.m.barBuffer;

      dataIdxEnd = dataIdxEnd >= this.m.csvData.length ?
        this.m.csvData.length - 1 :
        dataIdxEnd;

      this.m.data = this.m.csvData.slice(dataIdxEnd, dataIdxStart);
      this.m.dataIdx = dataIdxEnd;
    }
  }

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translation string
   */
  abstract getTickTranslate(datum: any): string;

  /**
   * Purpose: Updates the position of the timeline elements
   * @param {any}  ttOver
   * @param {any}  ttMove
   * @param {any} ttLeave
   */
  updateBars(ttOver: any, ttMove: any, ttLeave: any): void {
    // @ts-ignore
    const ticks: [any] = [];
    // noinspection TypeScriptValidateJSTypes
    this.m.plot.selectAll('.bar')
        .data(this.m.data, function(d: any) {
          return d['index'];
        })
        .join((enter: any) =>
          this.draw(enter, ttOver, ttMove, ttLeave),
        (update: any) => update,
        (exit: any) => exit.remove()
        );

    // plot every 5th date
    this.m.data.forEach((d: any, i: number) => {
      if (((i + this.m.dataIdx) % 5) === 0) {
        ticks.push(d);
      }
    });

    // noinspection TypeScriptValidateJSTypes
    this.m.plot.selectAll('.xtick')
        .data(ticks, function(d: any) {
          return d['index'];
        })
        .join(
            (enter: any) => {
              const tick = enter.append('g')
                  .attr('class', 'xtick')
                  .attr('opacity', 1)
                  .attr('transform', (d: any) =>
                    this.getTickTranslate(d));

              tick.append('line')
                  .attr('stroke', 'blue')
                  .attr('y2', 6);

              tick.append('text')
                  .text((d: any) => d[this.m.xColumn])
                  .style('text-anchor', 'end')
                  .style('font-size', '1rem')
                  .attr('dx', '-.8em')
                  .attr('dy', '.15em')
                  .attr('transform', 'rotate(-90)');
            },
            (update: any) => update,
            (exit: { remove: () => void; }) => exit.remove()
        );
  }

  /**
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   */
  abstract checkYPrimType(primType: string): boolean;

  /**
   * Purpose: determines which columns are appropriate for the y axis
   * @param {string} primType: the primType to compare
   * @return {boolean}: a boolean indicating if the primType is appropriate
   * for the x axis
   *
   * @precondition: the primType accurately represents one of the columns from
   * the parsed csv.
   * @postcondition: true or false, based on whether or not the primType is a
   * date or number.
   */
  checkXPrimType(primType: string): boolean {
    return (primType === 'date' || primType === 'number');
  }

  /**
   * Purpose: updates the list of x and y axis columns to be relevant to the
   * type of timeline being drawn.
   */
  updateColumns(): void {
    const cols = this.m.columns;
    let yColumnSet = false;
    let xColumnSet = false;
    let xColumn2Set = false;
    this.m.yColumns = [];
    this.m.xColumns = [];

    // iterate through columns and set default values
    for (const col of cols) {
      // Plotting occurrence data isn't yet supported, so we are only
      // interested in plotting magnitude data for the y-axis
      if (this.checkYPrimType(col.primType)) {
        this.m.yColumns.push(col);
        if (!yColumnSet) {
          this.m.yColumn = col.key;
          yColumnSet = true;
        }
      }

      if (this.checkXPrimType(col.primType)) {
        this.m.xColumns.push(col);
        if (!xColumnSet) {
          this.m.xColumn = col.key;
          xColumnSet = true;
          // continue so the next if isn't evaluated on the same element
          continue;
        }
        // if xColumn has already been set, set xColumn2 to the next suitable
        // column
        if (xColumnSet && !xColumn2Set) {
          this.m.xColumn2 = col.key;
          xColumn2Set = true;
        }
      }
    }
  }

  /**
   * Purpose: constructor
   * @param {TimelineModel} newModel: the TimelineModel to pass into the
   * TimelineType object
   */
  constructor(newModel: TimelineModel) {
    this.m = newModel;
    this.updateColumns();
  }
}

