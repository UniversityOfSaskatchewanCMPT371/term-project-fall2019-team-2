import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import * as d3 from "d3";
import {Container} from "reactstrap";
import d3tip from "d3-tip";
import './D3Timeline.css';
import * as d3drag from "d3-drag";


function r50() {
    return Math.floor(Math.random() * 2);
}

//50/50 chance of returning 1 or -1
function pn() {
    return (r50() == 1 ? 1 : -1);
}

function randInts(n) {
    let rets = [];
    for (let i = 0; i < n; i++) {
        rets.push(Math.floor((Math.random() * 100)) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
    }
    return rets;
}

function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    return {
        'r': r,
        'g': g,
        'b': b
    };
    //return "rgb(" + r + "," + g + "," + b + "," + a + ")";
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


export class D3Timeline extends Component {
    static displayName = D3Timeline.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [12, 5, 6, 6, 9, 10],
            width: 1000,
            height: 1000,
            id: "D3Timeline"
        };
        this.d3csv = this.d3csv.bind(this);
    }

    componentDidMount() {
        //this.drawChart();
    }

    drawBars() {
        let barWidth = 50;
        let numBars = 20;
        let frameSize = barWidth * numBars;
        let csvData = this.state.csvData.slice(4500);
        let data = [];
        let dataIdxMin = 0;
        let dataIdxMax = 20;
        data.push(csvData.slice(dataIdxMin, dataIdxMax));
        console.log(data);

        let margin = {top: 40, right: 20, bottom: 100, left: 40},
            width = 960 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        let x = d3.scaleBand()
            .domain(csvData.slice(0, 2000).map(function (d) {
                return d.Date;
            }))
            .rangeRound([0, csvData.slice(0, 2000).length * barWidth]);

        let y = d3.scaleLinear()
            .domain([d3.min(csvData, (d) => {
                return d.Temp;
            }),
                d3.max(csvData, (d) => {
                    return d.Temp;
                })])
            .range([height, 0]);

        let xAxis = d3.axisBottom(x);
        let yAxis = d3.axisLeft(y);

        let tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Date:</strong> <span style='color:red'>" + d.Date + "</span>" +
                    "<br /><strong>Temp:</strong> <span style='color:red'>" + d.Temp + "</span>";
            });

        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        //x.domain(data.map(function(d) { return Date.parse(d.Date); }));

        let clip = svg.append('defs')
            .append('clipPath')
            .attr('id', 'barsBox')
            .append('rect')
            .attr('width', width)
            .attr('height', height + margin.top + margin.bottom)
            .attr('x', 0)
            .attr('y', 0);

        //Create layers in order so that the bars will disappear under the axis
        let barsLayer = svg.append('g')
            .attr("clip-path", "url(#barsBox)")
            .append('g')
            .attr('id', 'barsLayer');

        let axisLayer = svg.append('g')
            .attr('id', 'axisLayer');

        axisLayer.append("g")
            .style('color', 'red')
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('color', 'red')
            .text("Temp");

        //Create bars
        barsLayer.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        let barFrame = barsLayer.append("g")
            .attr('class', 'plot barFrame')
            .attr("id", "bars");

        let bars = barFrame.selectAll(".bar")
            .data(data[0])
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => barWidth * i)
            .attr("width", barWidth)
            .attr("y", d => y(d.Temp))
            .attr("height", d => (height - y(d.Temp)))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //bars.exit().remove();

        barsLayer.append("g")
            .attr('id', 'xaxis')
            .style('color', 'red')
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        let barsX = 0;
        let inc = 1000;
        let dataIdx = 0;

        let deltaX = 0;

        function dragstarted(d) {
            let drag = d3.select(this);

            drag.raise()
                .classed("active", true);
        }

        function dragged(d) {
            //console.log(d);
            //console.log(d3.event);
            deltaX += d3.event.sourceEvent.movementX;
            if (deltaX > 0) {
                deltaX = 0;
            }
            d3.select(this)
                .transition()
                //.ease(d3.easeLinear)
                .attr("transform", (d) => {
                    return `translate(${deltaX},0)`
                });
            //console.log("deltaX: " + deltaX);
            //.attr("transform", (d) => {return `translate(${d3.event.x + deltaX},0)`});
            //d3.select(this).attr("transform", (d) => {return `translate(${d3.event.sourceEvent.movementX},0)`})
            //.attr("x", d3.event.x)
            //.attr("y", d3.event.y);
        }

        function dragended(d) {
            d3.select(this).classed("active", false);
        }

        setInterval(function () {
            if (-deltaX != 0) {

                let barFrames = d3.selectAll('.barFrame');
                let leftXs = [];
                let min = 0;
                let max = 0;
                console.log(barFrames);

                barFrames.each(function (d, i) {
                    leftXs.push(parseInt(d3.select(this).select('.bar').attr('x')));
                });

                min = d3.min(leftXs, function (leftX) {
                    return leftX;
                });

                max = d3.max(leftXs, function (leftX) {
                    return leftX;
                });

                //remove left frame
                if (Math.abs(min - Math.abs(deltaX)) > frameSize) {

                    data.shift();
                }

                if ((max - -deltaX) < frameSize) {
                    data.push(csvData.slice(dataIdxMax, dataIdxMax + numBars));

                    barsLayer.append("g")
                        .attr('class', 'plot barFrame')
                        .attr("id", "bars")
                        .selectAll(".bar")
                        .data(data[data.length - 1])
                        .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("x", (d, i) => (barWidth * i) + (dataIdxMax * barWidth))
                        .attr("width", barWidth)
                        .attr("y", d => y(d.Temp))
                        .attr("height", d => (height - y(d.Temp)))
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    dataIdxMax += numBars;
                }

                d3.selectAll('.barFrame').filter(function (d, i) {
                    let minx = parseInt(d3.select(this).select('.bar').attr('x'));
                    return (minx < -deltaX) && (Math.abs(-deltaX - minx) > frameSize);
                }).remove();
                //
                // //remove right frame
                // if(Math.abs(max - Math.abs(deltaX)) > frameSize) {
                //     barFrames[barFrames.length-1].remove();
                //     data.pop();
                // }

                console.log(leftXs);
            }
        }, 1000);

        // setInterval(function () {
        //     let lbars = d3.selectAll('.bar');
        //     let rng = [];
        //
        //     lbars.filter(function (d, i) {
        //         let x = parseInt(d3.select(this).attr('x'));
        //         let result = (x < -((numBars * barWidth) + deltaX))
        //             || (x > ((numBars * barWidth * 2) + -(deltaX)));
        //
        //         //remove the element if it is more than one frame to the left of the current position
        //         if (x < -((numBars * barWidth) + deltaX)) {
        //             dataIdx++;
        //             //remove element from data array
        //             data.splice(i, 1);
        //             console.log("dataIdx: " + dataIdx);
        //             console.log("Removing bar at: " + x);
        //         }
        //         //remove the element if it is more than one frame to the right of the current position
        //         else if(x > ((numBars * barWidth * 2) + -(deltaX))){
        //             dataIdx--;
        //             //remove element from data array
        //             data.splice(i, 1);
        //             console.log("dataIdx: " + dataIdx);
        //             console.log("Removing bar at: " + x);
        //         }
        //         else {
        //             rng.push(x);
        //         }
        //         return result;
        //     }).remove();
        //
        //
        //     // lbars.each(function (d, i) {
        //     //     rng.push(parseInt(d3.select(this).attr('x')));
        //     // });
        //     let min = d3.min(rng, function(r) {
        //         return r;
        //     });
        //
        //     let max = d3.max(rng, function(r) {
        //         return r;
        //     });
        //
        //     data = csvData.slice(dataIdx, 100 + dataIdx);
        //
        //     //Find how many bars need to be added to the left
        //     if((-deltaX - min) < (numBars * barWidth))
        //     {
        //         let leftBars = Math.floor((-deltaX - min) / barWidth);
        //
        //         for(let i = 0; i < leftBars; i++)
        //         {
        //             plot.data(data)
        //                 .enter()
        //                 .append("rect")
        //                 .attr("class", "bar")
        //                 .attr("x", (d, i) => barWidth * (i + dataIdx))
        //                 .attr("width", barWidth)
        //                 .attr("y", d => y(d.Temp))
        //                 .attr("height", d => (height - y(d.Temp)))
        //                 .on('mouseover', tip.show)
        //                 .on('mouseout', tip.hide);
        //         }
        //     }
        //
        //     if((max - -deltaX) < (numBars * barWidth))
        //     {
        //         let rightBars = Math.floor((max - -deltaX) / barWidth);
        //     }
        //     console.log("rng: " + rng);
        // }, 1000);

        // setInterval(function () {
        //     d3.selectAll('.bar').filter(function (d, i) {
        //         let x = parseInt(d3.select(this).attr('x'));
        //         let result = ((x + barWidth + barsX) < 0);
        //         if (result) {
        //             dataIdx++;
        //         }
        //         return result;
        //     }).remove();
        //
        //     data = csvData.slice(dataIdx, 100 + dataIdx);
        //
        //     plot.selectAll(".bar")
        //         .data(data)
        //         .enter()
        //         .append("rect")
        //         .attr("class", "bar")
        //         .attr("x", (d, i) => barWidth * (i + dataIdx))
        //         .attr("width", barWidth)
        //         .attr("y", d => y(d.Temp))
        //         .attr("height", d => (height - y(d.Temp)))
        //         .on('mouseover', tip.show)
        //         .on('mouseout', tip.hide);
        //
        //     console.log(dataIdx);
        // }, 1000)
        //
        // setInterval(function () {
        //     barsX -= inc;
        //     d3.select("#barsLayer")
        //         .transition()
        //         .duration(1000)
        //         .ease(d3.easeLinear)
        //         .attr("transform", (d) => {
        //             return `translate(${barsX},0)`
        //         })
        // }, 1000);
    }

    render() {
        return (
            <div>
                <Container>
                    <div className="row">
                        <div className="col-12">
                            <input type="file" onChange={this.d3csv}/>
                        </div>
                    </div>
                </Container>

                <div id="svgtarget">
                </div>
            </div>
        );
    }

    async d3csv(event) {

        let csvfile = event.target.files[0];
        let fileReader = new FileReader();

        const handleFileRead = (e) => {
            let content = d3.csvParse(fileReader.result, function (d) {
                return {
                    Date: d['Date/Time'],
                    Temp: ~~parseFloat(d['Temp (C)'])
                }
            });
            console.log(content);
            this.setState((state) => {
                return {csvData: content}
            });
            this.drawBars();
        };

        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(csvfile);
    }
}
