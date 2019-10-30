
import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import {FileType} from '../components/ParserInterface';

describe('File type is uploaded correctly', () => {
  describe('file input', () => {
    const fileUploader = jest.fn();
    const prompt = 'Select csv file:';
    const fileType = FileType.csv;

    const comp = mount(
        <ParserComponent
          prompt={prompt}
          fileType={fileType}
        />
    );
    it('File csv', (fileType) => {
      fileType(true);
      expect({fileType});
    }
    );
    const event = {
      target: {files: fileType}
    };
  });
});

