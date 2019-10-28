import Predicate from '../components/Predicate';

/**
 * Predicate Unit Tests, refer to the test matrix.
 */
describe('Predicate Unit Tests', () => {
  let predicate: Predicate;

  /**
   * Creates a predicate object for test cases
   */
  beforeEach(() => {
    predicate = new Predicate('my func', (para) => {
      return para;
    });
  });

  /**
   * Ensure the constructor assigns the name variable
   */
  it('constructor assigns vars()', () => {
    expect(predicate.getName()).toBe('my func');
    // func is tested in later cases
  });

  /**
   * Evaluate that the predicate function will return falsey values
   */
  it('evaluate returns false', () => {
    expect(predicate.evaluate(false)).toBeFalsy();
  });

  /**
   * Evaluate that the predicate function will return truthy values
   */
  it('evaluate returns true', () => {
    expect(predicate.evaluate(true)).toBeTruthy();
  });
});
