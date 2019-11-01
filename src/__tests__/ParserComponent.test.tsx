import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';
// may need in the future, but currently not being used
// import sinon from 'sinon';


describe('<ParserComponent /> renders correctly', () => {
  describe('renders a <ParserComponent /> to select a .csv', () => {
    // eslint-disable-next-line max-len
    const wrapper = shallow(<ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv}/>);
    const prompt = <label>Select a CSV file: </label>;
    const button = <input type="file" accept=".csv,text/csv"/>;


    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
  });

  describe('renders a <ParseComponent /> to select a .tl', () => {
    // eslint-disable-next-line max-len
    const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
    const prompt = <label>Select a TL file: </label>;
    const button = <input type='file' accept='.tl' ></input>;

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
  });
});

describe('FileEvents processed correctly', () => {
  describe('responds to file selection', () => {
    const fileUploaderMock = jest.fn();
    const prompt = 'Select a CSV file:';
    const fileType = FileType.csv;

    const comp = shallow(
        <ParserComponent
          prompt={prompt}
          fileType={fileType}
        />
    );

    const file = {
      name: 'test.csv',
      type: 'text/csv',
    } as File;

    const event = {
      target: {files: null},
    };

    // console.log('before: ' + wrapper.debug());
    // comp.find('input').simulate('change', event);
    // wrapper.find('input').simulate('change', event);
    // expect(parseMock).toBeCalledWith(testfile);
  });
});

// To be used by the developers
describe('<ParserComponent /> Unit Tests', () => {
  describe('constructor()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('componentDidMount()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('isValid()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('sortData()', () => {
    it('checks if data is sorted', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': '4/5/2010'},
        {'id': 2, 'name': 'name2', 'Date': '4/5/1992'},
        {'id': 3, 'name': 'name3', 'Date': '12/21/1992'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '4/5/1992'},
        {'id': 3, 'name': 'name3', 'Date': '12/21/1992'},
        {'id': 1, 'name': 'name1', 'Date': '4/5/2010'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
    });

    // eslint-disable-next-line max-len
    it('checks if data is sorted by the first date column when there are 2 date columns', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, Date: string, Date1: string}[] = [
        {'id': 1, 'Date': '1/1/2001', 'Date1': '4/5/2010'},
        {'id': 2, 'Date': '1/1/2003', 'Date1': '4/5/1992'},
        {'id': 3, 'Date': '1/1/2000', 'Date1': '12/21/1992'},
        {'id': 4, 'Date': '1/1/2002', 'Date1': '12/21/1993'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, Date: string, Date1: string}[] = [
        {'id': 3, 'Date': '1/1/2000', 'Date1': '12/21/1992'},
        {'id': 1, 'Date': '1/1/2001', 'Date1': '4/5/2010'},
        {'id': 4, 'Date': '1/1/2002', 'Date1': '12/21/1993'},
        {'id': 2, 'Date': '1/1/2003', 'Date1': '4/5/1992'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works when there are no dates', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, job: string}[] = [
        {'id': 1, 'name': 'name1', 'job': 'job1'},
        {'id': 2, 'name': 'name2', 'job': 'job2'},
        {'id': 3, 'name': 'name3', 'job': 'job3'},
        {'id': 4, 'name': 'name4', 'job': 'job4'}];
      expect(instance.sortData(testArray)).toEqual(false);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works on data with dates like november 12, 2019', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'November 23, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 1, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': 'January 1, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'November 23, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31, 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works on data with dates like november 12 2019', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'November 23 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 1 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5 2019'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': 'January 1 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'November 23 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works on data with dates like 12 november 2019', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': '23 november 2019'},
        {'id': 2, 'name': 'name2', 'Date': '1 january 2019'},
        {'id': 3, 'name': 'name3', 'Date': '31 december 2019'},
        {'id': 4, 'name': 'name4', 'Date': '5 february 2019'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '1 january 2019'},
        {'id': 4, 'name': 'name4', 'Date': '5 february 2019'},
        {'id': 1, 'name': 'name1', 'Date': '23 november 2019'},
        {'id': 3, 'name': 'name3', 'Date': '31 december 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works on data with dates D/M (assumes they are same year)', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': '11/23'},
        {'id': 2, 'name': 'name2', 'Date': '1/1'},
        {'id': 4, 'name': 'name4', 'Date': '2/5'},
        {'id': 3, 'name': 'name3', 'Date': '12/31'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '1/1'},
        {'id': 4, 'name': 'name4', 'Date': '2/5'},
        {'id': 1, 'name': 'name1', 'Date': '11/23'},
        {'id': 3, 'name': 'name3', 'Date': '12/31'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    // eslint-disable-next-line max-len
    it('checks if sort works on data where dates are invalid January 32, 2019 by moving it to the end', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 3, 'name': 'name3', 'Date': 'January 15, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'January 1, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 32, 2019'}];
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'January 1, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'January 15, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 32, 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });
  });

  describe('inferTypes()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('parse()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('parseCsv()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });
});
