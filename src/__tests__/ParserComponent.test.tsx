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
    const comp = shallow(<ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv}/>);
    expect(comp.getElements()).toMatchSnapshot();
  });
});

describe('Events processed correctly', () => {
  // work in progress :c
  it('responds to file selection', () => {
    // eslint-disable-next-line max-len
    // const parseMock = jest.fn();
    const testfile = new File(['data to upload'], 'empty.csv');
    const event = {
      preventDefault() {},
      target: {files: [testfile]},
    };
    // @ts-ignore
    // eslint-disable-next-line max-len
    const wrapper = mount(<ParserComponent prompt="Select a CSV file: " fileType={FileType.csv}/>);

    // console.log('before: ' + wrapper.debug());
    // wrapper.find('input').simulate('change', event);
    // expect(parseMock).toBeCalledWith(testfile);
  });
});


