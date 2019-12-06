import React from 'react';
import ParserInterface, {ParserState} from './ParserInterface';
import Column, {enumDrawType} from './Column';
import moment from 'moment';
import * as d3 from 'd3';
import TimelineComponent from './TimelineComponent';
import Data from './Data';
import * as TimSort from 'timsort';
import 'bootstrap/dist/css/bootstrap.min.css';
import {loadTestCsv} from './Utilities';

import {strict as assert} from 'assert';

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
        fileData: '',
        fileName: '',
      };
      this.createNewMockFileEvent = this.createNewMockFileEvent.bind(this);
      this.checkifCsvandcallParse = this.checkifCsvandcallParse.bind(this);
      this.isValid = this.isValid.bind(this);
      this.sortData = this.sortData.bind(this);
      this.inferTypes = this.inferTypes.bind(this);
      this.parseCsv = this.parseCsv.bind(this);
      this.parse = this.parse.bind(this);
    }

    /**
     * Waits until component mounts.
     * This method is called by react when mounted. We simply
     * use it to automatically load a CSV on development environments.
     */
    componentDidMount(): void {
      // Autoloads a file for local testing
      if (process.env.NODE_ENV === 'development') {
        loadTestCsv().then((res) => {
          console.log(res);
          this.parse(res);
        });
      }
    }

    /**
     * Purpose: renders the HTML for this component
     * @precondition none
     * @postcondition
     *  Inputs: None
     *  Outputs: None
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
                  this.checkifCsvandcallParse();
                }}>
                <option selected value="">Select a Date Format</option>
                <option value="X">Numeric</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="DD-MMMM-YYYY">DD-MMMM-YYYY</option>
                <option value="MMMM-DD-YYYY">MMMM-DD-YYYY</option>
                <option value="MMM-DD-YYYY">MMMM-DD-YYYY</option>
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
     * Purpose: create a mock file event of the actual file for
     * parse when it is recalled everytime the date format is
     * changed with a valid .csv type file
     * @preconditions: a file with valid file data and
     * a valid file name and a valid file type
     * @return {any}: a mock file event similar to the actual file event
     */
    createNewMockFileEvent(): any {
      const mockDateFile: File = new File(
          [this.state.fileData],
          String(this.state.fileName),
          {type: this.props.fileType.mimeName},
      );
      // create file event of the mockfile and return it
      return {target: {files: [mockDateFile]}};
    }

    /**
   * Purpose: check if file is .csv when date format
     * is changed and call parse if it is
     * @preconditions: the current file should have a valid name (.csv)
     * @postconditions: parse is called if file is .csv
     * @return{boolean}: returns true if it works otherwise returns false
   */
    checkifCsvandcallParse(): boolean {
      const nameOfFile = this.state.fileName;
      const typeOfFile = nameOfFile.substr(nameOfFile.length - 4);
      if (typeOfFile === '.csv' && this.props.fileType.mimeName === '.csv' +
          ',text/csv') {
        this.parse(this.createNewMockFileEvent());
        return true;
      }
      return false;
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
      assert.notStrictEqual(upFile, null,
          'isValid(): File object is null');
      if (upFile !== undefined) {
        this.setState(() => {
          return {
            fileName: upFile.name,
          };
        });
        const typeOfFile = upFile.name.substr(upFile.name.length - 4);
        if (this.props.fileType.mimeName === '.csv' +
            ',text/csv' && typeOfFile === '.csv') {
          return true;
        } else {
          alert('Wrong file type was uploaded.');
          return false;
        }
      } else {
        this.setState(() => {
          return {
            fileName: '',
          };
        });
        return false;
      }
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
      assert.notStrictEqual(data, null,
          'sortData(): data (Array of objects) is null');
      assert.notStrictEqual(data, [],
          'sortData(): data (array of objects) is empty');

      let doneTheWork = false;
      /* loop goes through each key and saves the 1 with a date in first row */
      if (data !== undefined && data.length > 0) {
        assert.notStrictEqual(data[0], null,
            'sortData(): data[0] is null');
        for (const [key, value] of Object.entries(data[0])) {
          if (!doneTheWork) {
            const date1 = moment(String(value), this.state.formatString);
            if (moment(date1, this.state.formatString).isValid()) {
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
        // state should be updated
        assert.notStrictEqual(this.state.data, [],
            'sortData(): this.state.data is empty (not updated)');
        return true;
      } else {
        throw new Error('The file uploaded has no dates of the given format.');
      }
    }

    /**
     * Purpose: to instantiate an empty list of objects
     * for tracking the kinds of data in a column
     * @precondition: none
     * @postcondition: none
     * @param {number} fieldLength: the number of columns of data
     * @return {[CountTypes]}: a list of objects
     */
    protected createTypeCountingObjects(fieldLength: number): CountTypes[] {
      assert(fieldLength > 0,
          'createTypeCountingObjects(): ' +
          'no data from which to create CountTypes[]');
      const typesForEachCol = [];
      // instantiate object for each column
      for (let i = 0; i < fieldLength; i++) {
        typesForEachCol.push(new CountTypes());
      }
      assert.notStrictEqual(typesForEachCol, [],
          'createTypeCountingObjects(): typesForEachCol array is empty');
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
      // data should contain something (according to the precondition)
      assert.notStrictEqual(data, undefined,
          'inferTypes(): data (array of objects) is undefined');
      assert.notStrictEqual(data, null,
          'inferTypes(): data (array of objects) is null');
      assert.notStrictEqual(data, [], 'data (array of objects) is empty');

      if (this.state.data.length > 0) {
        assert.notStrictEqual(this.state.data[0], null,
            'inferTypes(): this.state.data[0] is null');
        const listFields = Object.keys(this.state.data[0]);
        assert.notStrictEqual(listFields, null,
            'inferTypes(): listFields is null');
        assert(listFields.length > 0,
            'inferTypes(): listFields is empty');
        // instantiate objects to track the types of data
        const typesForEachCol =
            this.createTypeCountingObjects(listFields.length);
        // check half the values to find if the data is consistent
        [0, Math.floor(this.state.data.length / 2)].forEach((element) => {
          const row: object = this.state.data[element];
          assert.notStrictEqual(row, null,
              'inferTypes(): row object is null');
          // look at each field and categorize
          for (let i = 0; i < listFields.length; i++) {
            const curColTypes = typesForEachCol[i];
            try {
              // @ts-ignore
              const val = row[listFields[i]];
              assert.notStrictEqual(val, undefined,
                  'inferTypes(): value in field is undefined');
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
          if (mostCommonType === 'string') {
            // create a Column object with occurrence data
            this.createColumn(mostCommonType, enumDrawType.occurrence, indx,
                listFields, arrayOfColumns);
            indx++;
          } else if (mostCommonType === 'date' || mostCommonType === 'number') {
            // create a Column with date data
            this.createColumn(mostCommonType, enumDrawType.any, indx,
                listFields, arrayOfColumns);
            indx++;
          }
        }
        );
        // if there is data then arrayOfColumns shouldn't be empty
        assert.notStrictEqual(arrayOfColumns, [],
            'inferTypes(): arrayOfColumns is empty after parsing data');
        return arrayOfColumns;
      } else {
        throw new Error('data is empty');
      }
    }

    /**
   * @precondition all of the parameters are defined
   * @postcondition list parameter has a new element appended to it
   * creates a new column using the parameters and appends it to a lst
   * @param {string} mostComm: the most common type of that column
   * @param {enumDrawType} drawType: the type that the column is labeled as
   * @param {number} indx: the index of the list parameter being appended to
   * @param {string[]} fieldList: the list of fields for each column
   * @param {Column[]} list: an array of columns
   */
    protected createColumn(mostComm: string, drawType: enumDrawType,
        indx: number, fieldList: string[], list: Column[]) {
      assert.notStrictEqual(mostComm, '',
          'createColumn function has empty mostCommonType');
      assert.notStrictEqual(fieldList, [],
          'createColumn function has an empty fieldList');
      assert(indx < fieldList.length,
          'createColumn function has too large of an index');
      const newCol: any = new Column(mostComm, drawType,
          fieldList[indx]);
      list[indx] = newCol;
    }

    /**
     * Purpose: attempts to parse the file uploaded by the user.
     * @precondition The user uploads a file
     * @postcondition The data is read out of the csv file and put into
     * an array object
     * @param {Object} fileEvent: the event passed into this component
     */
    async parse(fileEvent: any) {
      // fileEvent is an object containing target files
      assert.notStrictEqual(fileEvent, undefined,
          'parse(): fileEvent is undefined');
      assert.notStrictEqual(fileEvent, null,
          'parse(): fileEvent is null');
      // check target obj
      assert.notStrictEqual(fileEvent.target, null,
          'parse(): fileEvent.target is null');
      assert.notStrictEqual(fileEvent.target, undefined,
          'parse(): fileEvent.target is undefined');
      // check files obj (Array<File>)
      assert.notStrictEqual(fileEvent.target.files, null,
          'parse(): fileEvent.target.files is null');
      assert.notStrictEqual(fileEvent.target.files, undefined,
          'parse(): fileEvent.target.files is undefined');
      // check File obj (file being uploaded)
      assert.notStrictEqual(fileEvent.target.files[0], null,
          'parse(): fileEvent.target.files[0] is null');

      this.setState(() => {
        return {
          fileType: this.state.fileType,
          showTimeline: false,
        };
      });

      const temp: File = fileEvent.target.files[0];
      if (this.isValid(temp)) {
        await this.parseCsv(fileEvent);
        // only show timeline if there is data
        assert.notStrictEqual(this.state.data, [],
            'parse(): this.state.data is empty ' +
            'but setting showTimeline to true');
        this.setState(() => {
          return {
            showTimeline: true,
          };
        });
      }

      this.childKey++;
    }

    /**
     * Purpose: to parse a csv file uploaded by the user
     * @precondtion The user has uploaded a csv file
     * @postcondtion The data from the file is stored in a global array
     * @param {Object} fileEvent: the event passed into this component
     */
    async parseCsv(fileEvent: any) {
      // check fileEvent (should probs just pass in the File from parse()...
      assert.notStrictEqual(fileEvent, undefined,
          'parseCsv(): fileEvent is undefined');
      assert.notStrictEqual(fileEvent, null,
          'parseCsv(): fileEvent is null');

      const csvFile = fileEvent.target.files[0];

      assert.notStrictEqual(csvFile, undefined,
          'parseCsv(): csvFile (File obj) is undefined');
      assert.notStrictEqual(csvFile, null,
          'parseCsv(): csvFile (File obj) is null');

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
                fileData: fileReader.result,
                showTimeline: false,
              };
            });
            try {
              // shouldn't pass empty array into inferTypes or sortData :/
              assert.notStrictEqual(this.state.data, [],
                  'parseCsv(): this.state.data is empty' +
              'but still calling inferTypes & sortData');
              this.columnTypes = this.inferTypes(this.state.data);
              this.sortData(this.state.data);
            } catch (e) {
              alert(e.toString());
              console.log(e.toString());
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
   * @precondition: none
   * @postcondition: none
   * @return {string}: a string representing the largest field.
   * Defaults to 'date' if all elements is zero
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
