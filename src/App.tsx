import React from 'react';
import './App.css';
import ParserComponent from './components/ParserComponent';
import {FileType} from './components/ParserInterface';

const App: React.FC = () => {
  return (
    <div className="App">
      <ParserComponent
        prompt={'Select a CSV file: '}
        fileType={FileType.csv}
        onChange={function() {}}
      />
      {/* <TimelineComponent data={new Data('path/to/file', [{}])} />*/}
    </div>
  );
};

export default App;
