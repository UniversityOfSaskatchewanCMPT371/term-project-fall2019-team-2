import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';

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
