import React, {ReactDOM} from 'react';
import {shallow} from 'enzyme';
import Filter from '../components/Filter';

describe('<Filter /> renders successfully in base cases based' +
  ' on inputs and outputs', () => {
  it('testing constructor', ()=>{
    const lowerRange=0;
    const upperRange=10;
    const isShown=true;

    const t = (a: number, b: number) => {
      return (a < b);
    };

    // eslint-disable-next-line no-array-constructor
    const listOfPreds = new Array<(...args:any[]) => boolean>();
    listOfPreds.push(t);
    const testFilter = new Filter(lowerRange, upperRange, isShown, listOfPreds);

    expect(testFilter.lowerRange).toBe(lowerRange);
    expect(testFilter.upperRange).toBe(upperRange);
    expect(testFilter.isShown).toBe(isShown);
    expect(testFilter.listOfPreds).toBe(listOfPreds);
  });

  it('testing redefineRange()', ()=>{
    const lowerRange=0;
    const upperRange=10;
    const isShown=true;

    const t = (a: number, b: number) => {
      return (a < b);
    };

    // eslint-disable-next-line no-array-constructor
    const listOfPreds = new Array<(...args:any[]) => boolean>();
    listOfPreds.push(t);
    const testFilter = new Filter(lowerRange, upperRange, isShown, listOfPreds);
    const newLowerRange=1;
    const newUpperRange=12;
    testFilter.redefineRange(newLowerRange, newUpperRange);
    expect(testFilter.lowerRange).toBe(newLowerRange);
    expect(testFilter.upperRange).toBe(newUpperRange);
  });

  it('testing addPredicate()', ()=>{
    const lowerRange=0;
    const upperRange=10;
    const isShown=true;

    const t = (a: number, b: number) => {
      return (a < b);
    };

    // eslint-disable-next-line no-array-constructor
    const listOfPreds = new Array<(...args:any[]) => boolean>();
    listOfPreds.push(t);
    const testFilter = new Filter(lowerRange, upperRange, isShown, listOfPreds);

    const testPredicate = ()=>{};
    testFilter.addPredicate(testPredicate());
    expect(testFilter.listOfPreds).toContain(testPredicate());
  });

  it('test removePredicate()', ()=>{
    const lowerRange=0;
    const upperRange=10;
    const isShown=true;

    const t = (a: number, b: number) => {
      return (a < b);
    };

    // eslint-disable-next-line no-array-constructor
    const listOfPreds = new Array<(...args:any[]) => boolean>();
    listOfPreds.push(t);
    const testFilter = new Filter(lowerRange, upperRange, isShown, listOfPreds);
    const testPredicate = ()=>{};
    // todo: add mock functions to add predicate and test removePredicate()

    testFilter.removePredicate(testPredicate());
  });
});
