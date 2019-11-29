import React, {useState} from 'react';
import ParserInterface, {ParserState} from './ParserInterface';
import Column, {enumDrawType} from './Column';
import moment from 'moment';
import * as d3
  from 'd3';
import TimelineComponent
  from './TimelineComponent';
import Data
  from './Data';
import * as TimSort from 'timsort';
import 'bootstrap/dist/css/bootstrap.min.css';
import {loadTestCsv} from './Utilities';
import {render} from 'react-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';


// eslint-disable-next-line require-jsdoc
const AlertDismissibleExample= (str : String)=>{
  const [show, setShow] = useState(true);
  // @ts-ignore
  document.getElementById('str').innerHTML=str;
  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p id={'str'}>
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
};


export default AlertDismissibleExample;
