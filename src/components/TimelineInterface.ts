import Data from './Data';
import {ViewType} from './TimelineComponent';
import Column
  from './Column';


interface TimelineInterface {
    data: Data;
}
export default TimelineInterface;

export interface TimelineState {
    data: Data;
    // dimensions
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    // Prompt for toggle button
    togglePrompt: string;

    xColumn: string;
    xColumn2: string;
    yColumn: string;
    yColumn2: string;

    loading: boolean;
    view: ViewType;
}

