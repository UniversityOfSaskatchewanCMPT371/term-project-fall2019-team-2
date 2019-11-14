/**
 * Purpose: the class responsible for storing the information about which data
 * is drawn.  By default it stores only information about the range that the
 * data is drawn in.  Optionally, it also filters the data by predicates,
 * allowing the user to define things like “only data less than 5” or something
 * similar.
 */
export default class Filter {
  public lowerRange: number;
  public upperRange: number;
  public isShown: boolean;
  public listOfPreds: Array<() => boolean>;

  /**
   * Purpose: Filter constructor
   * @param {number} lowerRange: the lower range for the data to filter
   * @param {number} upperRange: the upper range for the data to filter
   * @param {boolean} isShown: a boolean to indicate whether or not to show
   * this filter
   * @param {Array} listOfPreds: an array of predicate to apply to the data
   */
  public constructor(lowerRange: number,
      upperRange: number,
      isShown: boolean,
      listOfPreds: Array<(...args: any[]) => boolean>) {
    this.lowerRange = lowerRange;
    this.upperRange = upperRange;
    this.isShown = isShown;
    this.listOfPreds = listOfPreds;
  }

  /**
   * Purpose: assigns the lower and upper range to the values passed in
   * @precondition None
   * @postcondition The filter objects values are adjusted
   * @param {number} newLowerRange: the new lower range
   * @param {number} newUpperRange: the new upper range
   */
  public redefineRange(newLowerRange: number, newUpperRange: number) {
    this.lowerRange = newLowerRange;
    this.upperRange = newUpperRange;
  }

  /**
   * Purpose: adds a new predicate to the list
   * @precondition None
   * @postcondition The predicate is added to the list of
   * predicates and this is immediately applied to the current render
   * @param {boolean} predicate: the predicate to add to the list
   */
  public addPredicate(predicate: () => boolean) {
    this.listOfPreds.push(predicate);
  }

  /**
   * Purpose: removes the predicate at the specified index
   * @precondition The predicate list is non-empty
   * @postcondition The specified predicate is removed from the list. 
   * If no such predicate exists nothing is removed.
   * @param {number} index: the index of the predicate to remove
   */
  public removePredicate(index: number) {
    this.listOfPreds.splice(index, 1);
  }
}
