import React from 'react';
import './App.css';
import ParserComponent from './components/ParserComponent';
import {FileType} from './components/ParserInterface';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import TelemetryModal from './components/TelemetryModal';

const App: React.FC = () => {
  return (
    <div className="App">
      <TelemetryModal></TelemetryModal>

      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Group 2</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <ParserComponent
        prompt={'Select a CSV file: '}
        fileType={FileType.csv}
        onChange={function() {}}
      />
    </div>
  );
};

export default App;
