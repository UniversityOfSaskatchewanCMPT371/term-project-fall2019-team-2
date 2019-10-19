import React from 'react';
import TimelineInterface, {TimelineState} from "./TimelineInterface";
import * as d3 from 'd3';


function log(str: string) {
    console.log(str);
}

export default class TimelineComponent extends React.Component<TimelineInterface, TimelineState>{

    constructor(props: TimelineInterface){
        super(props);
        this.state = {
            data: props.data,
            width: window.innerWidth,
            height: window.innerHeight,
            marginTop: 40,
            marginBottom: 100,
            marginLeft: 40,
            marginRight: 20,
        };

        this.drawTimeline = this.drawTimeline.bind(this);
    }

    componentDidMount(): void {
        this.drawTimeline();
    }

    render() {
        return (
            <div>
                <div id="svgtarget">
                </div>
            </div>
        );
    }

    drawTimeline() {

        let barWidth = 50;
        let barBuffer = 1;
        let numBars = Math.floor(this.state.width / barWidth)
            + barBuffer;//small pixel buffer to ensure smooth transitions
        let dataIdx = 0;
        let deltaX = 0;
        let scale = 1;
        let xColumn = "Order Date";
        let yColumn = "Units Sold";
        let height = this.state.height - (this.state.marginBottom + this.state.marginTop)
        let csvData = this.state.data.arrayOfData;
        let data: Array<object> = csvData.slice(0, numBars);
        // @ts-ignore
        let ordinals = data.map(d => d[xColumn]);

        let x = d3.scaleLinear()
            .domain([0, ordinals.length])
            .rangeRound([0, this.state.width]);

        let y = d3.scaleLinear()
            .domain([d3.min(csvData,
                (d) => {
                    // @ts-ignore
                    return d[yColumn];}),
                d3.max(csvData, (d) => {
                    // @ts-ignore
                    return d[yColumn];
                })])
            .range([height, 0]);


        // create a tooltip
        let Tooltip = d3.select("#svgtarget")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .attr('target', null)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // Three function that change the tooltip when user hover / move / leave a cell
        let ttover = function (d: any) {
            log(d3.event);

            if(d3.event.buttons === 0)
            {
                Tooltip = d3.select("#svgtarget")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .attr('target', null)
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
                    .style('left', (d3.event.x + 70) + "px")
                    .style('top', d3.event.y + "px");

                let keys = Object.keys(d);
                let tooltip = "";
                keys.forEach(function (key) {
                    tooltip += "<strong>" + key + "</strong> <span style='color:red'>" + d[key] + "</span>" + "<br/>";
                });

                Tooltip.html(tooltip)
                    .style("opacity", 1);
            }
        };

        function ttUpdatePos(xPos: number, yPos: number) {
            Tooltip.style("left", (xPos + 70) + "px")
                .style("top", (yPos + "px"));
        }

        let ttmove = function (d: any) {
            //log(d3.event);
            //log(d3.mouse(this));
            //event is a mouseEvent
            ttUpdatePos(d3.event.x, d3.event.y);
            // Tooltip.style("left", (d3.mouse(this)[0] + 70) + "px")
            //     .style("top", (d3.mouse(this)[1]) + "px");
        };

        let ttleave = function (d: any) {
            //delete all tooltips
            if(d3.event.buttons === 0){
                d3.selectAll('.tooltip').remove();
            }
        };

        const extent: [[number, number], [number, number]]
            = [[this.state.marginLeft, this.state.marginTop],
            [this.state.width - this.state.marginRight,
                height - this.state.marginTop]];

        let zoom = d3.zoom()
            .scaleExtent([1, 20]) //zoom range
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", updateChart);


        let svg = d3.select("#svgtarget")
            .append("svg")
            .attr("width", this.state.width)
            .attr("height", height + this.state.marginTop + this.state.marginBottom)
            // @ts-ignore
            .call(zoom)
            .append("g")
            .attr("transform", "translate(" + this.state.marginLeft
                + "," + this.state.marginTop + ")");

        svg.append('rect')
            .attr("width", this.state.width)
            .attr("height", height)
            .style('fill', 'none');

        svg.append('defs')
            .append('clipPath')
            .attr('id', 'barsBox')
            .append('rect')
            .attr('width', this.state.width)
            .attr('height', height + this.state.marginTop + this.state.marginBottom)
            .attr('x', 0)
            .attr('y', 0);


        //Create layers in order so that the bars will disapear under the axis
        let barsLayer = svg
            .append('g')
            .attr("clip-path", "url(#barsBox)")
            .append('g')
            .attr('id', 'barsLayer')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        let axisLayer = svg.append('g')
            .attr('id', 'axisLayer');

        //y axis
        let yAxis = axisLayer.append("g")
            .style('color', 'red')
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('color', 'red')
            .text("yColumn");

        //Create bars
        let plot = barsLayer.append("g")
            .attr('class', 'plot')
            .attr("id", "bars");

        let bars = plot.selectAll(".bar")
            .data(data, function (d: any) {
                // @ts-ignore
                return d ? d.index : this.id;
            });

        updateBars();

        //x axis
        let xAxis = barsLayer.append("g")
            .attr('id', 'xaxis')
            .style('color', 'red')
            .attr("class", "x axis")
            //.attr('y', height)
            .attr("transform", "translate(0,"
                + height + ")")
            .call(d3.axisBottom(x).tickFormat(function (d) {
                // @ts-ignore
                return ordinals[d];//now for 0 it will return 'a' for 1 b and so on...
            }))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        function updateChart() {
            log('updateChart');
            log(d3.event);
            // recover the new scale

            scale = d3.event.transform.k;
            let newX = d3.event.transform.rescaleX(x);
            let newY = d3.event.transform.rescaleY(y);
            yAxis.call(d3.axisLeft(newY));

            d3.selectAll(".bar")
                .attr("x", (d, i) => scale * barWidth * (i + dataIdx))
                .attr("width", scale * barWidth);

            if(d3.event.sourceEvent.type ===  "mousemove") {
                dragged();
            }
            moveChart();
        }

        function updateBars() {
            plot.selectAll(".bar")
                .data(data, function (d: any) {
                    return d.index;
                })
                .join(
                    (enter: any) => enter.append('rect')
                        .attr("class", "bar")
                        .attr("x", (d: any, i: number) =>
                            (scale * barWidth * (i + dataIdx)))
                        .attr("width", scale * barWidth)
                        .attr("y", (d: any) => y(d[yColumn]))
                        .attr("height", (d: any) => {
                            let newHeight = (height - y(d[yColumn]));
                            if (newHeight < 0) {
                                console.log("Bad height: " + d[yColumn]);
                                return 0;
                            } else {
                                return (height - y(d[yColumn]));
                            }
                        })
                        .on('mouseover', ttover)
                        .on('mousemove', ttmove)
                        .on('mouseleave', ttleave),

                    (update: d3.Selection<d3.BaseType, object,
                        SVGGElement, unknown> | undefined) => update,

                    (exit: { remove: () => void; }) => exit.remove()
                );
        }

        function moveChart(this: any) {
            d3.select('#barsLayer')
                .attr("transform", (d) => {
                    return `translate(${deltaX},0)`
                });

            dataIdx = Math.floor(-deltaX / (scale * barWidth));
            data = csvData.slice(dataIdx, numBars + dataIdx);

            updateBars();
        }

        function dragstarted(this: any) {
            log("dragging");
            let drag = d3.select(this);
            drag.raise()
                .classed("active", true);
        }

        let perfTotal = 0;
        let perfIdx = 0;

        function dragged() {
            log(d3.event);
            ttUpdatePos(d3.event.sourceEvent.x, d3.event.sourceEvent.y);
            //ttmove(d);
            let t1 = performance.now();
            deltaX += d3.event.sourceEvent.movementX;
            if (deltaX > 0) {
                deltaX = 0;
            }

            moveChart();

            var t2 = performance.now();
            perfTotal += (t2 - t1);
            perfIdx++;
            //log(x.bandwidth(barWidth));
            console.log("Speed: " + (perfTotal / perfIdx) + "ms");
            //console.log(dataIdx);
        }

        function dragended(this: any) {
            d3.select(this).classed("active", false);
        }
    }
}
