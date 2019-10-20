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
     * @param {string} primType: the type of the data
     * @param {enumDrawType} drawType: the type in the form of enum
     * @param {string} key: the key value
     * @param {number} yScale: the initial y-scale
     */
    public constructor(primType: string, drawType: enumDrawType,
        key: string, yScale: number = 1) {
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

export enum enumDrawType {
    magnitude, occurrence, any,
}
