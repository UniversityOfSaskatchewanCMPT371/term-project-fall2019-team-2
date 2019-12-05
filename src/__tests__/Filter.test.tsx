import React, {ReactDOM} from 'react';
import {shallow} from 'enzyme';
import Filter from '../components/Filter';

describe('<Filter /> Unit Tests', () => {
  describe('constructor()', () => {
    let filterObj: Filter;
    const lowerRange: number = 1;
    const upperRange: number = 5;
    const isShown: boolean = true;
    const listOfPreds: Array<(...args: any[]) => boolean> =
        [() => true];


    beforeEach(() => {
      filterObj = new Filter(lowerRange, upperRange, isShown, listOfPreds);
    });

    it('constructor should assigns variables', () => {
      expect(filterObj.lowerRange).toBe(lowerRange);
      expect(filterObj.upperRange).toBe(upperRange);
      expect(filterObj.isShown).toBeTruthy();
      expect(filterObj.listOfPreds).toBe(listOfPreds);
    });
  });
});
