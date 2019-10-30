import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';
import * as d3 from 'd3';
// may need in the future, but currently not being used
// import sinon from 'sinon';


describe('<ParserComponent /> renders correctly', () => {
  const prompt = <label>test: </label>;

  it('renders a <ParserComponent /> to select a .csv', () => {
    const wrapper = shallow(
        <ParserComponent
          prompt={'test: '}
          fileType={FileType.csv}
        />);

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
    expect(wrapper.find('input').prop('accept')).toContain('.csv,text/csv');
  });

  it('renders a <ParseComponent /> to select a .tl', () => {
    const wrapper = shallow(
        <ParserComponent
          prompt={'test: '}
          fileType={FileType.tl}
        />);

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
    expect(wrapper.find('input').prop('accept')).toContain('.tl');
  });
});

describe('FileEvents processed correctly', () => {
  it('responds to file selection', () => {
    // todo: pray for me
    const onChangeMock = jest.fn();
    const props = {
      prompt: 'test: ',
      fileType: FileType.csv,
      onChange: onChangeMock,
    };

    // todo: figure out if I can just use a normal csv file
    const testFile: File = new File(
        [''],
        'multiDateTest.csv',
        {type: '.csv,text/csv'});

    const event = {target: {file: {testFile}}};
    const comp = mount(
        <ParserComponent
          {...props}
        />);

    console.log(comp.state());
    comp.find('input').simulate('change', event);

    /* todo: figure out a way to figure out if onchange has been called :/
     * I think it's not working because it's bound to parse() in
     * ParserComponent.tsx */
    expect(onChangeMock).toBeCalledTimes(1);
    // expect(onChangeMock).toHaveBeenCalledWith(testFile);
    console.log(comp.state());
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
