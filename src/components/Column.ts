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
}

/**
 * class that categorizes data to be drawn
 * occurence data is string
 * any is number, date and magnitude
 */
export enum enumDrawType {
  magnitude, occurrence, any
}
