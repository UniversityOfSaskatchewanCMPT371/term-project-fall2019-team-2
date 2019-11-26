import TimelineModel from '../TimelineModel';


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
   * Purpose: applies
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
   *
   * @param {any}  svg
   */
  abstract drawLabels(svg: any): void;

  /**
   * Purpose
   */
  abstract getData(): void;

  /**
   * Purpose: gets the translation for an x-axis tick
   * @param {any} datum: the datum to draw the x-axis tick for
   * @return {string}: the translation string
   */
  abstract getTickTranslate(datum: any): string;

  /**
   * Purose
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
   * Purpose: constructor
   * @param {TimelineModel} newModel: the TimelineModel to pass into the
   * TimelineType object
   */
  constructor(newModel: TimelineModel) {
    this.m = newModel;
  }
}

// class EventOccurrence
// class IntervalOccurrence
