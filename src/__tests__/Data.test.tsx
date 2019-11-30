import React, {ReactDOM} from 'react';
import {shallow} from 'enzyme';
import Data from '../components/Data';
import Column from '../components/Column';

describe('<Data /> Unit Tests', () => {
  describe('constructor should assign variables', () => {
    let dataObj: Data;
    const path: string = 'some/path/to/data';
    const dataArr: Array<object> = [
      {
        'test': 'foo',
        'num': 1
      },
      {
        'test': 'bar',
        'num': 2
      },
      {
        'test': 'boo',
        'num': 3
      }
    ];
    const colArr: Array<Column> = [
      new Column('string', 1, 'test'),
      new Column('number', 2, 'num')
    ];

    beforeEach(() => {
      dataObj = new Data(path, dataArr, colArr);
    });

    it('constructor()', () => {
      expect(dataObj.columns).toBe(colArr);
      expect(dataObj.arrayOfData).toBe(dataArr);
      expect(dataObj.pathToData).toBe(path);
    });
  });
});
