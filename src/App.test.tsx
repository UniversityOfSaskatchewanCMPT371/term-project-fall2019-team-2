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
// test('<infertype>', () => {
//   const pi: ParserInterface = {prompt: 'test', fileType: FileType.csv};
//   const tester = new Array(3);
//   tester[0] = {
//     str: '123',
//     num: 56,
//     time: Date(),
//   };
//   tester[1] = {
//     str: 'word',
//     num: 345,
//     time: Date(),
//   };
//   tester[2] = {
//     str: 'withspaces',
//     num: 345,
//     time: Date(),
//   };
//   // tests the standard inputs
//   const pc = new ParserComponent(pi);
//   const t1 = pc.inferTypes(tester);
//   // test string
//   expect(t1[0].drawType).toBe(enumDrawType.occurrence);
//   // test number
//   expect(t1[1].drawType).toBe(enumDrawType.any);
//   // test date
//   expect(t1[2].drawType).toBe(enumDrawType.occurrence);
//
//   // tests that are designed to crash
//   const di: ParserInterface = {prompt: 'test', fileType: FileType.csv};
//   const breaker = new Array(1);
//   breaker[0] = {
//     str: undefined,
//     num: 56,
//     time: Date(),
//   };
//   const parser2 = new ParserComponent(di);
//   try {
//     parser2.inferTypes(breaker);
//     throw new Error('infertypes should not handle undefined');
//   } catch (error) {
//     console.log(error);
//   }
// });

