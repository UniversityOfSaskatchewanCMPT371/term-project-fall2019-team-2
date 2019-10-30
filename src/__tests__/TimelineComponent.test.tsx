import React, {ReactDOM} from 'react';
import {mount, shallow, render} from 'enzyme';
import ParserComponent from '../components/TimelineComponent';
import {TimelineState} from '../components/TimelineInterface';
import sinon from 'sinon';
import TimelineComponent
  from '../components/TimelineComponent';
import Data
  from '../components/Data';


// To be used by developers
describe('<TimelineComponent /> Unit Tests', () => {
  let data: any;
  let wrapper: any;
  let drawTimelineSpy: any;

  // run to initialize the Timeline component for testing
  beforeEach(() => {
    data = new Data('path/to/file', [
      {'Region': 'Sub-Saharan Africa', 'Country': 'Central African Republic',
        'Item Type': 'Vegetables', 'Sales Channel': 'Online',
        'Order Priority': 'H', 'Order Date': '1/1/2010',
        'Order ID': 506209075,
        'Ship Date': '2/4/2010',
        'Units Sold': 7369, 'Unit Price': 154.06, 'Unit Cost': 90.93,
        'Total Revenue': 1135268.14, 'Total Cost': 670063.17,
        'Total Profit': 465204.97, 'index': 4535,
        'Order Date_num': 1262325600000},
      {'Region': 'Asia', 'Country': 'China', 'Item Type': 'Cereal',
        'Sales Channel': 'Online', 'Order Priority': 'C',
        'Order Date': '1/1/2010',
        'Order ID': 863776719, 'Ship Date': '2/10/2010', 'Units Sold': 9581,
        'Unit Price': 205.7, 'Unit Cost': 117.11, 'Total Revenue': 1970811.7,
        'Total Cost': 1122030.91, 'Total Profit': 848780.79, 'index': 5104,
        'Order Date_num': 1262325600000},
      {'Region': 'Europe', 'Country': 'Sweden',
        'Item Type': 'Clothes', 'Sales Channel': 'Online',
        'Order Priority': 'H',
        'Order Date': '1/2/2010', 'Order ID': 907228076,
        'Ship Date': '2/21/2010',
        'Units Sold': 7803, 'Unit Price': 109.28, 'Unit Cost': 35.84,
        'Total Revenue': 852711.84, 'Total Cost': 279659.52,
        'Total Profit': 573052.32,
        'index': 4193, 'Order Date_num': 1262412000000},
      {'Region': 'Sub-Saharan Africa', 'Country': 'Equatorial Guinea',
        'Item Type': 'Snacks', 'Sales Channel': 'Offline',
        'Order Priority': 'M',
        'Order Date': '1/2/2010', 'Order ID': 335552775,
        'Ship Date': '2/12/2010',
        'Units Sold': 6378, 'Unit Price': 152.58, 'Unit Cost': 97.44,
        'Total Revenue': 973155.24, 'Total Cost': 621472.32,
        'Total Profit': 351682.92,
        'index': 7005, 'Order Date_num': 1262412000000},
      {'Region': 'Asia',
        'Country': 'Mongolia', 'Item Type': 'Cosmetics',
        'Sales Channel': 'Offline',
        'Order Priority': 'C', 'Order Date': '1/2/2010', 'Order ID': 695167052,
        'Ship Date': '1/22/2010', 'Units Sold': 4234, 'Unit Price': 437.2,
        'Unit Cost': 263.33, 'Total Revenue': 1851104.8,
        'Total Cost': 1114939.22,
        'Total Profit': 736165.58, 'index': 9127,
        'Order Date_num': 1262412000000}]);

    drawTimelineSpy =
        jest.spyOn(TimelineComponent.prototype, 'drawTimeline');

    wrapper = mount(<TimelineComponent data={data} />);
  });

  describe('<TimelineComponent /> renders correctly', () => {
    it('dummy test', () => {
      const button = <button>Switch to Interval Timeline</button>;
      // eslint-disable-next-line max-len
      expect(wrapper.containsMatchingElement(<button>Switch to Interval Timeline</button>))
          .toEqual(true);
      expect(wrapper.exists('#svgtarget')).toEqual(true);
    });
  });

  describe('constructor()', () => {
    it('dummy test', () => {
      // const wrapper = mount(<TimelineComponent data={data} />);
      expect(wrapper.state('data')).toEqual(data);
      expect(wrapper.state('width')).toEqual(window.innerWidth);
      expect(wrapper.state('height')).toEqual(window.innerHeight);
      expect(wrapper.state('marginTop')).toEqual(40);
      expect(wrapper.state('marginBottom')).toEqual(170);
      expect(wrapper.state('marginLeft')).toEqual(40);
      expect(wrapper.state('marginRight')).toEqual(20);
      expect(wrapper.state('toggleTimeline')).toEqual(0);
      expect(wrapper.state('togglePrompt'))
          .toEqual('Switch to Interval Timeline');
    });
  });

  describe('componentDidMount()', () => {
    it('dummy test', () => {
      expect(drawTimelineSpy).toHaveBeenCalled();
    });
  });

  describe('drawTimeline()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('ttOver()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('ttUpdatePos()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('ttMove()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('ttLeave()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('updateChart()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('updateBars()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('moveChart()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('dragStarted()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('dragged()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });

  describe('dragEnded()', () => {
    it('dummy test', () => {
      // todo: devs need to write unit tests
    });
  });
});
