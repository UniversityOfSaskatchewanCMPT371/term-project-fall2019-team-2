import React from 'react';
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

/**
 * Purpose: react component responsible for receiving and parsing file data
 */
export default class ParserComponent extends React.Component<ParserInterface,
  ParserState> {
    private columnTypes?: Array<Column>;
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
        formatString: '',
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
          <div className="row">
            <div className="col-6">
              <label>
                {this.props.prompt}
              </label>
              <input
                type="file"
                onChange={this.parse}
                accept={this.props.fileType.mimeName}/>
            </div>
            <div className="col-6">
              <select value={this.state.formatString}
                onChange={(e) => {
                  const val = e.target.value;
                  this.setState(() => {
                    return {
                      formatString: val,
                    };
                  });
                }}>
                <option selected value="">Open this select menu</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="DD-MMMM-YYYY">DD-MMMM-YYYY</option>
                <option value="MMMM-DD-YYYY">MMMM-DD-YYYY</option>
                <option value="DD-MM-YY">DD-MM-YY</option>
                <option value="MM-DD-YY">MM-DD-YY</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              {chart}
            </div>
          </div>
        </div>
      );
    }

    /**
     * Purpose: checks if the passed in event contains a file upload, then
     * verifies that the file type and contents are valid
     * @precondition no other parser object exists
     * @postcondition a parser object is instantiated as the only parser object
     * @param {Object} upFile: takes in the file
     * @return {boolean}: a boolean indicating whether or not the file upload is
     * valid
     */
    isValid(upFile?: File): boolean {
      if (upFile !== undefined) {
        const typeOfFile = upFile.name.substr(upFile.name.length - 4);
        if (typeOfFile === '.csv') {
          return typeOfFile === '.csv';
        } else {
          throw new Error('Wrong file type was uploaded.');
        }
      }
      throw new Error('Wrong file type was uploaded.');
    }

    /**
     * Purpose: sorts the array of data
     * @precondition dates must contain year month and date,
     *    if data does not contain year in some
     *    dates but does in some it will sort lexicographically.
     *    a csv has been uploaded, and the data is stored in an array.
     * @postcondition the data stored in the array is sorted by some date column
     * @param {Array} data: the array of data to sort
     * @return {boolean}: array of sorted data
     */
    sortData(data: Array<object>): boolean {
      let doneTheWork = false;
      /* loop goes through each key and saves the 1 with a date in first row */
      if (data[0] !== undefined && data.length > 0) {
        for (const [key, value] of Object.entries(data[0])) {
          if (!doneTheWork) {
            const date1 = moment(String(value));
            if (!isNaN(Number(date1)) && isNaN(Number(value))) {
              doneTheWork = true;
              const formatString = this.state.formatString;

              const keyInt = `${key}_num`;

              TimSort.sort(data, function(a: any, b: any) {
                let val: any;
                if (!a.hasOwnProperty(keyInt)) {
                  val = moment(a[key], formatString);
                  if (val.isValid()) {
                    a[keyInt] = val.valueOf();
                  } else {
                    a[keyInt] = -1;
                  }
                }

                if (!b.hasOwnProperty(keyInt)) {
                  val = moment(b[key], formatString);
                  if (val.isValid()) {
                    b[keyInt] = val.valueOf();
                  } else {
                    b[keyInt] = -1;
                  }
                }
                return (a[keyInt] - b[keyInt]);
              });

              this.setState(() => {
                return {
                  data,
                };
              });
            }
          }
        }
      }
      if (doneTheWork) {
        return true;
      } else {
        throw new Error('The file uploaded has no dates.');
      }
    }

    /**
     * Purpose: to instantiate an empty list of objects
     * for tracking the kinds of data in a column
     * @param {number} fieldLength: the number of columns of data
     * @return {[CountTypes]}: a list of objects
     */
    createTypeCountingObjects(fieldLength: number): CountTypes[] {
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
     * @precondition An array of sorted data exists for types to be inferred
     * from
     * @postcondition The array is transformed into an array of type Column,
     * and the default behavior for the data is inferred and set
     * @param {Array} data: the array of pre-sorted valid data
     * @return {Array}: a list of objects of type Column
     */
    inferTypes(data: Array<object>): Array<Column> | undefined {
      if (this.state.data.length > 0) {
        const listFields = Object.keys(this.state.data[0]);
        // instantiate objects to track the types of data
        const typesForEachCol =
            this.createTypeCountingObjects(listFields.length);
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
            newCol = new Column(mostCommonType,
                enumDrawType.any, listFields[indx]);
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
        throw new Error('data is empty');
      }
    }

    /**
     * Purpose: attempts to parse the file uploaded by the user.
     * @precondition The user uploads a file
     * @postcondition The data is read out of the csv file and put into
     * an array object
     * @param {Object} fileEvent: the event passed into this component
     */
    async parse(fileEvent: any) {
      this.setState(() => {
        return {
          showTimeline: false,
        };
      });

      const temp: File = fileEvent.target.files[0];
      try {
        if (this.props.fileType.mimeName === '.csv' +
            ',text/csv' && this.isValid(temp)) {
          await this.parseCsv(fileEvent);
        }
      } catch (e) {
        alert('Wrong file type was uploaded.');
        console.log('Wrong file was uploaded.');
      }

      this.setState(() => {
        return {
          showTimeline: true,
        };
      });
      this.childKey++;
    }

    /**
     * Purpose: to parse a csv file uploaded by the user
     * @precondtion The user has uploaded a csv file
     * @postcondtion The data from the file is stored in a global array
     * @param {Object} fileEvent: the event passed into this component
     */
    async parseCsv(fileEvent: any) {
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
            try {
              this.columnTypes = this.inferTypes(this.state.data);
              this.sortData(this.state.data);
            } catch (e) {
              alert('data is EMPTY');
              console.log('data is empty');
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
