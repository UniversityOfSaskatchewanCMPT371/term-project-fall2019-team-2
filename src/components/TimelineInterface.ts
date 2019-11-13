import Data from './Data';

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

    toggleTimeline: number;
    // Prompt for toggle button
    togglePrompt: string;

    xColumn: string;
    xColumn2: string;
    yColumn: string;

    loading: boolean;
    view: string;
}
