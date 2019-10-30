import React from 'react';
import ParserInterface, {FileType, ParserState} from './ParserInterface';
import * as d3 from 'd3';
import * as d3dsv from 'd3-dsv';
import * as TimSort from 'timsort';

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
    const typeOfFile = fileEvent.name.substr(fileEvent.name.length - 3);
    return typeOfFile === 'csv';
  }

  /**
     * Purpose: sorts the array of data
     * @param {Array} data: the array of data to sort
     * @return {boolean}: array of sorted data
     */
  sortData(data: Array<object>): Array<object> {
    let doneTheWork = false;
    /* loop goes through each key and saves the 1 with a date in first row */
    for (const [key, value] of Object.entries(data[0])) {
      if (!doneTheWork) {
        const date = Date.parse(String(value));
        if (!isNaN(date) && isNaN(Number(value))) {
          doneTheWork = true;

          const keyInt = key + '_num';
          // console.log(keyInt);

          TimSort.sort(data, function(a: any, b: any) {
            if (!a.hasOwnProperty(keyInt)) {
              a[keyInt] = Date.parse(a[key]);
            }

            if (!b.hasOwnProperty(keyInt)) {
              b[keyInt] = Date.parse(b[key]);
            }

            return (a[keyInt] - b[keyInt]);
          });

          this.setState(() => {
            return {
              data: data,
            };
          });
          // console.log(this.state.data);
        }
      }
    }

    return data;
  }

  /**
     * Purpose: attempts to infer the types of the data in each of the columns
     * of the csv data
     * @param {Array} data: the array of data to infer the types for
     * @return {Array}: a list of objects which define the methods available for
     * the data
     */
  inferTypes(data: Array<object>): Array<object> {
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
        console.log(this.sortData(content));
        console.log(content);
        if (!this.isValid(csvFile)) {
          try {
            throw new Error('Wrong file type was uploaded.');
          } catch (e) {
            console.log(e);
            alert('The file uploaded needs to be CSV.');
          };
        }
      }
    };

    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(csvFile);
  }
}
