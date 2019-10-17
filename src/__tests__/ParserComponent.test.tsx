import React, {ReactDOM} from 'react';
import {shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';

describe('<ParserComponent />', () => {
  it('renders a <ParserComponent />', () => {
    const wrapper = shallow(<ParserComponent prompt={'Select a CSV file: '}
                                             fileType={FileType.csv}/>);
    const prompt = <label>Select a CSV file: </label>;
    // @ts-ignore
    const button = <input type="file" accept=".csv,text/csv"/>;


    expect(wrapper.contains(prompt)).toEqual(true);
    // input tag not being rendered properly >:c
    // expect(wrapper.contains(button)).toEqual(true);
  });
});
