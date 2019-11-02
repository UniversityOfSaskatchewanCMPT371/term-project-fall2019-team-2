import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent, {CountTypes} from '../components/ParserComponent';
import ParserInterface, {FileType} from '../components/ParserInterface';
import {enumDrawType} from '../components/Column';
import {Simulate} from 'react-dom/test-utils';
// import mouseOut = Simulate.mouseOut;

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

describe('Csv FileEvents processed correctly', () => {
  const props = {
    prompt: 'test: ',
    fileType: FileType.csv,
  };

  it('Onchange event triggered when file selected', async () => {
    const onChangeMock = jest.fn();
    const testFile: File = new File(
        [''],
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

  describe('Incompatible File types not accepted', () => {
    const onChangeMock = jest.fn((x: File) => x.name);
    const comp = mount(
        <ParserComponent
          {...props}
          onChange={onChangeMock}
        />
    );

    beforeEach(() => {
      onChangeMock.mockClear();
      comp.setState({data: []});
    });

    xit('.pdf rejected', async () => {
      const pdfTestFile: File = new File(
          ['test'],
          'test.pdf',
          {type: '.pdf,application/pdf'},
      );
      const fileEvent = {target: {files: [pdfTestFile]}};
      // expect(
      //     comp
      //         .find('input')
      //         .simulate('change', fileEvent)
      // ).toThrowError();
    });

    it('.txt rejected', async () => {
      const txtTestFile: File = new File(
          ['abcdefg'],
          'test.txt',
          {type: '.txt, text/plain'},
      );
      const fileEvent = {target: {files: [txtTestFile]}};
      comp.find('input').simulate('change', fileEvent);
      await onChangeMock;
    });

    xit('.doc rejected', async () => {
      const docTestFile: File = new File(
          [''],
          'test.doc',
          {type: '.doc, application/msword'},
      );
      const fileEvent = {target: {files: [docTestFile]}};
      comp.find('input').simulate('change', fileEvent);
    });

    xit('.css rejected', async () => {
      const cssTestFile: File = new File(
          [''],
          'test.css',
          {type: '.css, text/css'},
      );
      const fileEvent = {target: {files: [cssTestFile]}};
      comp.find('input').simulate('change', fileEvent);
    });

    xit('.js rejected', async () => {
      const jsTestFile: File = new File(
          ['abcdefg'],
          'test.js',
          {type: '.js, text/javascript'},
      );
      const fileEvent = {target: {files: [jsTestFile]}};
      comp.find('input').simulate('change', fileEvent);
    });
  });
});

// To be used by the developers
describe('<ParserComponent /> Unit Tests', () => {
  describe('constructor()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('componentDidMount()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('isValid()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('sortData()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
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
      // @ts-ignore
      pc.state = {
        prompt: 'test',
        fileType: FileType.csv,
        data: data,
      };
    });

    it('handles regular data', () => {
      const t1 = pc.inferTypes(data);
      // test string
      expect(t1[2].drawType).toBe(enumDrawType.occurrence);
      // test number
      expect(t1[0].drawType).toBe(enumDrawType.any);
      // test date
      // expect(t1[1].drawType).toBe(enumDrawType.any);
    });
    it('handles inconsistent data', () => {
      data[0] = {money: 'word', heart_attacks: '2016-07-03', animals: 0};
      const t1 = pc.inferTypes(data);
      // test string
      expect(t1[2].drawType).toBe(enumDrawType.occurrence);
    });
  });

  describe('parse()', () => {
    it('dummy test', async () => {
      const props = {
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
      const event = {target: {files: [testFile]}};
      const onChangeMock = jest.fn();

      const comp: any = mount(
          <ParserComponent
            {...props}
            onChange={onChangeMock}
          />);

      // Call the parse method with the fake event
      await comp.instance().parse(event);
    });
  });

  describe('parseCsv()', () => {
    it('dummy test', async () => {

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
