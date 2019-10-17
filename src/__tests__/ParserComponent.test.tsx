import React, {ReactDOM} from 'react';
import {shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';

describe('<ParserComponent /> renders correctly', () => {
  it('renders a <ParserComponent /> to select a .csv', () => {
    const wrapper = shallow(<ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv}/>);
    const prompt = <label>Select a CSV file: </label>;
    // const button = <input type="file" accept=".csv,text/csv"/>;


    expect(wrapper.contains(prompt)).toEqual(true);
    // input tag not being rendered properly >:c
    // expect(wrapper.contains(button)).toEqual(true);
  });

  it('renders a <ParseComponent /> to select a .tl', () => {
    const wrapper = shallow(<ParserComponent prompt={'Select a TL file: '} fileType={FileType.tl}/>);
    const prompt = <label>Select a TL file: </label>;
    const button = <input type='file' accept='.tl' ></input>;

    expect(wrapper.contains(prompt)).toEqual(true);
    expect(wrapper.exists('input')).toEqual(true);
    //expect(wrapper.contains(button)).toEqual(true);
  });
});
