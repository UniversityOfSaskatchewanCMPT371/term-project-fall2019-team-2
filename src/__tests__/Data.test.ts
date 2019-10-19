import Data from '../components/Data';
import Filter from '../components/Filter';

// eslint-disable-next-line max-len
it('testing Data class\'s constructor with expected input and expected output', ()=>{
  const testString = 'testcase';
  const testArray = [{number: 1}, {number: 2}, {number: 3}];
  const t = (a: number, b: number) => {
    return (a < b);
  };

  // eslint-disable-next-line no-array-constructor
  const arr = new Array<(...args: any[]) => boolean>();
  arr.push(t);
  const fil = new Filter(1, 2, true, arr);
  console.log(fil);
  const classInstance = new Data(testString, testArray, fil);
  expect(classInstance.pathToData).toBe(testString);
  expect(classInstance.arrayOfData).toBe(testArray);
  expect(classInstance.filter).toBe(fil);
});

it('testing getData\'s expected type of output', ()=>{
  const testString = 'testcase';
  const testArray = [{number: 1}, {number: 2}, {number: 3}];
  const t = (a: number, b: number) => {
    return (a < b);
  };

  // eslint-disable-next-line no-array-constructor
  const arr = new Array<(...args: any[]) => boolean>();
  arr.push(t);
  const fil = new Filter(1, 2, true, arr);
  const classInstance = new Data(testString, testArray, fil);

  expect(classInstance.getData()).toBe(arr);
});

it('test setData() changes to the data object', ()=>{
  const testString = 'testcase';
  const testArray = [{number: 1}, {number: 2}, {number: 3}];
  const t = (a: number, b: number) => {
    return (a < b);
  };

  // eslint-disable-next-line no-array-constructor
  const arr = new Array<(...args: any[]) => boolean>();
  arr.push(t);
  const fil = new Filter(1, 1, true, arr);
  const classInstance = new Data(testString, testArray, fil);
  // a replace array to the constructor
  const testReplaceArray = [{number: 4}, {number: 5}, {number: 6}];
  classInstance.setData(testReplaceArray);
  expect(classInstance.arrayOfData).toBe(testReplaceArray);
});


it('test getFilter() expected output match the input', ()=>{
  const testString = 'testcase';
  const testArray = [{number: 1}, {number: 2}, {number: 3}];
  const t = (a: number, b: number) => {
    return (a < b);
  };

  // eslint-disable-next-line no-array-constructor
  const arr = new Array<(...args: any[]) => boolean>();
  arr.push(t);
  const fil = new Filter(1, 2, true, arr);
  const classInstance = new Data(testString, testArray, fil);
  expect(classInstance.getFilter()).toBe(fil);
});

// todo
it('test setPath() expected output', ()=>{

});
// todo
it('test getPath() expected output', ()=>{

});
