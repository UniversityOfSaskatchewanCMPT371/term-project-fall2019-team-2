import React from 'react';
import ParserInterface, {FileType, ParserState} from './ParserInterface';
import * as d3 from 'd3';
import * as d3dsv from 'd3-dsv';
import Column, {enumDrawType} from './Column';

/**
 * Purpose: react component responsible for receiving and parsing file data
 */
export default class ParserComponent extends React.Component<ParserInterface,
    ParserState> {
  /**
     * Purpose: ParserComponent constructor
     * @param {ParserInterface} props: the prompt and fileType properties to
     * pass into the constructor
     */
  constructor(props: ParserInterface) {
    super(props);
    this.state = {
      prompt: props.prompt,
      fileType: props.fileType,
      data: [],
    };

    this.isValid = this.isValid.bind(this);
    this.sortData = this.sortData.bind(this);
    this.inferTypes = this.inferTypes.bind(this);
    this.parseCsv = this.parseCsv.bind(this);
    this.parse = this.parse.bind(this);
  }

  /**
     * Waits until component mounts
     */
  componentDidMount(): void {
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
        <input type="file" onChange={this.parse}
          accept={this.props.fileType.mimeName}/>
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
  isValid(fileEvent: any): boolean {
    return true;
  }

  /**
     * Purpose: sorts the array of data
     * @param {Array} data: the array of data to sort
     * @return {boolean}: a boolean indicating whether or not the sort succeeded
     */
  sortData(data: Array<object>): boolean {
    return true;
  }

  /**
   * Purpose: attempts to infer the types of the data in each of the columns
   * of the csv data
   * @param {Array} data: the array of pre-sorted valid data
   * @return {Array}: a list of objects of type Column
   * has an enum for type of data
   */
  inferTypes(data: Array<object>): Array<object> {
    if (this.state.data.length > 0) {
      const firstElement = this.state.data[0];
      // create a list of fields in object
      const listFields = Object.keys(firstElement);
      const returns = [];
      // look at each field and categorize
      for (let i = 0; listFields.length; i++) {
        const type = typeof listFields[i]; // should be let?
        if (type === 'string') {
          // create a Column object with occurance data
          // eslint-disable-next-line max-len
          const newCol = new Column(type, enumDrawType.occurance, listFields[i]);
        }
        if (type === 'number') {
          // create a Column with interval, point or magnitude data
          const newCol = new Column(type, enumDrawType.any, listFields[i]);
        }
      }
    }
    return [];
  }

  /**
     * Purpose: attempts to parse the file uploaded by the user.
     * @param {Object} fileEvent: the event passed into this component
     */
  parse(fileEvent: any) {
    // this.isValid(fileEvent);
    // this.sortData(this.state.data);
    // this.inferTypes(this.state.data);
    if (this.props.fileType === FileType.csv) {
      this.parseCsv(fileEvent).then(() => console.log('done'));
    }
  }

  /**
     * Purpose: to parse a csv file uploaded by the user
     * @param {Object} fileEvent: the event passed into this component
     */
  async parseCsv(fileEvent: any) {
    console.log(fileEvent);

    const csvFile = fileEvent.target.files[0];
    const fileReader = new FileReader();

    console.log(csvFile);
    console.log(typeof csvFile);

    const handleFileRead = () => {
      if (typeof fileReader.result === 'string') {
        const content = d3.csvParse(fileReader.result, d3dsv.autoType);

        // set state of the parser component
        this.setState((state) => {
          return {
            prompt: this.state.prompt,
            fileType: this.state.fileType,
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