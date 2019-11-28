import {strict as assert} from 'assert';
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
   * @precondition The predicate name is set
   * @postcondition The predicate name is returned
   * @return {string} The name of the predicate function
   */
  public getName(): string {
    assert.notStrictEqual(this.name, undefined);
    return this.name;
  }

  /**
   * Evaluate the predicate function
   * @precondition The predicate is defined, and the object
   * being passed in is the correct type
   * @postcondition The predicate is evaluated with the passed in object
   * and true or false returned depending on whether or not the predicate
   * holds for that object
   * @param  {Object} point The data point to evaluate
   * @return {boolean} The result of the function evaluated
   */
  public evaluate(point: Object): boolean {
    // point object should be defined
    assert.notStrictEqual(point, null);
    assert.notStrictEqual(point, undefined);
    return this.func(point);
  }
}
