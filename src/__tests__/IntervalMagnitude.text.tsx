import React from 'react';
import {
  mount
} from 'enzyme';
import * as d3
  from 'd3';
import TimelineComponent
, {ViewType} from '../components/TimelineComponent';
import Data
  from '../components/Data';
import Column
  from '../components/Column';
import IntervalMagnitude
  from '../components/TimelineTypes/IntervalMagnitude';
import {deflateRaw} from 'zlib';

describe('<IntervalMagnitude /> Unit Tests', () => {
  // sample data for Timeline component
  const data: Data = new Data('path/to/file', [
    {
      'Region': 'North America',
      'Country': 'Central African Republic',
      'Item Type': 'Vegetables',
      'Sales Channel': 'Online',
      'Order Priority': 'H',
      'Order Date': '1/1/2010',
      'Order ID': 506209075,
      'Ship Date': '2/4/2010',
      'Units Sold': 7369,
      'Unit Price': 154.06,
      'Unit Cost': 90.93,
      'Total Revenue': 1135268.14,
      'Total Cost': 670063.17,
      'Total Profit': 465204.97,
      'index': 4535,
      'Order Date_num': 1262325600000
    },
    {
      'Region': 'North America',
      'Country': 'China',
      'Item Type': 'Cereal',
      'Sales Channel': 'Online',
      'Order Priority': 'C',
      'Order Date': '1/1/2010',
      'Order ID': 863776719,
      'Ship Date': '2/10/2010',
      'Units Sold': 9581,
      'Unit Price': 205.7,
      'Unit Cost': 117.11,
      'Total Revenue': 1970811.7,
      'Total Cost': 1122030.91,
      'Total Profit': 848780.79,
      'index': 5104,
      'Order Date_num': 1262325600000
    },
    {
      'Region': 'North America',
      'Country': 'Sweden',
      'Item Type': 'Clothes',
      'Sales Channel': 'Online',
      'Order Priority': 'H',
      'Order Date': '1/2/2010',
      'Order ID': 907228076,
      'Ship Date': '2/21/2010',
      'Units Sold': 7803,
      'Unit Price': 109.28,
      'Unit Cost': 35.84,
      'Total Revenue': 852711.84,
      'Total Cost': 279659.52,
      'Total Profit': 573052.32,
      'index': 4193,
      'Order Date_num': 1262412000000
    },
    {
      'Region': 'North America',
      'Country': 'Equatorial Guinea',
      'Item Type': 'Snacks',
      'Sales Channel': 'Offline',
      'Order Priority': 'M',
      'Order Date': '1/2/2010',
      'Order ID': 335552775,
      'Ship Date': '2/12/2010',
      'Units Sold': 6378,
      'Unit Price': 152.58,
      'Unit Cost': 97.44,
      'Total Revenue': 973155.24,
      'Total Cost': 621472.32,
      'Total Profit': 351682.92,
      'index': 7005,
      'Order Date_num': 1262412000000
    },
    {
      'Region': 'North America',
      'Country': 'Mongolia',
      'Item Type': 'Cosmetics',
      'Sales Channel': 'Offline',
      'Order Priority': 'C',
      'Order Date': '1/2/2010',
      'Order ID': 695167052,
      'Ship Date': '1/22/2010',
      'Units Sold': 4234,
      'Unit Price': 437.2,
      'Unit Cost': 263.33,
      'Total Revenue': 1851104.8,
      'Total Cost': 1114939.22,
      'Total Profit': 736165.58,
      'index': 9127,
      'Order Date_num': 1262412000000
    }],
  [
    new Column('string', 1, 'Region', 1),
    new Column('string', 1, 'Country', 1),
    new Column('string', 1, 'Item Type', 1),
    new Column('string', 1, 'Sales Channel', 1),
    new Column('string', 1, 'Order Priority', 1),
    new Column('date', 2, 'Order Date', 1),
    new Column('number', 2, 'Order ID', 1),
    new Column('date', 2, 'Ship Date', 1),
    new Column('number', 2, 'Units Sold', 1),
    new Column('number', 2, 'Unit Price', 1),
    new Column('number', 2, 'Unit Cost', 1),
    new Column('number', 2, 'Total Revenue', 1),
    new Column('number', 2, 'Total Cost', 1),
    new Column('number', 2, 'Total Profit', 1),
    new Column('number', 2, 'index', 1),
    new Column('number', 2, 'Order Date_num', 1)]);

  let wrapper: any;

  // helper function to make innerHTML more readable
  const prettyHTML = (htmlString: string) => {
    const lines: Array<string> = htmlString.split(/(?=<)/g);
    let tempString: string = '';
    for (let i: number = 0; i < lines.length; i++) {
      tempString += (lines[i] + '\n');
    }
    return tempString;
  };

  beforeEach(() => {
    // need to do this so that d3 works properly with jest/enzyme
    wrapper = mount(
        <TimelineComponent
          data={data}
        />);
    document.body.innerHTML = wrapper.html();
    wrapper = mount(
        <TimelineComponent
          data={data}
        />);
    // initialize & draw the timeline (updates html)
    wrapper.instance().resetTimeline();
  });

  //  draw
  describe( 'draw()', () => {

  });
  //  getData
  describe( 'getData()', () => {

  });
  //    Apply zoom
  describe( 'applyZoom()', () => {

  });
  //    Draw labels
  describe( 'drawLabels()', () => {

  });
  //    getTickTranslation
  describe( 'getTickTranslation()', () => {

  });
});
