import React from 'react';
import {shallow} from 'enzyme';
import App from './App';

// use describe blocks to group together related tests
describe('smoke test', () => {
  it('renders without crashing', () => {
    shallow(<App/>);
  });
});

