
/**
 * an enum to help track which chart is being displayed
 */
import Column
  from "./Column";

import {ViewType} from "./TimelineComponent";

export namespace TimelineModel {


  export const marginTop: number = 0;
  export const marginBottom: number = 170;
  export const marginLeft: number = 70;
  export const marginRight: number = 20;

  // Zooming and Panning using the keyboard
  // 10% zoomed out
  export const scaleZoomOut = 0.9;
  // 10% zoomed in
  export const scaleZoomIn = 1.1;
  // The default starting panned position
  export const deltaPan = 50;
  // The minimum possible scale
  export const scaleMin = 1.0;

  export let fullWidth: number = 0;
  export let fullHeight: number = 0;
  export let height: number = 0;
  export let width: number = 0;
  export const barWidth: number = 50;
  export const barBuffer: number = 15;
  export let numBars: number = 0;
  export let dataIdx: number = 0;
  export let deltaX: number = 0;
  export let xColumn: string;
  export let xColumn2: string;
  export let yColumn: string;
  export let xColumns: Column[];
  export let yColumns: Column[];

  export let csvData: Object[];
  export let data: Array<object>;
  // export let ordinals;
  export let minDate: any;
  export let maxDate: any;

  export let timeScale: any;
  export let x: any;
  export let y: any;

  export let extent: [[number, number], [number, number]];
  // tracks the switch statement for what should be drawn
  export let view: ViewType;
  export let plot: any;
}