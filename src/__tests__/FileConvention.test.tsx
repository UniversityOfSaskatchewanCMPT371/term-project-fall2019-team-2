
import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';
describe('FileEvents processed correctly', () => {
  describe('responds to file selection', () => {
    const fileUploaderMock = jest.fn();
    const prompt = 'Select a CSV file:';
    const fileType = FileType.csv;


    const comp = shallow(
        <ParserComponent
          prompt={prompt}
          fileType={fileType}
        />
    );

    // const file = {
    // name: 'test.csv',
    // type: 'text/csv',
    // } as File;

    const event = {
      target: {files: null},
      /*
     );
     it('File csv', (fileType) => {
       fileType(true);
       expect({fileType});
       }
     );
     const event = {
       target: {files: fileType}

     */

    };
  });
});
describe('isValid()', () => {
  it('dummy test', () => {

  });
});
