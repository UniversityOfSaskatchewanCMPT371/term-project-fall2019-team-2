/**
 * The class responsible for a single column of data within a timeline.
 */
export default class Column {
    public yScale: number;
    public key: string;
    public drawType: enumDrawType;
    public primType: string;

    /**
     * Purpose: Column constructor
     * @param {number} yScale: the initial y-scale
     * @param {Array} definedDrawList: the initial list of drawing predicates
     * functions for the column
     */
    // eslint-disable-next-line max-len
    public constructor(primType: string, drawType: enumDrawType, key: string, yScale: number) {
      this.drawType = drawType;
      this.yScale = yScale;
      this.key = key;
      this.primType = primType;
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

enum enumDrawType {
    magnitude, occurance, any,
}
