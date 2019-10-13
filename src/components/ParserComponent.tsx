import React from 'react';
import ParserInterface from './ParserInterface';
import {ParserState} from './ParserInterface';
import * as d3 from 'd3';
import Data from './Data';

/**
 * Purpose: react component responsible for receiving and parsing file data
 */
export default class ParserComponent extends React.Component<ParserInterface,
    ParserState> {
  /**
   * Purpose: ParserComponent constructor
   * @param {ParserInterface} props: prompt and filetype passed as arguments
   */
  constructor(props: ParserInterface) {
    super(props);
    this.state = {
      prompt: props.prompt,
      filetype: props.filetype,
      data: [],
    };
  }

  /**
   * Purpose: renders the HTML for this component
   * @return {string}: valid HTML
   */
  render() {
    return (
      <div>
        <label>
          {this.props.prompt}
        </label>
        <input type="file" onChange={this.Parse}
          accept={this.props.filetype.mimeName} />
      </div>
    );
  }

  /**
   * Purpose: checks if the passed in event contains a file upload, then
   * verifies that the file type and contents are valid
   * @param {Object} fileEvent: the event passed into this component
   * @return {boolean}: a boolean indicating whether or not the file upload is
   * valid
   */
  IsValid(fileEvent: any): boolean {
    return true;
  }

  /**
   * Purpose: sorts the array of data
   * @param {Array} data: the array of data to sort
   * @return {boolean}: a boolean indicating whether or not the sort succeeded
   */
  SortData(data: Array<object>): boolean {
    return true;
  }

  /**
   * Purpose: attempts to infer the types of the data in each of the columns of
   * the csv data
   * @param {Array} data: the array of data to infer the types for
   * @return {Array}: a list of objects which define the methods available for
   * the data
   */
  InferTypes(data: Array<object>): Array<object> {
    return [];
  }

  /**
   * Purpose: attempts to parse the file uploaded by the user.
   * @param {Object} fileEvent: the event passed into this component
   */
  Parse(fileEvent: any) {
    this.IsValid(fileEvent);
    this.SortData(this.state.data);
    this.InferTypes(this.state.data);

    // Create new data object
    const csvData = new Data('fileName', this.state.data);
  }

  /**
   * Purpose: to parse a csv file uploaded by the user
   * @param {Object} fileEvent: the event passed into this component
   */
  async ParseCsv(fileEvent: any) {
    console.log(fileEvent);

    const csvFile = fileEvent.target.files[0];
    const fileReader = new FileReader();

    console.log(csvFile);
    console.log(typeof csvFile);

    const handleFileRead = () => {
      if (typeof fileReader.result === 'string') {
        const content = d3.csvParse(fileReader.result);

        // set state of the parser component
        this.setState((state) => {
          return {
            prompt: this.state.prompt,
            filetype: this.state.filetype,
            data: content,
          };
        });
        console.log(content);
      }
    };

    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(csvFile);
  }
}
