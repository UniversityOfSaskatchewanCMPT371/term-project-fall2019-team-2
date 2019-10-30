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
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('sortData()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
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
    const pi: ParserInterface = {prompt: 'test', fileType: FileType.csv};
    const pc = new ParserComponent(pi);
    // eslint-disable-next-line no-array-constructor
    const data = new Array(2);
    data[0] = {money: 100, heart_attacks: '2016-07-03', animals: 'dog'};
    data[1] = {money: 55, heart_attacks: '2019-02-02', animals: 'cat'};
    it('handles regular data', () => {
      pc.state = { // need to run tests
        prompt: 'test',
        fileType: FileType.csv,
        data: data,
      };
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
      data[2] = {money: 300, heart_attacks: '2013-02-02', animals: 'horse'};
      data[3] = {money: 2, heart_attacks: '2013-02-02', animals: 'horse'};
      pc.state = { // need to run tests
        prompt: 'test',
        fileType: FileType.csv,
        data: data,
      };
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
