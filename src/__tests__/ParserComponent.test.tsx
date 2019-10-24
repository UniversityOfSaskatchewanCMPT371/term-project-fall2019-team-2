import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';
import sinon from 'sinon';


describe('<ParserComponent /> renders correctly', () => {
  it('renders a <ParserComponent /> to select a .csv', () => {
    // eslint-disable-next-line max-len
    const wrapper = shallow(<ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv}/>);
    const prompt = <label>Select a CSV file: </label>;
    const button = <input type="file" accept=".csv,text/csv"/>;


    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
  });

  it('renders a <ParseComponent /> to select a .tl', () => {
    // eslint-disable-next-line max-len
    const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
    const prompt = <label>Select a TL file: </label>;
    const button = <input type='file' accept='.tl' ></input>;

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
  });

  it('csv input snapshot', () => {
    // eslint-disable-next-line max-len
    const comp = shallow(
        <ParserComponent
          prompt={'Select a CSV file: '}
          fileType={FileType.csv}
        />
    );
    expect(comp.getElements()).toMatchSnapshot();
  });
});

describe('FileEvents processed correctly', () => {
  it('responds to file selection', () => {
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

describe('<ParserComponent /> Unit Tests', () => {
  it('constructor()', () => {

  });

  it('componentDidMount()', () => {

  });

  it('render()', () => {

  });

  it('isValid()', () => {

  });

  it('sortData()', () => {

  });

  it('inferTypes()', () => {

  });

  it('parse()', () => {

  });

  it('parseCsv()', () => {

  });
});
