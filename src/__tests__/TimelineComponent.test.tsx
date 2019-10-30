import React, {ReactDOM} from 'react';
import {mount, shallow} from 'enzyme';
import ParserComponent from '../components/ParserComponent';
import TimelineComponent from '../components/TimelineComponent';
import {TimelineState} from '../components/TimelineInterface';
import sinon from 'sinon';
import Data from "../components/Data";

describe('<TimelineComponent /> renders correctly', () => {
  it('renders empty component', () => {
    // stuff to fake a Data object :)
    const arr: object[] = [];
    const fakeData: Data = new Data('path', arr, undefined);
    const emptyTL = <div><div id="svgtarget"/></div>;

    const comp = shallow(
        <TimelineComponent
          data={fakeData}
        />);

    expect(comp.contains(emptyTL)).toBeTruthy();
  });
});

// To be used by developers
describe('<TimelineComponent /> Unit Tests', () => {
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
