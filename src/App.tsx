import React from 'react';
import logo from './logo.svg';
import './App.css';
import ParserComponent from './components/ParserComponent';
import {FileType} from './components/ParserInterface';
import TimelineComponent from './components/TimelineComponent';
import Data from './components/Data';

const App: React.FC = () => {
  return (
    <div className="App">
      <ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv} />
     {/*<TimelineComponent data={new Data('path/to/file', [{}])} />*/}
    </div>
  );
};

export default App;
