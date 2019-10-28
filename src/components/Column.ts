/**
 * The class responsible for a single column of data within a timeline.
 */
export default class Column {
    public yScale: number;
    public definedDrawList: Array<() => void>;

    /**
     * Purpose: Column constructor
     * @param {number} yScale: the initial y-scale
     * @param {Array} definedDrawList: the initial list of drawing predicates
     * functions for the column
     */
    public constructor(yScale: number, definedDrawList: Array<() => void>) {
      this.yScale = yScale;
      this.definedDrawList = definedDrawList;
    }

    /**
     * Purpose: renders a column of data to the timeline
     * @constructor
     */
    public Show(): void {
    }

    /**
     * Purpose: causes the column to be rendered at a new scale
     * @param {number} newScale: a float which is the new scaling factor
     * @constructor
     */
    public Rescale(newScale: number): void {
    }
}

/**
 * class that categorizes data to be drawn
 * occurence data is string
 * any is number and magnitude
 */
export enum enumDrawType {
  magnitude, occurrence, any,
}
