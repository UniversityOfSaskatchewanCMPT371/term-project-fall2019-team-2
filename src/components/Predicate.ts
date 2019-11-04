/**
 * Predicate class which stores metadata about a predicate function
 * and evaluates that function.
 */
export default class Predicate {
  private readonly name: string;
  private readonly func: (para: any) => boolean;

  /**
   * The predicate class is able to hold metadata about a function
   * @param  {string} name The name of the predicate function
   * @param  {function} func The function which maps a parameter
   * (object) which is a datapoint, to a boolean True if it should be
   * displayed, False otherwise.
   */
  constructor(name: string, func: (para: any) => boolean) {
    this.name = name;
    this.func = func;
  }

  /**
   * Get the name of the predicate function
   * @return {string} The name of the predicate function
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Evaluate the predicate function
   * @param  {Object} point The data point to evaluate
   * @return {boolean} The result of the function evaluated
   */
  public evaluate(point: Object): boolean {
    return this.func(point);
  }
}
