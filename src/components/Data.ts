import Filter from './Filter';

/**
 * The class responsible for actually storing the data from a .csv file
 */
export default class Data {
    public pathToData: string;
    public arrayOfData: Array<object>;
    public filter?: Filter;

    /**
     * Purpose: Data constructor
     * @param {string} pathToData: the name of the .csv file corresponding to
     * the array of data passed in
     * @param {Array} arrayOfData: the parsed csv data array
     * @param {Filter} filter: the filter predicate
     */
    public constructor(pathToData: string,
        arrayOfData: Array<object>,
        filter?: Filter) {
      this.pathToData = pathToData;
      this.arrayOfData = arrayOfData;
      this.filter = filter;
    }
}
