import React from 'react';
import ParserInterface, {FileType, ParserState} from './ParserInterface';
import * as d3 from 'd3';
import * as d3dsv from 'd3-dsv';
import Column, {enumDrawType} from './Column';
import moment from 'moment';

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
            const val = row[listfields[i]];
            const date = moment(val, 'YYYY-MM-DD');
            const isValid = date.isValid();
            if (isValid) {
              curColTypes['numDate'] += 1;
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
        // console.log(content);
        // const t = {
        //   dt: content[0]['Order Date'],
        // };
        // d3.autoType(t);
        // console.log(t.dt);
        // console.log(typeof t.dt);
        // console.log(d3dsv.autoType(t));
      }
    };

    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(csvFile);
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
