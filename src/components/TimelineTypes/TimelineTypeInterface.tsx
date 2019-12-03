import TimelineModel from '../TimelineModel';
import {ViewType} from '../TimelineComponent';


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
   * Purpose: updates the range of elements currently being rendered on the
   * timeline
   *
   * @preconditions: the timeline component has correctly mounted and has a
   * non-empty set of data
   *
   * @postconditions: the array of data to be rendered is updated to accurately
   * reflect the information from the timeline
   */
  abstract getData(): void;

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
        ticks.push({
          id: d['index'],
          index: i,
          text: d[this.m.xColumn],
        });
      }
    });

    // noinspection TypeScriptValidateJSTypes
    this.m.plot.selectAll('.xtick')
        .data(ticks, function(d: any) {
          return d.id;
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
                  .text((d: any) => d.text)
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
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
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

