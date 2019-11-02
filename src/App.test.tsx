import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import App from './App';

// use describe blocks to group together related tests
describe('smoke test', () => {
  it('renders without crashing', () => {
    shallow(<App/>);
  });
});
