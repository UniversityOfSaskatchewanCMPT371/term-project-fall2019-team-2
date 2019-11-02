import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';
import fs from 'fs';
// may need in the future, but currently not being used
// import sinon from 'sinon';


describe('<ParserComponent /> renders correctly', () => {
  const prompt = <label>test: </label>;

  it('renders a <ParserComponent /> to select a .csv', () => {
    const wrapper = shallow(
        <ParserComponent
          prompt={'test: '}
          fileType={FileType.csv}
          onChange={jest.fn()}
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
          onChange={jest.fn}
        />);

    console.log(wrapper.debug());

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
    expect(wrapper.find('input').prop('accept')).toContain('.tl');
  });
});

describe('FileEvents processed correctly', () => {
  it('file input event calls onChange with selected file', async () => {
    // todo: pray for me
    const onChangeMock = jest.fn((x: File) => x.name);
    const testFile: File = new File(
        ['asafsa'],
        'test.csv',
        {type: '.csv,text/csv'},);


    const props = {
      prompt: 'test: ',
      fileType: FileType.csv,
    };
    const event = {target: {files: [testFile]}};
    const comp = mount(
        <ParserComponent
          {...props}
          onChange={onChangeMock}
        />);

    comp.find('input').simulate('change', event);
    expect(onChangeMock).toHaveReturnedWith(testFile.name);
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
