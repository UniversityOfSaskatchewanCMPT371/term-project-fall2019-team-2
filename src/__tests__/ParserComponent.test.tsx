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
      const result = instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '4/5/1992'},
        {'id': 3, 'name': 'name3', 'Date': '12/21/1992'},
        {'id': 1, 'name': 'name1', 'Date': '4/5/2010'}];
      expect(result[0]).toMatchObject(expectedResult[0]);
      expect(result[1]).toMatchObject(expectedResult[1]);
      expect(result[2]).toMatchObject(expectedResult[2]);
    });

    it('checks if data contains date', () => {
      // eslint-disable-next-line max-len
      const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
      const instance = wrapper.instance() as ParserComponent;
      const testArray: {id: number, name: string}[] = [
        {'id': 1, 'name': 'name1'},
        {'id': 2, 'name': 'name2'},
        {'id': 3, 'name': 'name3'}];
      expect(instance.sortData(testArray)).toThrow('No date field');
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
