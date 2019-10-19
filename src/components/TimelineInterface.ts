import Data from './Data';

interface TimelineInterface {
    data: Data;
}
export default TimelineInterface;

export interface TimelineState {
    data: Data;

    //dimensions
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}