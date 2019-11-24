import TimelineModel from '../TimelineModel';


interface TimelineTypeInterface {
    m: TimelineModel;
    draw(selection: any, ttOver: any, ttMove: any, ttLeave: any): void;
    getData(): void;
    applyZoom(): void;
    drawLabels(svg: any): void;
}

export default TimelineTypeInterface;

// class EventOccurrence
// class IntervalOccurrence
