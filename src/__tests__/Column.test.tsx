import React
  from 'react';
import Column, {enumDrawType} from '../components/Column';

describe('<Column /> Unit Tests', () => {
  let columnString: Column;
  let columnNum: Column;
  /**
   * Creates a column object for test cases
   */
  beforeEach(() => {
    // eslint-disable-next-line max-len
    columnString = new Column('string', enumDrawType.occurrence, 'heart attacks');
    columnNum = new Column('number', enumDrawType.any, 'sandwiches');
  });

  describe('constructor()', () => {
    it('Constructor assigns variables', () => {
      // tests for string data
      expect(columnString.primType).toBe('string');
      expect(columnString.drawType).toBe(enumDrawType.occurrence);
      expect(columnString.key).toBe('heart attacks');
      // tests for numeric data
      expect(columnNum.primType).toBe('number');
      expect(columnNum.drawType).toBe(enumDrawType.any);
      expect(columnNum.key).toBe('sandwiches');
    });
  });
});

describe('show()', () => {
  it('dummy test', () => {
    // todo: devs need to write unit tests
  });
});

describe('rescale()', () => {
  it('dummy test', () => {
    // todo: devs need to write unit tests
  });
});
