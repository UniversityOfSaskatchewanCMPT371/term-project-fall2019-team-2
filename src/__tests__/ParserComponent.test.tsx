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
  it('file input event calls onChange and passes in correct file', async () => {
    // todo: pray for me
    const onChangeMock = jest.fn();
    const testFile: File = new File(
        [''],
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

    console.log('state' + comp.state());
    console.log('debug' + comp.debug());
    console.log(comp.find('input').prop('onChange'));
    console.log(comp.props());
    comp.find('input').simulate('change', event);
    console.log(comp.debug());

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(testFile);
    console.log(comp.state());
  });
});

describe('Passing CSV files with no heads on the first row', ()=>{
  it('should thrown an error if no headers', ()=>{
    const onChangeMock = jest.fn();
    const testFile= fs.readFileSync('.\\src\\__tests__\\testfiles' +
      '\\noHeader.csv', 'utf8');
    console.log(testFile.substring(0, 140));
    // todo : let class read the file and check if it throw errors
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
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(testFile);
    expect(comp).toThrow('header');
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
