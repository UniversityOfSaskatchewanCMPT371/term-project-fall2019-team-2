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
import IntervalOccurrence
  from '../components/TimelineTypes/IntervalOccurrence';
import TimelineModel
  from '../components/TimelineModel';
import TimelineTypeInterface
  from '../components/TimelineTypes/TimelineTypeInterface';

describe('<IntervalMagnitude /> Unit Tests', () => {
  let data: any;
  let wrapper: any;
  let drawSpy: any;
  let getDataSpy: any;
  let applyZoomSpy: any;
  let drawLabelsSpy: any;
  let getTickTranslateSpy: any;
  let m: any;
  let timelineType:any;

  beforeEach(() => {
    // data array
    data = new Data('path/to/file', [
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

    m = new TimelineModel();
    timelineType = new IntervalMagnitude(m);
    // Create spies
    drawSpy =
      jest.spyOn(IntervalOccurrence.prototype, 'draw');
    getDataSpy =
      jest.spyOn(IntervalOccurrence.prototype, 'getData');
    applyZoomSpy =
      jest.spyOn(IntervalOccurrence.prototype, 'applyZoom');
    drawLabelsSpy =
      jest.spyOn(IntervalOccurrence.prototype, 'drawLabels');
    getTickTranslateSpy =
      jest.spyOn(IntervalOccurrence.prototype, 'getTickTranslate');


    // We have to mount the wrapper once to get the html it will generate in
    // it's render method
    wrapper = mount(
        <TimelineComponent
          data={data}/>);

    // Because d3 needs to manipulate the DOM, we need to bind the html produced
    // by the TimelineComponent to the current browser window so that the d3
    // functions have something to manipulate.
    document.body.innerHTML = wrapper.html();

    // Unforuntately, the wrapper must be mounted again so that the test cases
    // will have a blank slate to work with.
    wrapper = mount(
        <TimelineComponent
          data={data}
        />);
    wrapper.timeLineTypeInterface = timelineType;
  });

  //  draw
  describe( 'draw()', () => {
    it('checks that is working as expected', ()=> {
      wrapper.instance().drawEventMagnitude();
      expect(drawSpy).toHaveBeenCalled();
    });
  });
  //  getData
  describe( 'getData()', () => {
    it('checks that is working as expected', ()=> {

    });
  });
  //    Apply zoom
  describe( 'applyZoom()', () => {
    // zoom in events for keydown & keyup
    const zoomInEventDown = new KeyboardEvent('keydown', {'key': '+'});
    const zoomInEventUp = new KeyboardEvent('keyup', {'key': '+'});
    // zoom out events for keydown & keyup
    const zoomOutEventDown = new KeyboardEvent('keydown', {'key': '-'});
    const zoomOutEventUp = new KeyboardEvent('keyup', {'key': '-'});

    it('timeline drawer handles new zoom', async () => {
      wrapper.instance().drawTimeline();
      // zoom in so that we can see if zooming back out works
      document.body.dispatchEvent(zoomInEventDown);
      document.body.dispatchEvent(zoomInEventUp);
      expect(wrapper.instance().getScale()).toBeGreaterThan(1.0);
      // zoom back out
      document.body.dispatchEvent(zoomOutEventDown);
      document.body.dispatchEvent(zoomOutEventUp);
      expect(wrapper.instance().getScale()).toBe(1.0);
    });
    it('checks that is working as expected', ()=> {

    });
  });
  //    Draw labels
  describe( 'drawLabels()', () => {
    it('checks that is working as expected', ()=> {
      wrapper.instance().drawTimeline();
      expect(drawLabelsSpy).toHaveBeenCalled();
    });
  });
  //    getTickTranslation
  describe( 'getTickTranslation()', () => {
    it('checks that is working as expected', ()=> {

    });
  });
});
