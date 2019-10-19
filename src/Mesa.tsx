import React from 'react';
import logo from './logo.svg';
import './App.css';
import ParserComponent from './components/ParserComponent';
import {FileType} from './components/ParserInterface';
import TimelineComponent from './components/TimelineComponent';
import Data from './components/Data';
import * as d3 from 'd3';

interface Interface {
    csvData: Array<object>;
    loading: boolean;
}

export default class Mesa extends React.Component<{}, Interface> {
  constructor(props: any) {
    super(props);
    this.state = {
      csvData: [],
      loading: true,
    };
  }

  componentDidMount(): void {
    d3.csv('/10000_Sales_Records.csv')
        .then((data: Array<object>) => {
          for (let i = 0; i < data.length; i++) {
            let d: any = data[i];
            d['index'] = i;
            // console.log(d);
            data[i] = d;
            // @ts-ignore
            // data[i]['Index'] = i;
          }
          console.log(data);
          this.setState({
            csvData: data,
            loading: false,
          });
        });
  }

  render() {
    if (this.state.loading != true) {
      return (
        <div>
          <TimelineComponent data={new Data('path/to/file', this.state.csvData)}/>
        </div>
      );
    }

    return (
      <div></div>
    );
  }
}

