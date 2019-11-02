import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent, {CountTypes} from '../components/ParserComponent';
import ParserInterface, {FileType} from '../components/ParserInterface';
import {enumDrawType} from '../components/Column';
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
    it('test if when a csv is uploaded it works correctly', () => {
      const testFile: File = new File(
          [''],
          'test.csv',
          {type: '.csv,test/csv'},
      );
      // eslint-disable-next-line max-len
      const wrapper = mount(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.csv}/>);
      const instance = wrapper.instance() as ParserComponent;
      expect(instance.isValid(testFile)).toBeTruthy();
    });
    // eslint-disable-next-line max-len
    it('test if when a csv is uploaded it works correctly with name csv(csv.csv)', () => {
      const testFile: File = new File(
          [''],
          'csv.csv',
          {type: '.csv,test/csv'},
      );
      // eslint-disable-next-line max-len
      const wrapper = mount(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.csv}/>);
      const instance = wrapper.instance() as ParserComponent;
      expect(instance.isValid(testFile)).toBeTruthy();
    });
    it('test if when a non-csv is uploaded it works correctly', () => {
      const testFile: File = new File(
          [''],
          'test.pdf',
          {type: '.pdf,test/pdf'},
      );
      // eslint-disable-next-line max-len
      const wrapper = mount(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.csv}/>);
      const instance = wrapper.instance() as ParserComponent;
      expect(instance.isValid(testFile)).toEqual(false);
    });
    // eslint-disable-next-line max-len
    it('test if when a non-csv is uploaded it works correctly with name csv(csv.pdf)', () => {
      const testFile: File = new File(
          [''],
          'test.pdf',
          {type: '.pdf,test/pdf'},
      );
      // eslint-disable-next-line max-len
      const wrapper = mount(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.csv}/>);
      const instance = wrapper.instance() as ParserComponent;
      expect(instance.isValid(testFile)).toEqual(false);
    });
    it('test if it works when there is nothing', () => {
      const testFile: File = new File(
          [''],
          '',
          {type: ''},
      );
      // eslint-disable-next-line max-len
      const wrapper = mount(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.csv}/>);
      const instance = wrapper.instance() as ParserComponent;
      expect(instance.isValid(testFile)).toEqual(false);
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

  describe('createCountingObjects()', () => {
    const pi: ParserInterface = {prompt: 'test', fileType: FileType.csv};
    const pc = new ParserComponent(pi);
    it('instantiates a list of CountTypes', () => {
      const listObjects = pc.createTypeCountingObjects(4);
    });
  });

  describe('inferTypes()', () => {
    let pc: ParserComponent;
    let data: any[] | object[] |
      { money: string; heartAttacks: string; animals: number; }[];
    beforeEach(() => {
      const pi: ParserInterface = {prompt: 'test', fileType: FileType.csv};
      pc = new ParserComponent(pi);
      data = new Array(4);
      data[0] = {money: 100, heartAttacks: '2016-07-03', animals: 'dog'};
      data[1] = {money: 55, heartAttacks: '2019-02-02', animals: 'cat'};
      data[2] = {money: 300, heartAttacks: '2013-02-02', animals: 'horse'};
      data[3] = {money: 2, heartAttacks: '2013-03-02', animals: 'fish'};
      pc.state = {
        prompt: 'test',
        fileType: FileType.csv,
        data: data,
      };
    });

    it('handles regular data', () => {
      const t1 = pc.inferTypes(data);
      // test string
      expect(t1[2].drawType).toBe(enumDrawType.occurrence);
      // test number
      expect(t1[0].drawType).toBe(enumDrawType.any);
      // test date
      // expect(t1[1].drawType).toBe(enumDrawType.any);
    });
    it('handles inconsistent data', () => {
      data[0] = {money: 'word', heart_attacks: '2016-07-03', animals: 0};
      const t1 = pc.inferTypes(data);
      // test string
      expect(t1[2].drawType).toBe(enumDrawType.occurrence);
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

  describe('CountTypes constructor()', () => {
    it('constructor assigns variables', () => {
      const ct = new CountTypes();
      expect(ct.numNumber).toBe(0);
      expect(ct.numString).toBe(0);
      expect(ct.numDate).toBe(0);
      expect(ct.numIncongruent).toBe(0);
    });
  });

  describe('CountTypes.Largest', () => {
    it('largest returns largest value when equal values', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 11;
      ct.numString = 4;
      ct.numDate = 5;
      expect(ct.largest()).toBe('number');
    });

    it('largest works when val not explicitly set', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 3;
      ct.numString = 4;
      expect(ct.largest()).toBe('incongruent');
    });

    it('largest returns largest value when equal values', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 3;
      ct.numString = 4;
      ct.numDate = 5;
      expect(ct.largest()).toBe('date');
    });
  });
});
