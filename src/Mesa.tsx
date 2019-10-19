import React from 'react';
import './App.css';
import TimelineComponent from './components/TimelineComponent';
import Data from './components/Data';
import * as d3 from 'd3';

interface Interface {
    csvData: Array<object>;
    loading: boolean;
}

/**
 * Purpose: testing class used by Mesa to mock user input
 */
export default class Mesa extends React.Component<{}, Interface> {
  /**
     * Purpose: constructor for the Mesa class
     * @param {any} props
     */
  constructor(props: any) {
    super(props);
    this.state = {
      csvData: [],
      loading: true,
    };
  }

  /**
     * Purpose: once the component has loaded, immediately start loading the
     * default csv file for testing
     */
  componentDidMount(): void {
    d3.csv('/10000_Sales_Records.csv')
        .then((data: Array<object>) => {
          for (let i = 0; i < data.length; i++) {
            const d: any = data[i];
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

  /**
     * Renders html to the screen
     * @return {string}: the html to be rendered
     */
  render() {
    if (!this.state.loading) {
      return (
        <div>
          <TimelineComponent
            data={new Data('path/to/file', this.state.csvData)}/>
        </div>
      );
    }

    return (
      <div/>
    );
  }
}

