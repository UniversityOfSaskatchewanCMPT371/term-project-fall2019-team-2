import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ParserComponent from './components/ParserComponent';
import {enumDrawType} from './components/Column';
import ParserInterface, {FileType} from './components/ParserInterface';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

// test infertypes
test('<infertype>', () => {
  const pi: ParserInterface = {prompt: 'test', fileType: FileType.csv};
  const tester = new Array(2);
  tester[0] = {
    str: '123',
    num: undefined,
    time: Date(),
    // object: {test: 'test'},
  };
  tester[1] = {
    str: 'asd',
    num: 345,
    time: Date(),
    // object: {test: 'test'},
  };
  const pc = new ParserComponent(pi);
  const t1 = pc.inferTypes(tester);
  expect(t1[0].drawType).toBe(enumDrawType.occurrence);
  // expect(t1[1].drawType).toBe(enumDrawType.any);
});

