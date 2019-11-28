/**
 * an enum to help track which chart is being displayed
 */
import Column
  from './Column';

import {ViewType} from './TimelineComponent';

/**
 * Purpose: this class is used to store the variables necessary for the
 * TimelineComponent to render timelines. The primary purpose of this class is
 * to allow for greater modularity in the TimelineComponent.
 */
export default class TimelineModel {
  public marginTop: number = 0;
  public marginBottom: number = 170;
  public marginLeft: number = 70;
  public marginRight: number = 20;

  // Zooming and Panning using the keyboard
  // 10% zoomed out
  public scaleZoomOut = 0.9;
  // 10% zoomed in
  public scaleZoomIn = 1.1;
  // The default starting panned position
  public deltaPan = 50;
  // The minimum possible scale
  public scaleMin = 1.0;
  // The current scale
  public scale = 1.0;

  public fullWidth: number = 0;
  public fullHeight: number = 0;
  public height: number = 0;
  public width: number = 0;
  public barWidth: number = 50;
  public barBuffer: number = 15;
  public numBars: number = 0;
  public dataIdx: number = 0;
  public deltaX: number = 0;
  public xColumn: string;
  public xColumn2: string;
  public yColumn: string;
  public yColumn2: string;
  public xColumns: Column[];
  public yColumns: Column[];
  public columns: Column[];

  public csvData: Object[];
  public data: Array<object>;
  // public  ordinals;
  public minDate: any;
  public maxDate: any;

  public timeScale: any;
  public x: any;
  public y: any;

  public extent: [[number, number], [number, number]];
  // tracks the switch statement for what should be drawn
  public view: ViewType;
  public plot: any;

  /**
   * Purpose: constructor with default values based on our current layout.
   */
  constructor() {
    this.marginTop = 0;
    this.marginBottom = 170;
    this.marginLeft = 70;
    this.marginRight = 20;

    this.scaleZoomOut = 0.9;
    this.scaleZoomIn = 1.1;
    this.deltaPan = 50;
    this.scaleMin = 1.0;
    this.scale = 1.0;

    this.fullWidth = 0;
    this.fullHeight = 0;
    this.height = 0;
    this.width = 0;
    this.barWidth = 50;
    this.barBuffer = 15;
    this.numBars = 0;
    this.dataIdx = 0;
    this.deltaX = 0;
    this.xColumn = '';
    this.xColumn2 = '';
    this.yColumn = '';
    this.yColumn2 = '';
    this.xColumns = [];
    this.yColumns = [];
    this.columns = [];

    this.csvData = [];
    this.data = [];

    this.extent = [[0, 0], [0, 0]];
    this.view = ViewType.EventMagnitude;
  }
}
