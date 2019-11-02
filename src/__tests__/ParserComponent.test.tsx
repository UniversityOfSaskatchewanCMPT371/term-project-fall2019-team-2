import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent, {CountTypes} from '../components/ParserComponent';
import ParserInterface, {FileType} from '../components/ParserInterface';
import {enumDrawType} from '../components/Column';

describe('<ParserComponent /> renders correctly', () => {
  const prompt = <label>test: </label>;
  const props = {
    prompt: 'test: ',
    onChange: jest.fn(),
  };

  it('renders a <ParserComponent /> to select a .csv', () => {
    const comp = shallow(
        <ParserComponent
          {...props}
          fileType={FileType.csv}
        />);

    expect(comp.contains(prompt)).toBeTruthy();
    expect(comp.exists('input')).toBeTruthy();
    expect(comp.find('input').prop('accept')).toContain('.csv,text/csv');
  });

  it('renders a <ParseComponent /> to select a .tl', () => {
    const comp = shallow(
        <ParserComponent
          {...props}
          fileType={FileType.tl}
        />);

    expect(comp.contains(prompt)).toBeTruthy();
    expect(comp.exists('input')).toBeTruthy();
    expect(comp.find('input').prop('accept')).toContain('.tl');
  });
});

describe('Csv FileEvents processed correctly', () => {
  const props = {
    prompt: 'test: ',
    fileType: FileType.csv,
  };

  it('Onchange event triggered when file selected', async () => {
    const onChangeMock = jest.fn();
    const testFile: File = new File(
        [''],
        'test.csv',
        {type: '.csv,text/csv'},);

    const event = {target: {files: [testFile]}};
    const comp = mount(
        <ParserComponent
          {...props}
          onChange={onChangeMock}
        />);

    comp.find('input').simulate('change', event);
    const fileUsed: File = onChangeMock.mock.calls[0][0];
    expect(fileUsed.name).toBe(testFile.name);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
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
    const pi: ParserInterface = {
      prompt: 'test',
      fileType: FileType.csv,
      onChange: jest.fn(),
    };
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
      const pi: ParserInterface = {
        prompt: 'test',
        fileType: FileType.csv,
        onChange: jest.fn(),
      };
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
