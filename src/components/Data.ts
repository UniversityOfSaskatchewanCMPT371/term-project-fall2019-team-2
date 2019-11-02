import Filter from './Filter';
import Column from './Column';

/**
 * The class responsible for actually storing the data from a .csv file
 */
export default class Data {
    public pathToData: string;
    public arrayOfData: Array<object>;
    public columns?: Array<Column>;
    public filter?: Filter;


    /**
     * Purpose: Data constructor
     * @param {string} pathToData: the name of the .csv file corresponding to
     * the array of data passed in
     * @param {Array} arrayOfData: the parsed csv data array
     * @param {Array} columns: list of columns
     * @param {Filter} filter: the filter predicate
     */
    public constructor(pathToData: string,
        arrayOfData: Array<object>,
        columns?: Array<Column>,
        filter?: Filter) {
      this.pathToData = pathToData;
      this.arrayOfData = arrayOfData;
      this.columns = columns;
      this.filter = filter;
    }
}
