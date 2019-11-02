import React from 'react';
import ParserInterface, {FileType, ParserState} from './ParserInterface';
import Column, {enumDrawType} from './Column';
import moment from 'moment';
import * as d3
  from 'd3';
import TimelineComponent
  from './TimelineComponent';
import Data
  from './Data';
import * as TimSort
  from 'timsort';

/**
 * Purpose: react component responsible for receiving and parsing file data
 */
export default class ParserComponent extends React.Component<ParserInterface,
  ParserState> {
  private columnTypes: Array<Column> = Array(0);
  private childKey = 0;

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
    this.inferTypes = this.inferTypes.bind(this);
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
        <TimelineComponent key={this.childKey}
          data={new Data('path/to/file', this.state.data,
              this.columnTypes)}/>
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

    return true;
  }

  /**
   * Purpose: to instantiate an empty list of objects
   * for tracking the kinds of data in a column
   * @param {number} fieldLength: the number of columns of data
   * @return {[CountTypes]}: a list of objects
   */
  createTypeCountingObjects(fieldLength: number) : CountTypes[] {
    const typesForEachCol = [];
    // instantiate object for each column
    for (let i = 0; i < fieldLength; i++) {
      typesForEachCol.push(new CountTypes());
    }
    return typesForEachCol;
  }

  /**
   * Purpose: attempts to infer the types of the data in each of the columns
   * of the csv data
   * @param {Array} data: the array of pre-sorted valid data
   * @return {Array}: a list of objects of type Column
   */
  inferTypes(data: Array<object>): Array<Column> {
    if (this.state.data.length > 0) {
      const listFields = Object.keys(this.state.data[0]);
      // instantiate objects to track the types of data
      const typesForEachCol = this.createTypeCountingObjects(listFields.length);
      // check half the values to find if the data is consistent
      [0, Math.floor(this.state.data.length / 2)].forEach((element) => {
        const row: object = this.state.data[element];
        // look at each field and categorize
        for (let i = 0; i < listFields.length; i++) {
          const curColTypes = typesForEachCol[i];
          try {
            // @ts-ignore
            const val = row[listFields[i]];
            if (typeof val === 'string') {
              const date = moment(val);
              const isValid = date.isValid();
              if (isValid) {
                curColTypes['numDate'] += 1;
              } else {
                throw val;
              }
            } else {
              throw val;
            }
          } catch {
            // @ts-ignore
            const type = typeof row[listFields[i]];
            if (type !== 'string' && type !== 'number') {
              curColTypes['numIncongruent'] += 1;
            }
            // logs all the types that are seen
            if (type === 'string') {
              curColTypes['numString'] += 1;
            } else {
              curColTypes['numNumber'] += 1;
            }
          }
        }
      });
      let indx = 0;
      const arrayOfColumns = new Array<Column>(listFields.length);
      typesForEachCol.forEach((element) => {
        // checks the most common type and uses that
        const mostCommonType = element.largest();
        let newCol: Column;
        if (mostCommonType === 'string') {
          // create a Column object with occurrence data
          newCol = new Column(mostCommonType,
              enumDrawType.occurrence, listFields[indx]);
          arrayOfColumns[indx] = newCol;
          indx++;
        } else if (mostCommonType === 'number') {
          // create a Column with interval, point or magnitude data
          // eslint-disable-next-line max-len
          newCol = new Column(mostCommonType, enumDrawType.any, listFields[indx]);
          arrayOfColumns[indx] = newCol;
          indx++;
        } else if (mostCommonType === 'date') {
          // create a Column with date data
          // eslint-disable-next-line max-len
          newCol = new Column(mostCommonType, enumDrawType.any, listFields[indx]);
          arrayOfColumns[indx] = newCol;
          indx++;
        }
      }
      );
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
    this.setState(() => {
      return {
        showTimeline: false,
      };
    });

    if (this.props.fileType === FileType.csv) {
      await this.parseCsv(fileEvent);
    }
    this.columnTypes = this.inferTypes(this.state.data);

    // console.log(this.columnTypes);

    this.setState(() => {
      return {
        showTimeline: true,
      };
    });
    this.childKey++;
  }

  /**
   * Purpose: to parse a csv file uploaded by the user
   * @param {Object} fileEvent: the event passed into this component
   */
  async parseCsv(fileEvent: any) {
    // console.log(fileEvent);

    const csvFile = fileEvent.target.files[0];

    // for testing
    this.props.onChange(fileEvent.target.files[0]);

    const fileReader = new FileReader();

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
          this.sortData(content);
          this.isValid(csvFile);

          if (!this.isValid(csvFile)) {
            try {
              throw new Error('Wrong file type was uploaded.');
            } catch (e) {
              // console.log(e);
              alert('The file uploaded needs to be CSV.');
            }
          }
        }
        resolver(true);
      };
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(csvFile);
    });
  }
}

/**
 * Purpose: assist in counting types of data in a single Column
 */
export class CountTypes {
  public numNumber: number;
  public numIncongruent: number;
  public numString: number;
  public numDate: number;
  /**
   * create an empty component to track data
   */
  constructor() {
    this.numNumber = 0;
    this.numString = 0;
    this.numDate = 0;
    this.numIncongruent = 0;
  }

  /**
   * finds the largest element of the fields
   * @return {string}: a string representing the largest field
   */
  largest(): string {
    if (this.numDate >= this.numIncongruent && this.numDate >= this.numNumber) {
      if (this.numDate >= this.numString) {
        return 'date';
      } else {
        return 'string';
      }
    }
    if (this.numString >= this.numNumber &&
      this.numString >= this.numIncongruent) {
      return 'string';
    }
    if (this.numNumber >= this.numIncongruent) {
      return 'number';
    } else {
      return 'incongruent';
    }
  }
}
