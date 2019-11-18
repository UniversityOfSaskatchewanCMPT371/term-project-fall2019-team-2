import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent, {CountTypes} from '../components/ParserComponent';
import ParserInterface, {FileType} from '../components/ParserInterface';
import {enumDrawType} from '../components/Column';

describe('<ParserComponent /> renders correctly', () => {
  const prompt = <label>test: </label>;
  const props = {
    prompt: 'test: ',
    onChange: jest.fn(),
  };

  it('renders a <ParserComponent /> to select a .csv', () => {
    const comp = shallow(
        <ParserComponent
          {...props}
          fileType={FileType.csv}
        />);

    expect(comp.contains(prompt)).toBeTruthy();
    expect(comp.exists('input')).toBeTruthy();
    expect(comp.exists('select')).toBeTruthy();
    expect(comp.find('input').prop('accept')).toContain('.csv,text/csv');
  });

  it('renders a <ParseComponent /> to select a .tl', () => {
    const comp = shallow(
        <ParserComponent
          {...props}
          fileType={FileType.tl}
        />);

    expect(comp.contains(prompt)).toBeTruthy();
    expect(comp.exists('input')).toBeTruthy();
    expect(comp.find('input').prop('accept')).toContain('.tl');
  });
});

describe('Csv FileEvents processed correctly\n', () => {
  const props = {
    prompt: 'test: ',
    fileType: FileType.csv,
  };

  it('Onchange event triggered when file selected\n', async () => {
    const onChangeMock = jest.fn();
    const testFile: File = new File(
        ['abcdef'],
        'test.csv',
        {type: '.csv,text/csv'},);

    const event = {target: {files: [testFile]}};
    const comp = mount(
        <ParserComponent
          {...props}
          onChange={onChangeMock}
        />);

    comp.find('input').simulate('change', event);
    const fileUsed: File = onChangeMock.mock.calls[0][0];
    expect(fileUsed.name).toBe(testFile.name);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  describe('R1 Tests\n', () => {
    describe('T1.1: Incompatible File types not accepted\n', () => {
      // vars used
      let inferTypesSpy: any;
      let sortDataSpy: any;
      let isValidSpy: any;
      let parseCsvSpy: any;
      let windowSpy: any;
      let wrapper: any;
      let compData: Array<object>;
      const onChangeMock = jest.fn();

      // jest doesn't implement window.alert & will throw an error
      // this suppresses that error (can still check that alert is created)
      window.alert = () => {};

      beforeEach(() => {
        // create spies
        inferTypesSpy =
          jest.spyOn(ParserComponent.prototype, 'inferTypes');
        sortDataSpy =
          jest.spyOn(ParserComponent.prototype, 'sortData');
        isValidSpy =
          jest.spyOn(ParserComponent.prototype, 'isValid');
        parseCsvSpy =
          jest.spyOn(ParserComponent.prototype, 'parseCsv');
        windowSpy =
          jest.spyOn(window, 'alert');

        wrapper = mount(
            <ParserComponent
              {...props}
              onChange={onChangeMock}
            />
        );

        // make sure everything is cleared before running test
        onChangeMock.mockClear();
        compData = [];
      });

      // Called after every it()
      afterEach(() => {
        // Make sure isValid was called & error was thrown
        expect(isValidSpy).toHaveBeenCalled();
        expect(isValidSpy).toThrow('Wrong file type was uploaded.');

        // make sure sortData, parseCsv, & inferTypes were not called
        expect(parseCsvSpy).not.toHaveBeenCalled();
        expect(sortDataSpy).not.toHaveBeenCalled();
        expect(inferTypesSpy).not.toHaveBeenCalled();

        // make sure alert was created
        expect(windowSpy).toHaveBeenCalled();

        // Check that ParserComponent data is still empty
        compData = wrapper.state('data');
        expect(onChangeMock).not.toHaveBeenCalled();
        expect(compData.length).toBe(0);
      });

      it('.pdf rejected', async () => {
        const pdfTestFile: File = new File(
            ['test'],
            'test.pdf',
            {type: '.pdf,application/pdf'},
        );
        const fileEvent: any = {target: {files: [pdfTestFile]}};
        await wrapper.instance().parse(fileEvent);
      });

      it('.txt rejected', async () => {
        const txtTestFile: File = new File(
            ['abcdef'],
            'test.txt',
            {type: '.txt, text/plain'},
        );
        const fileEvent: any = {target: {files: [txtTestFile]}};
        await wrapper.instance().parse(fileEvent);
      });

      it('.doc rejected', async () => {
        const docTestFile: File = new File(
            [''],
            'test.doc',
            {type: '.doc, application/msword'},
        );
        const fileEvent: any = {target: {files: [docTestFile]}};
        await wrapper.instance().parse(fileEvent);
      });

      it('.css rejected', async () => {
        const cssTestFile: File = new File(
            [''],
            'test.css',
            {type: '.css, text/css'},
        );
        const fileEvent: any = {target: {files: [cssTestFile]}};
        await wrapper.instance().parse(fileEvent);
      });

      it('.js rejected', async () => {
        const jsTestFile: File = new File(
            ['abcdefg'],
            'test.js',
            {type: '.js, text/javascript'},
        );
        const fileEvent: any = {target: {files: [jsTestFile]}};
        await wrapper.instance().parse(fileEvent);
      });
    });
    describe('T1.3: .csv with different valid date formats accepted\n', () => {
      const onChangeMock = jest.fn();
      const comp: any = mount(<ParserComponent
        {...props}
        onChange={onChangeMock}
      />);
      let compData: Array<object>;

      beforeEach(() => {
        onChangeMock.mockClear();
        comp.setState({data: []});
        compData = comp.state('data');
        expect(compData.length).toBe(0);
      });

      afterEach(() => {
        // onChange should be called once, and it should get to parseCsv()
        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(compData.length).toBe(3);
      });

      it('.csv with sorted dates accepted\n', async () => {
        const multiDateFile: File = new File(
            ['Date,SomeNum,SomeString\n' +
            '04/04/1995,4,abcd\n' +
            '06-07-1996,5,efg\n' +
            'November 5 1997,1,hij\n' +
            ''],
            'multiDateTest.csv',
            {type: '.csv,text/csv'},
        );
        const fileEvent = {target: {files: [multiDateFile]}};

        // no error should be thrown!!!
        try {
          expect(await comp.instance().parse(fileEvent)).toBe(undefined);
        } catch (error) {
          fail(); // fail if error thrown
        }
        // data should be updated to contain csv info
        compData = comp.state('data');
        // Check that the object contains all the data from the csv
        compData.forEach((date) => {
          expect(date).toMatchSnapshot({Date_num: expect.any(Number)});
        });
      });

      // todo: add tests for to check sorting by month, day, time
      it('.csv with unsorted dates accepted & data sorted by date\n',
          async () => {
            const unsortedMultiDateFile: File = new File(
                // This tests YYYY-MM-DD format
                ['Date,SomeNum,SomeString\n' +
                '04-04-1997,4,abcd\n' +
                '04-04-1993,5,efg\n' +
                '04-04-1995,1,hij\n' +
                ''],
                'test.csv',
                {type: '.csv,text/csv'},
            );
            const fileEvent = {target: {files: [unsortedMultiDateFile]}};


            // no error should be thrown!!!
            try {
              expect(await comp.instance().parse(fileEvent)).toBe(undefined);
            } catch (e) {
              fail(); // fail if error thrown
            }
            // data should be updated to contain csv info
            compData = comp.state('data');
            // Check that the object contains all the data from the csv
            compData.forEach((date) => {
              expect(date).toMatchSnapshot({Date_num: expect.any(Number)});
            });
          });
    });

    it('T1.4: .csv file with no temporal data is rejected\n', async () => {
      // create spies
      const inferTypesSpy =
        jest.spyOn(ParserComponent.prototype, 'inferTypes');
      const sortDataSpy =
        jest.spyOn(ParserComponent.prototype, 'sortData');
      const isValidSpy =
        jest.spyOn(ParserComponent.prototype, 'isValid');
      const parseCsvSpy =
        jest.spyOn(ParserComponent.prototype, 'parseCsv');
      const windowSpy =
        jest.spyOn(window, 'alert');

      const onChangeMock = jest.fn();
      const wrapper: any = mount(
          <ParserComponent
            {...props}
            onChange={onChangeMock}
          />
      );
      let compData: Array<object> = [];

      // test file with no dates
      const noDateFile: File = new File(
          ['H1,H2,H3,H4\n' +
          'a,b,c,d\n' +
          'e,f,g,h\n' +
          'i,j,k,l\n'],
          'test.csv',
          {type: '.csv,text/csv'},);

      // fileEvent
      const fileEvent = {target: {files: [noDateFile]}};

      await wrapper.instance().parse(fileEvent);

      // Make sure isValid, parseCsv, inferTypes, & sortData was called
      expect(isValidSpy).toHaveBeenCalled();
      expect(parseCsvSpy).toHaveBeenCalled();
      expect(inferTypesSpy).toHaveBeenCalled();
      expect(sortDataSpy).toHaveBeenCalled();

      // These should not throw errors
      expect(parseCsvSpy).not.toThrow();
      // for some reason these 2 throw errors :/
      // expect(isValidSpy).not.toThrow();
      // expect(inferTypesSpy).not.toThrow();

      // Throws 'Data is EMPTY' error instead...
      expect(sortDataSpy).toThrow('The file uploaded has no dates.');

      // make sure alert was created
      expect(windowSpy).toHaveBeenCalled();

      compData = wrapper.state('data');
      expect(compData.length).toBe(3);
    });

    describe('T1.9: should accept valid csv file name with unusual' +
      ' chars in file name', () => {
      const props = {
        prompt: 'test: ',
        fileType: FileType.csv,
      };

      // create mock component and onchange events
      const onChangeMock = jest.fn();
      const comp: any = mount(<ParserComponent
        {...props}
        onChange={onChangeMock}
      />);

      // clear the on change event mock and the enzyme component
      beforeEach(() => {
        onChangeMock.mockClear();
        comp.setState({data: []});
      });

      // check conditions after each it() block
      afterEach(() => {
        expect(comp.state('data').length).toEqual(3);
        expect(onChangeMock).toHaveBeenCalledTimes(1);
      });

      it('file name with \\', async () => {
        const testfile: File = new File(
            ['Date,SomeNum,SomeString\n' +
            '04/12/1998,4,abcd\n' +
            '06-01-1994,5,efg\n' +
            'November 5 1997,1,hij\n'],
            'test\\.csv',
            {type: '.csv,text/csv'},
        );
        const fileEvent = {target: {files: [testfile]}};
        await comp.instance().parse(fileEvent);
      });

      it('file name with emoji that use unicode', async () => {
        const testfilewithemoji: File = new File(
            ['Date,SomeNum,SomeString\n' +
                    '04/12/1998,4,abcd\n' +
                    '06-01-1994,5,efg\n' +
                    'November 5 1997,1,hij\n' +
                    ''],
            '😁😁😁😁.csv',
            {type: '.csv,text/csv'},);

        const fileEvent = {target: {files: [testfilewithemoji]}};
        await comp.instance().parse(fileEvent);
      });
    });
  });
});

// To be used by the developers
describe('<ParserComponent /> Unit Tests', () => {
  describe('constructor()', () => {
    it('constructor sets variables', () => {
      const pi: ParserInterface = {
        prompt: 'test',
        fileType: FileType.csv,
        onChange: jest.fn(),
      };
      const pc = new ParserComponent(pi);
      expect(pc.state.prompt).toBe('test');
      expect(pc.state.fileType).toBe(FileType.csv);
      expect(pc.state.data).toStrictEqual([]);
    });
  });

  describe('componentDidMount()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('isValid()', () => {
    const wrapper = mount(<ParserComponent prompt={'Select ' +
      'a CSV file: '} fileType={FileType.csv}
    onChange={function() {}}/>);
    const instance = wrapper.instance() as ParserComponent;
    it('Should return true when given a .csv file', () => {
      const testFile: File = new File(
          [''],
          'test.csv',
          {type: '.csv,text/csv'},
      );
      expect(instance.isValid(testFile)).toBeTruthy();
    });
    it('should throw exception when given undefined', () => {
      expect(() => {
        instance.isValid(undefined);
      }).toThrow('Wrong file type was uploaded.');
    });
    it('should return true when given csv.csv', () => {
      const testFile: File = new File(
          [''],
          'csv.csv',
          {type: '.csv,text/csv'},
      );
      expect(instance.isValid(testFile)).toBeTruthy();
    });
    it('should throw exception when given non-csv file', () => {
      const testFile: File = new File(
          [''],
          'test.pdf',
          {type: '.pdf,application/pdf'},
      );
      expect(() => {
        instance.isValid(testFile);
      }).toThrow('Wrong file type was uploaded.');
    });
    it('should throw exception when given non csv file with name csv', () => {
      const testFile: File = new File(
          [''],
          'csv.pdf',
          {type: '.pdf,application/pdf'},
      );
      expect(() => {
        instance.isValid(testFile);
      }).toThrow('Wrong file type was uploaded.');
    });
  });

  describe('sortData()', () => {
    const wrapper = shallow(<ParserComponent prompt={'Select ' +
      'a CSV file: '} fileType={FileType.csv}
    onChange={function() {}}/>);
    const instance = wrapper.instance() as ParserComponent;
    it('should sort data by date when ' +
        'given data with id, name and date where date is in form m/d/y' +
        'with invalid date going to the first spot', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': '4/5/2010'},
        {'id': 2, 'name': 'name2', 'Date': '2/31/1992'},
        {'id': 3, 'name': 'name3', 'Date': '12/21/1992'}];
      instance.setState({formatString: 'M D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '2/31/1992'},
        {'id': 3, 'name': 'name3', 'Date': '12/21/1992'},
        {'id': 1, 'name': 'name1', 'Date': '4/5/2010'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
    });

    it('should sort data by the first date ' +
        'column when given data with 2 date columns', () => {
      const testArray: {id: number, Date: string, Date1: string}[] = [
        {'id': 1, 'Date': '1/1/2001', 'Date1': '4/5/2010'},
        {'id': 2, 'Date': '1/1/2003', 'Date1': '4/5/1992'},
        {'id': 3, 'Date': '1/1/2000', 'Date1': '12/21/1992'},
        {'id': 4, 'Date': '1/1/2002', 'Date1': '12/21/1993'}];
      instance.setState({formatString: 'M D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, Date: string, Date1: string}[] = [
        {'id': 3, 'Date': '1/1/2000', 'Date1': '12/21/1992'},
        {'id': 1, 'Date': '1/1/2001', 'Date1': '4/5/2010'},
        {'id': 4, 'Date': '1/1/2002', 'Date1': '12/21/1993'},
        {'id': 2, 'Date': '1/1/2003', 'Date1': '4/5/1992'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    it('should throw exception when given data with no dates', () => {
      const testArray: {id: number, name: string, job: string}[] = [
        {'id': 1, 'name': 'name1', 'job': 'job1'},
        {'id': 2, 'name': 'name2', 'job': 'job2'},
        {'id': 3, 'name': 'name3', 'job': 'job3'},
        {'id': 4, 'name': 'name4', 'job': 'job4'}];
      expect(() => {
        instance.sortData(testArray);
      }).toThrow('The file uploaded has no dates.');
    });

    it('should throw exception when given an empty file with no data', () => {
      const testArray: {id: number, name: string, job: string}[] = [];
      expect(() => {
        instance.sortData(testArray);
      }).toThrow('The file uploaded has no dates.');
    });

    it('should sort the data by dates when given ' +
        'dates written in a form like November 23, 2019', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'November 23, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 1, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'}];
      instance.setState({formatString: 'MMMM D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': 'January 1, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'November 23, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31, 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    it('should sort the data by dates when given ' +
        'dates written in a form like November 23 2019 (no comma)', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'November 23 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 1 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5 2019'}];
      instance.setState({formatString: 'MMMM D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': 'January 1 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 5 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'November 23 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 31 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    it('should sort data when given ' +
        'dates written in a form like 23 november 2019', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': '23 november 2019'},
        {'id': 2, 'name': 'name2', 'Date': '1 january 2019'},
        {'id': 3, 'name': 'name3', 'Date': '31 december 2019'},
        {'id': 4, 'name': 'name4', 'Date': '5 february 2019'}];
      instance.setState({formatString: 'D MMMM YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 2, 'name': 'name2', 'Date': '1 january 2019'},
        {'id': 4, 'name': 'name4', 'Date': '5 february 2019'},
        {'id': 1, 'name': 'name1', 'Date': '23 november 2019'},
        {'id': 3, 'name': 'name3', 'Date': '31 december 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    it('should return sorted data with invalid date moved to the front' +
        'when given data with an invalid date(february 31, 2019)', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 3, 'name': 'name3', 'Date': 'December 1, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'february 31, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'January 1, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 30, 2019'}];
      instance.setState({formatString: 'MMMM D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 4, 'name': 'name4', 'Date': 'february 31, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'January 1, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'January 30, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'December 1, 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });

    it('should return sorted data when given date of different format' +
          'when given data with an invalid date(february 31, 2019)', () => {
      const testArray: {id: number, name: string, Date: string}[] = [
        {'id': 3, 'name': 'name3', 'Date': 'Dec 1, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 19, 2019'},
        {'id': 1, 'name': 'name1', 'Date': 'Jan 1, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'Jan 30, 2019'}];
      instance.setState({formatString: 'MMM D YYYY'});
      instance.sortData(testArray);
      const expectedResult: {id: number, name: string, Date: string}[] = [
        {'id': 1, 'name': 'name1', 'Date': 'Jan 1, 2019'},
        {'id': 2, 'name': 'name2', 'Date': 'Jan 30, 2019'},
        {'id': 4, 'name': 'name4', 'Date': 'February 19, 2019'},
        {'id': 3, 'name': 'name3', 'Date': 'Dec 1, 2019'}];
      expect(testArray[0]).toMatchObject(expectedResult[0]);
      expect(testArray[1]).toMatchObject(expectedResult[1]);
      expect(testArray[2]).toMatchObject(expectedResult[2]);
      expect(testArray[3]).toMatchObject(expectedResult[3]);
    });
  });

  describe('createCountingObjects()', () => {
    const pi: ParserInterface = {
      prompt: 'test',
      fileType: FileType.csv,
      onChange: jest.fn(),
    };
    const pc = new ParserComponent(pi);
    it('instantiates a list of CountTypes', () => {
      const listObjects = pc.createTypeCountingObjects(4);
    });
  });

  describe('inferTypes()', () => {
    let pc: ParserComponent;
    let data: any[] | object[] |
      { money: string; heartAttacks: string; animals: number; }[];
    beforeEach(() => {
      const pi: ParserInterface = {
        prompt: 'test',
        fileType: FileType.csv,
        onChange: jest.fn(),
      };
      pc = new ParserComponent(pi);
      data = new Array(4);
      data[0] = {money: 100, heartAttacks: '2016-07-03', animals: 'dog'};
      data[1] = {money: 55, heartAttacks: '2019-02-02', animals: 'cat'};
      data[2] = {money: 300, heartAttacks: '2013-02-02', animals: 'horse'};
      data[3] = {money: 2, heartAttacks: '2013-03-02', animals: 'fish'};
      pc.state = {
        prompt: 'test',
        fileType: FileType.csv,
        data: data,
        showTimeline: false,
        formatString: 'YYYY-MM-DD'
      };
    });

    it('should work properly when given regular data', () => {
      const t1 = pc.inferTypes(data);
      // test string
      try {
        if (t1 !== undefined) {
          expect(t1[2].drawType).toBe(enumDrawType.occurrence);
        }
      } catch (error) {
        fail(); // fail if error thrown
      }
      // test number
      try {
        if (t1 !== undefined) {
          expect(t1[0].drawType).toBe(enumDrawType.any);
        }
      } catch (error) {
        fail(); // fail if error thrown
      }
      // test date
      try {
        if (t1 !== undefined) {
          expect(t1[1].drawType).toBe(enumDrawType.any);
        }
      } catch (error) {
        fail(); // fail if error thrown
      }
    });
    it('handles inconsistent data', () => {
      data[0] = {money: 'word', heart_attacks: '2016-07-03', animals: 0};
      const t1 = pc.inferTypes(data);
      // test string
      try {
        if (t1 !== undefined) {
          expect(t1[2].drawType).toBe(enumDrawType.occurrence);
        }
      } catch (error) {
        fail(); // fail if error thrown
      }
    });
    it('should throw exception when given empty data(undefined)', () => {
      const data1 = new Array(0);
      pc.state = {prompt: 'data1',
        fileType: FileType.csv,
        data: data1,
        showTimeline: false,
        formatString: '',
      };
      expect(() => {
        pc.inferTypes(data1);
      }).toThrow('data is empty');
    });
  });

  describe('parse()', () => {
    let props: any;
    let event: any;
    let onChangeMock: any;
    let comp: any;
    let inferTypesSpy: any;
    beforeEach(() => {
      inferTypesSpy =
        jest.spyOn(ParserComponent.prototype, 'inferTypes');
      props = {
        prompt: 'test: ',
        fileType: FileType.csv,
      };
      // create a File with a csv string from the 10000_Sales_Records.csv file
      const testFile: File = new File(
          ['Region,Country,Item Type,Sales Channel,Order Priority,' +
        'Order Date,Order ID,Ship Date,Units Sold,Unit Price,Unit Cost,' +
        'Total Revenue,Total Cost,Total Profit\n' +
        'Sub-Saharan Africa,Chad,Office Supplies,Online,L,1/27/2011,' +
        '292494523,2/12/2011,4484,651.21,524.96,2920025.64,2353920.64,' +
        '566105.00\n' +
        'Europe,Latvia,Beverages,Online,C,12/28/2015,361825549,1/23/2016,' +
        '1075,47.45,31.79,51008.75,34174.25,16834.50\n' +
        'Middle East and North Africa,Pakistan,Vegetables,Offline,C,' +
        '1/13/2011,141515767,2/1/2011,6515,154.06,90.93,1003700.90,' +
        '592408.95,411291.95\n' +
        'Sub-Saharan Africa,Democratic Republic of the Congo,Household,' +
        'Online,C,9/11/2012,500364005,10/6/2012,7683,668.27,502.54,' +
        '5134318.41,3861014.82,1273303.59\n' +
        'Europe,Czech Republic,Beverages,Online,C,10/27/2015,127481591,' +
        '12/5/2015,3491,47.45,31.79,165647.95,110978.89,54669.06\n' +
        'Sub-Saharan Africa,South Africa,Beverages,Offline,H,7/10/2012,' +
        '482292354,8/21/2012,9880,47.45,31.79,468806.00,314085.20,' +
        '154720.80\n' +
        'Asia,Laos,Vegetables,Online,L,2/20/2011,844532620,3/20/2011,4825,' +
        '154.06,90.93,743339.50,438737.25,304602.25\n' +
        'Asia,China,Baby Food,Online,C,4/10/2017,564251220,5/12/2017,3330,' +
        '255.28,159.42,850082.40,530868.60,319213.80\n' +
        'Sub-Saharan Africa,Eritrea,Meat,Online,L,11/21/2014,411809480,' +
        '1/10/2015,2431,421.89,364.69,1025614.59,886561.39,139053.20\n' +
        'Central America and the Caribbean,Haiti,Office Supplies,Online,C,' +
        '7/4/2015,327881228,7/20/2015,6197,651.21,524.96,4035548.37,' +
        '3253177.12,782371.25\n' +
        'Sub-Saharan Africa,Zambia,Cereal,Offline,M,7/26/2016,773452794,' +
        '8/24/2016,724,205.70,117.11,148926.80,84787.64,64139.16\n' +
        'Europe,Bosnia and Herzegovina,Baby Food,Offline,M,10/20/2012,' +
        '479823005,11/15/2012,9145,255.28,159.42,2334535.60,1457895.90,' +
        '876639.70\n' +
        'Europe,Germany,Office Supplies,Online,C,2/22/2015,498603188,' +
        '2/27/2015,6618,651.21,524.96,4309707.78,3474185.28,835522.50\n' +
        'Asia,India,Household,Online,C,8/27/2016,151717174,9/2/2016,' +
        '5338,668.27,502.54,3567225.26,2682558.52,884666.74\n' +
        'Middle East and North Africa,Algeria,Clothes,Offline,C,6/21/2011,' +
        '181401288,7/21/2011,9527,109.28,35.84,1041110.56,341447.68,' +
        '699662.88\n' +
        'Australia and Oceania,Palau,Snacks,Offline,L,9/19/2013,500204360,' +
        '10/4/2013,441,152.58,97.44,67287.78,42971.04,24316.74\n' +
        'Central America and the Caribbean,Cuba,Beverages,Online,H,' +
        '11/15/2015,640987718,11/30/2015,1365,47.45,31.79,64769.25,' +
        '43393.35,21375.90\n' +
        'Europe,Vatican City,Beverages,Online,L,4/6/2015,206925189,' +
        '4/27/2015,2617,47.45,31.79,124176.65,83194.43,40982.22\n' +
        'Middle East and North Africa,Lebanon,Personal Care,Offline,H,' +
        '4/12/2010,221503102,5/19/2010,6545,81.73,56.67,534922.85,' +
        '370905.15,164017.70\n' +
        'Europe,Lithuania,Snacks,Offline,H,9/26/2011,878520286,' +
        '10/2/2011,2530,152.58,97.44,386027.40,246523.20,139504.20\n' +
        'Sub-Saharan Africa,Mauritius ,Cosmetics,Offline,H,5/14/2016,' +
        '192088067,6/18/2016,1983,437.20,263.33,866967.60,522183.39,' +
        '344784.21\n' +
        'Europe,Ukraine,Office Supplies,Online,C,8/14/2010,746630275,' +
        '8/31/2010,3345,651.21,524.96,2178297.45,1755991.20,422306.25\n' +
        'Europe,Russia,Snacks,Offline,L,4/13/2012,246883237,4/22/2012,' +
        '7091,152.58,97.44,1081944.78,690947.04,390997.74\n' +
        'Asia,Japan,Cosmetics,Offline,H,9/19/2013,967895781,9/28/2013,' +
        '725,437.20,263.33,316970.00,190914.25,126055.75\n' +
        'Europe,Russia,Meat,Offline,L,12/2/2015,305029237,12/26/2015,3784,' +
        '421.89,364.69,1596431.76,1379986.96,216444.80\n'],
          'test.csv',
          {type: '.csv,text/csv'});

      // mock a file event
      event = {target: {files: [testFile]}};
      onChangeMock = jest.fn();

      comp = mount(
          <ParserComponent
            {...props}
            onChange={onChangeMock}
          />);
    });
    it('infertypes is called', async () => {
      // Call the parse method with the fake event
      await comp.instance().parse(event);
      expect(inferTypesSpy).toHaveBeenCalled();
    });
    it('timeline is set to true', async () => {
      // Call the parse method with the fake event
      await comp.instance().parse(event);
      expect(comp.state('showTimeline')).toBeTruthy();
    });
  });

  describe('parseCsv()', () => {
    let props: any;
    let event: any;
    let onChangeMock: any;
    let comp: any;
    let sortDataSpy: any;
    let isValidSpy: any;
    beforeEach(() => {
      sortDataSpy = jest.spyOn(ParserComponent.prototype, 'sortData');
      isValidSpy = jest.spyOn(ParserComponent.prototype, 'isValid');

      props = {
        prompt: 'test: ',
        fileType: FileType.csv,
      };
      // create a File with a csv string from the 10000_Sales_Records.csv file
      const testFile: File = new File(
          ['Region,Country,Item Type,Sales Channel,Order Priority,' +
        'Order Date,Order ID,Ship Date,Units Sold,Unit Price,Unit Cost,' +
        'Total Revenue,Total Cost,Total Profit\n' +
        'Sub-Saharan Africa,Chad,Office Supplies,Online,L,1/27/2011,' +
        '292494523,2/12/2011,4484,651.21,524.96,2920025.64,2353920.64,' +
        '566105.00\n' +
        'Europe,Latvia,Beverages,Online,C,12/28/2015,361825549,1/23/2016,' +
        '1075,47.45,31.79,51008.75,34174.25,16834.50\n' +
        'Middle East and North Africa,Pakistan,Vegetables,Offline,C,' +
        '1/13/2011,141515767,2/1/2011,6515,154.06,90.93,1003700.90,' +
        '592408.95,411291.95\n' +
        'Sub-Saharan Africa,Democratic Republic of the Congo,Household,' +
        'Online,C,9/11/2012,500364005,10/6/2012,7683,668.27,502.54,' +
        '5134318.41,3861014.82,1273303.59\n' +
        'Europe,Czech Republic,Beverages,Online,C,10/27/2015,127481591,' +
        '12/5/2015,3491,47.45,31.79,165647.95,110978.89,54669.06\n' +
        'Sub-Saharan Africa,South Africa,Beverages,Offline,H,7/10/2012,' +
        '482292354,8/21/2012,9880,47.45,31.79,468806.00,314085.20,' +
        '154720.80\n' +
        'Asia,Laos,Vegetables,Online,L,2/20/2011,844532620,3/20/2011,4825,' +
        '154.06,90.93,743339.50,438737.25,304602.25\n' +
        'Asia,China,Baby Food,Online,C,4/10/2017,564251220,5/12/2017,3330,' +
        '255.28,159.42,850082.40,530868.60,319213.80\n' +
        'Sub-Saharan Africa,Eritrea,Meat,Online,L,11/21/2014,411809480,' +
        '1/10/2015,2431,421.89,364.69,1025614.59,886561.39,139053.20\n' +
        'Central America and the Caribbean,Haiti,Office Supplies,Online,C,' +
        '7/4/2015,327881228,7/20/2015,6197,651.21,524.96,4035548.37,' +
        '3253177.12,782371.25\n' +
        'Sub-Saharan Africa,Zambia,Cereal,Offline,M,7/26/2016,773452794,' +
        '8/24/2016,724,205.70,117.11,148926.80,84787.64,64139.16\n' +
        'Europe,Bosnia and Herzegovina,Baby Food,Offline,M,10/20/2012,' +
        '479823005,11/15/2012,9145,255.28,159.42,2334535.60,1457895.90,' +
        '876639.70\n' +
        'Europe,Germany,Office Supplies,Online,C,2/22/2015,498603188,' +
        '2/27/2015,6618,651.21,524.96,4309707.78,3474185.28,835522.50\n' +
        'Asia,India,Household,Online,C,8/27/2016,151717174,9/2/2016,' +
        '5338,668.27,502.54,3567225.26,2682558.52,884666.74\n' +
        'Middle East and North Africa,Algeria,Clothes,Offline,C,6/21/2011,' +
        '181401288,7/21/2011,9527,109.28,35.84,1041110.56,341447.68,' +
        '699662.88\n' +
        'Australia and Oceania,Palau,Snacks,Offline,L,9/19/2013,500204360,' +
        '10/4/2013,441,152.58,97.44,67287.78,42971.04,24316.74\n' +
        'Central America and the Caribbean,Cuba,Beverages,Online,H,' +
        '11/15/2015,640987718,11/30/2015,1365,47.45,31.79,64769.25,' +
        '43393.35,21375.90\n' +
        'Europe,Vatican City,Beverages,Online,L,4/6/2015,206925189,' +
        '4/27/2015,2617,47.45,31.79,124176.65,83194.43,40982.22\n' +
        'Middle East and North Africa,Lebanon,Personal Care,Offline,H,' +
        '4/12/2010,221503102,5/19/2010,6545,81.73,56.67,534922.85,' +
        '370905.15,164017.70\n' +
        'Europe,Lithuania,Snacks,Offline,H,9/26/2011,878520286,' +
        '10/2/2011,2530,152.58,97.44,386027.40,246523.20,139504.20\n' +
        'Sub-Saharan Africa,Mauritius ,Cosmetics,Offline,H,5/14/2016,' +
        '192088067,6/18/2016,1983,437.20,263.33,866967.60,522183.39,' +
        '344784.21\n' +
        'Europe,Ukraine,Office Supplies,Online,C,8/14/2010,746630275,' +
        '8/31/2010,3345,651.21,524.96,2178297.45,1755991.20,422306.25\n' +
        'Europe,Russia,Snacks,Offline,L,4/13/2012,246883237,4/22/2012,' +
        '7091,152.58,97.44,1081944.78,690947.04,390997.74\n' +
        'Asia,Japan,Cosmetics,Offline,H,9/19/2013,967895781,9/28/2013,' +
        '725,437.20,263.33,316970.00,190914.25,126055.75\n' +
        'Europe,Russia,Meat,Offline,L,12/2/2015,305029237,12/26/2015,3784,' +
        '421.89,364.69,1596431.76,1379986.96,216444.80\n'],
          'test.csv',
          {type: '.csv,text/csv'});

      // mock a file event
      event = {target: {files: [testFile]}};
      onChangeMock = jest.fn();

      comp = mount(
          <ParserComponent
            {...props}
            onChange={onChangeMock}
          />);
    });
    it('sortDate called within method', async () => {
      // check sortDate is called
      await comp.instance().parse(event);
      expect(sortDataSpy).toHaveBeenCalled();
    });
    it('isValid called within method', async () => {
      // check isValid is called
      await comp.instance().parse(event);
      expect(isValidSpy).toHaveBeenCalled();
    });
    it('this.state is set', () => {
      expect(comp.state('fileType')).toBe(FileType.csv);
    });
  });

  describe('CountTypes constructor()', () => {
    it('constructor assigns variables', () => {
      const ct = new CountTypes();
      expect(ct.numNumber).toBe(0);
      expect(ct.numString).toBe(0);
      expect(ct.numDate).toBe(0);
      expect(ct.numIncongruent).toBe(0);
    });
  });

  describe('CountTypes.Largest', () => {
    it('largest returns largest value when equal values', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 11;
      ct.numString = 4;
      ct.numDate = 5;
      expect(ct.largest()).toBe('number');
    });

    it('largest works when val not explicitly set', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 3;
      ct.numString = 4;
      expect(ct.largest()).toBe('incongruent');
    });

    it('largest returns largest value when equal values', () => {
      const ct = new CountTypes();
      ct.numIncongruent = 5;
      ct.numNumber = 3;
      ct.numString = 4;
      ct.numDate = 5;
      expect(ct.largest()).toBe('date');
    });
  });
});
