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


// To be used by developers
describe('<TimelineComponent /> Unit Tests', () => {
  let data: any;
  let wrapper: any;
  let drawTimelineSpy: any;
  let toggleTimelineSpy: any;
  let initTimelineSpy: any;
  let updateBarsSpy: any;
  let ttOverHelperSpy: any;
  let ttOverSpy: any;
  let ttUpdatePosSpy: any;
  let ttLeaveSpy: any;
  let drawEventMagnitudeSpy: any;
  let drawIntervalMagnitudeSpy: any;

  // store original console.warn
  const originalWarn = console.warn;

  // array to store console output
  let consoleOutput: any[] = [];

  // function to receive console.warn output
  const mockedWarn = (output: any) => consoleOutput.push(output);

  // run to initialize the Timeline component for testing
  beforeEach(() => {
    console.warn = mockedWarn;

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

    // Create spies
    drawTimelineSpy =
        jest.spyOn(TimelineComponent.prototype, 'drawTimeline');
    toggleTimelineSpy =
        jest.spyOn(TimelineComponent.prototype, 'toggleTimeline');
    initTimelineSpy =
        jest.spyOn(TimelineComponent.prototype, 'initTimeline');
    updateBarsSpy =
        jest.spyOn(TimelineComponent.prototype, 'updateBars');
    ttOverHelperSpy =
        jest.spyOn(TimelineComponent.prototype, 'ttOverHelper');
    ttOverSpy =
        jest.spyOn(TimelineComponent.prototype, 'ttOver');
    ttUpdatePosSpy =
        jest.spyOn(TimelineComponent.prototype, 'ttUpdatePos');
    ttLeaveSpy =
        jest.spyOn(TimelineComponent.prototype, 'ttLeave');
    drawEventMagnitudeSpy =
        jest.spyOn(TimelineComponent.prototype, 'drawEventMagnitude');
    drawIntervalMagnitudeSpy =
        jest.spyOn(TimelineComponent.prototype, 'drawIntervalMagnitude');


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
          data={data}/>);
  });

  afterEach(() => {
    // reset consoleOutput and console.warn definition
    consoleOutput = [];
    console.warn = originalWarn;
  });

  describe('<TimelineComponent /> renders correctly', () => {
    it('checks that the timeline component renders correctly', () => {
      const button =
          <button>Switch
            to
            Interval
            Timeline</button>;
      // eslint-disable-next-line max-len
      expect(wrapper.containsMatchingElement(
          <button>Switch
            to
            Interval
            Timeline</button>))
          .toEqual(true);
      expect(wrapper.exists('#svgtarget')).toEqual(true);
    });
  });

  describe('constructor()', () => {
    it('checks that the constructor correctly sets the component state', () => {
      // Check that the component state is set correctly.
      expect(wrapper.state('data')).toEqual(data);
      expect(wrapper.state('width')).toEqual(window.innerWidth);
      expect(wrapper.state('height')).toEqual(window.innerHeight);
      expect(wrapper.state('marginTop')).toEqual(0);
      expect(wrapper.state('marginBottom')).toEqual(170);
      expect(wrapper.state('marginLeft')).toEqual(40);
      expect(wrapper.state('marginRight')).toEqual(20);
      expect(wrapper.state('togglePrompt'))
          .toEqual('Switch to Interval Timeline');
      expect(wrapper.state('view')).toEqual(ViewType.occurrence);
    });
  });

  describe('componentDidMount()', () => {
    it('checks if drawTimeline is called', () => {
      expect(initTimelineSpy).toHaveBeenCalled();
      expect(drawTimelineSpy).toHaveBeenCalled();
    });
  });

  describe('toggleTimeline()', () => {
    it('checks that the toggleTimeline function correctly sets the state ' +
        'of the component', () => {
      const button = wrapper.find('button');

      button.simulate('click');

      expect(toggleTimelineSpy).toHaveBeenCalled();
      // check that the state is set properly
      expect(wrapper.state('togglePrompt'))
          .toEqual('Switch to Occurrence Timeline');
      expect(initTimelineSpy).toHaveBeenCalled();
      expect(drawTimelineSpy).toHaveBeenCalled();
      expect(drawEventMagnitudeSpy).toHaveBeenCalled();
      expect(wrapper.state('view')).toEqual(ViewType.interval);

      button.simulate('click');

      expect(toggleTimelineSpy).toHaveBeenCalled();
      // check that the state is set properly
      expect(wrapper.state('togglePrompt'))
          .toEqual('Switch to Interval Timeline');
      expect(initTimelineSpy).toHaveBeenCalled();
      expect(drawTimelineSpy).toHaveBeenCalled();
      expect(drawIntervalMagnitudeSpy).toHaveBeenCalled();
      expect(wrapper.state('view')).toEqual(ViewType.occurrence);
    });
  });


  describe('initTimeline()', () => {
    it('checks that values are set correctly', () => {
      expect(initTimelineSpy).toHaveBeenCalled();
    });
  });

  describe('drawTimeline()', () => {
    // zoom in events for keydown & keyup
    const zoomInEventDown = new KeyboardEvent('keydown', {'key': '+'});
    const zoomInEventUp = new KeyboardEvent('keyup', {'key': '+'});
    // zoom out events for keydown & keyup
    const zoomOutEventDown = new KeyboardEvent('keydown', {'key': '-'});
    const zoomOutEventUp = new KeyboardEvent('keyup', {'key': '-'});

    it('timeline drawer handles zoom out', async () => {
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
    it('drawLabels is called', () => {
      const drawTimelineSpy = jest.spyOn(TimelineComponent.prototype,
          'drawTimeline');
      wrapper.instance().drawTimeline();
      expect(drawTimelineSpy).toHaveBeenCalled();
    });

    it('timeline drawer handles zoom in', () => {
      wrapper.instance().drawTimeline();
      expect(wrapper.instance().getScale()).toBe(1.0);
      document.body.dispatchEvent(zoomInEventDown);
      document.body.dispatchEvent(zoomInEventUp);
      expect(wrapper.instance().getScale()).toBeGreaterThan(1.0);
    });

    it('timeline drawer handles pan right', () => {
      wrapper.instance().drawTimeline();
      const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
      document.body.dispatchEvent(event);

      expect(wrapper.instance().getDeltaX()).toBeLessThan(0);
    });

    it('timeline drawer handles pan left', () => {
      wrapper.instance().drawTimeline();
      let event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
      document.body.dispatchEvent(event);
      event = new KeyboardEvent('keyup', {'key': 'ArrowRight'});
      document.body.dispatchEvent(event);

      expect(wrapper.instance().getDeltaX()).toBeLessThan(0);
      event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
      document.body.dispatchEvent(event);
      event = new KeyboardEvent('keyup', {'key': 'ArrowRight'});
      document.body.dispatchEvent(event);

      expect(wrapper.instance().getDeltaX()).toBe(0);
    });

    it('timeline drawer does not zoom out too far', () => {
      wrapper.instance().drawTimeline();
      const event = new KeyboardEvent('keydown', {'key': 's'});
      document.body.dispatchEvent(event);

      // Should stay at 1
      expect(wrapper.instance().getScale()).toBe(1.0);
    });

    it('timeline drawer does not pan too far left', () => {
      wrapper.instance().drawTimeline();
      const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
      document.body.dispatchEvent(event);

      // Should stay at 0 (the min)
      expect(wrapper.instance().getDeltaX()).toBe(0);
    });
  });

  describe('ttOver()', () => {
    it('checks that ttOver throws an error if it is called on the ' +
        'incorrect type of event', () => {
      expect(() => {
        wrapper.instance().ttOver(null);
      }).toThrow();
      expect(ttOverSpy).toHaveBeenCalled();
    });
  });

  describe('ttUpdatePos()', () => {
    it('checks that ttUpdatePos does not break when no tooltip exists'
        , () => {
          wrapper.instance().ttOverHelper({
            str: 'test',
            num: 123,
          }, 100, 100);
          expect(ttOverHelperSpy).toHaveBeenCalled();

          expect(!d3.selectAll('.tooltip').empty()).toEqual(true);

          wrapper.instance().ttUpdatePos(100, 100);
          expect(ttUpdatePosSpy).toHaveBeenCalled();
        });
  });

  describe('ttLeave()', () => {
    it('dummy test', () => {
      wrapper.instance().ttLeave();
      expect(ttLeaveSpy).toHaveBeenCalled();
    });
  });

  describe('updateChart()', () => {
    it('checks to see if the updateChart function is working as expected',
        async () => {
          await new Promise((res) => setTimeout(() => {
            wrapper.update();
            // console.log(wrapper.html());
            expect(initTimelineSpy).toHaveBeenCalled();
            wrapper.instance().updateChart();
            // expect(consoleOutput[0]).toEqual('d3.event was null');
            wrapper.setState({toggleTimeline: 1});
            expect(wrapper.state('toggleTimeline')).toBe(1);
            wrapper.instance().updateChart();
            // expect(consoleOutput[1]).toEqual('d3.event was null');
            res(true);
          }, 1000));
        });
  });
  describe('drawEventMagnitude()', () => {
    it('dummy test', () => {
      wrapper.instance().drawEventMagnitude(d3.selectAll('.bar'));
      expect(drawEventMagnitudeSpy).toHaveBeenCalled();
    });
  });
  describe('updateBars()', () => {
    it('dummy test', () => {
      expect(drawTimelineSpy).toHaveBeenCalled();
      expect(updateBarsSpy).toHaveBeenCalled();
      console.log(document.body.innerHTML);
      // console.log(wrapper.)
      expect(d3.selectAll('.line.pin').size()).toBe(5);
      wrapper.instance().drawIntervalMagnitude(d3.selectAll('.bar'));
      expect(drawIntervalMagnitudeSpy).toHaveBeenCalled();
      //
    });
  });

  describe('Change Column', () => {
    it('Checks that data is sorted and re-drawn when a column ' +
        'dropdown is selected', () => {
      console.log(wrapper.find('select').at().debug());
      wrapper.find('#ySelect').first()
          .simulate('change', {target: {value: 'Unit Price'}});

      wrapper.find('#xSelect').first()
          .simulate('change', {target: {value: 'Units Sold'}});

      wrapper.find('#xSelect').first()
          .simulate('change', {target: {value: 'Ship Date'}});

      wrapper.find('#x2Select').first()
          .simulate('change', {target: {value: 'Order Date'}});

      expect(updateBarsSpy).toHaveBeenCalled();
    });
  });

  describe('updateBars()', () => {
    it('dummy test', () => {
      expect(updateBarsSpy).toHaveBeenCalled();
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
