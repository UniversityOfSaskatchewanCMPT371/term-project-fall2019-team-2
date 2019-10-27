import React from 'react';
import ParserInterface, {FileType, ParserState} from './ParserInterface';
import * as d3 from 'd3';
import TimelineComponent from './TimelineComponent';
import Data from './Data';
import * as TimSort from 'timsort';
import Column, {enumDrawType} from './Column';

/**
 * Purpose: react component responsible for receiving and parsing file data
 */
export default class ParserComponent extends React.Component<ParserInterface,
  ParserState> {
  private columnTypes: Array<object> = Array(0);

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
      showTimeline: false,
    };

    this.isValid = this.isValid.bind(this);
    this.sortData = this.sortData.bind(this);
    this.parseCsv = this.parseCsv.bind(this);
    this.parse = this.parse.bind(this);
    this.inferTypes = this.inferTypes.bind(this);
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
    const chart = this.state.showTimeline ?
      <div>
        <TimelineComponent
          data={new Data('path/to/file', this.state.data)}/>
      </div> :
      <div/>;

    return (
      <div>
        <label>
          {this.props.prompt}
        </label>
        <input
          type="file"
          onChange={this.parse}
          accept={this.props.fileType.mimeName}/>

        {chart}
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
   * @return {boolean}: a boolean indicating whether or not the sort succeeded
   */
  sortData(data: Array<object>): boolean {
    let doneTheWork = false;
    /* loop goes through each key and saves the 1 with a date in first row */
    for (const [key, value] of Object.entries(data[0])) {
      if (!doneTheWork) {
        const date = Date.parse(String(value));
        if (!isNaN(date) && isNaN(Number(value))) {
          doneTheWork = true;

          // key = 'odnum';
          console.log(key);

          const keyInt = key + '_num';
          console.log(keyInt);

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
              showTimeline: true,
            };
          });
          console.log(this.state.data);
        }
      }
    }

    return true;
  }

  /**
   * Purpose: attempts to infer the types of the data in each of the columns
   * of the csv data
   * @param {Array} data: the array of pre-sorted valid data
   * @return {Array}: a list of objects of type Column
   */
  inferTypes(data: Array<object>): Array<Column> {
    // console.log(this.state.data.length);
    // this.state = { // need to run tests
    //   prompt: 'stasd',
    //   fileType: FileType.csv,
    //   data: data,
    // };
    if (this.state.data.length > 0) {
      const listFields = Object.keys(this.state.data[0]);
      const listOfTypes: never[] | string[] = [];
      // check the n samples of the value to find if the data is consistent
      // future take the one that occurs the most frequently
      // if data is missing throws an error currently
      [0, Math.floor(this.state.data.length / 2)].forEach((element) => {
        const row = this.state.data[element];
        // look at each field and categorize
        for (let i = 0; i < listFields.length; i++) {
          // @ts-ignore
          const type = typeof row[listFields[i]];
          if (type !== 'string' && type !== 'number') {
            throw new Error('Bad type: ' + type);
          }
          if (listOfTypes[i] === undefined) {
            listOfTypes[i] = type;
          } else if (listOfTypes[i] !== type) {
            throw new Error('types inconsistent');
          }
        }
      });
      let indx = 0;
      const arrayOfColumns = new Array<Column>(listOfTypes.length);
      listOfTypes.forEach((element) => {
        let newCol: Column;
        if (element === 'string') {
          // create a Column object with occurrence data
          // eslint-disable-next-line max-len
          newCol = new Column(element, enumDrawType.occurrence, listFields[indx]);
          arrayOfColumns[indx] = newCol;
          indx++;
        } else if (element === 'number') {
          // create a Column with interval, point or magnitude data
          newCol = new Column(element, enumDrawType.any, listFields[indx]);
          arrayOfColumns[indx] = newCol;
          indx++;
        }
      }
      );
      console.log(arrayOfColumns);
      return arrayOfColumns;
    } else {
      throw new Error('data is empty: ' + data.length);
    }
  }

  /**
   * Purpose: attempts to parse the file uploaded by the user.
   * @param {Object} fileEvent: the event passed into this component
   */
  async parse(fileEvent: any) {
    // this.isValid(fileEvent);
    // this.sortData(this.state.data);
    if (this.props.fileType === FileType.csv) {
      await this.parseCsv(fileEvent);
    }
    this.columnTypes = this.inferTypes(this.state.data);
  }

  /**
   * Purpose: to parse a csv file uploaded by the user
   * @param {Object} fileEvent: the event passed into this component
   */
  async parseCsv(fileEvent: any) {
    console.log(fileEvent);
    const t1 = performance.now();

    const csvFile = fileEvent.target.files[0];
    const fileReader = new FileReader();

    console.log(csvFile);
    console.log(typeof csvFile);

    return new Promise((resolver, agent) => {
      const handleFileRead = () => {
        if (typeof fileReader.result === 'string') {
          const content = d3.csvParse(fileReader.result,
              function(d: any, i: number): any {
              // autoType the row
                d = d3.autoType(d);
                // must add an index to the row to be used by the Timeline
                d['index'] = i;

                return d;
              });
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
          console.log(this.isValid(csvFile));
          if (!this.isValid(csvFile)) {
            try {
              throw new Error('Wrong file type was uploaded.');
            } catch (e) {
              console.log(e);
              alert('The file uploaded needs to be CSV.');
            }
          }

          const t2 = performance.now();

          console.log('Sorting took: ' + (t2 - t1));
        }
        resolver(true);
      };
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(csvFile);
    });
  }
}
