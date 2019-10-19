import React from 'react';
import logo from './logo.svg';
import './App.css';
import ParserComponent from './components/ParserComponent';
import {FileType} from './components/ParserInterface';
import TimelineComponent from "./components/TimelineComponent";
import Data from "./components/Data";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <ParserComponent prompt={'Select a CSV file: '} fileType={FileType.csv} />
      <TimelineComponent data={new Data('path/to/file', [{}])} />
    </div>
  );
};

export default App;
