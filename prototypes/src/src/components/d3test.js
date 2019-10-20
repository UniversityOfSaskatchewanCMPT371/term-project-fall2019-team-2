import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import * as chartjs from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import CSVReader from "react-csv-reader";
import * as d3 from "d3";
import {Container} from "reactstrap";
import sort from 'fast-sort';

function log(str) {
    console.log(str);
}

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

function perf(t1, t2) {
    log("Speed: " + (t2 - t1) + "ms");
}


export class d3test extends Component {
    static displayName = d3test.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [12, 5, 6, 6, 9, 10],
            xColumn: "",
            yColumn: "",
            width: 1000,
            height: 1000,
            id: "d3test"
        };
        this.csvParse = this.csvParse.bind(this);
        this.d3csv = this.d3csv.bind(this);
    }

    componentDidMount() {
        //this.drawChart();
    }

    drawBars() {
        let margin = {top: 40, right: 20, bottom: 100, left: 40};
        let width = this.state.width - margin.left - margin.right;
        let height = this.state.height - margin.top - margin.bottom;

        let barWidth = 50;
        let barBuffer = 1;//Math.floor(100 / barWidth) >= 1 ? Math.floor(100 / barWidth) : 1;
        let numBars = Math.floor(width / barWidth)
            + barBuffer; //this is just a small pixel buffer to ensure smooth transitions
        let frameSize = barWidth * numBars;

        let csvData = this.state.csvData;

        let xColumn = this.state.xColumn;
        let yColumn = this.state.yColumn;

        let barsX = 0;
        let inc = 1000;
        let dataIdx = 0;
        let direction = 1;
        let deltaX = 0;

        let scale = 1;


        //numBars *= 10;
        let data = csvData.slice(0, numBars);
        let ordinals = data.map(d => d[xColumn]);

        console.log(data);

        let x = d3.scaleLinear()
            .domain([0, ordinals.length])
            .rangeRound([0, width]);

        let y = d3.scaleLinear()
            .domain([d3.min(csvData, (d) => {
                return d[yColumn];
            }),
                d3.max(csvData, (d) => {
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
        let ttover = function (d) {
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

        function ttUpdatePos(xPos, yPos) {
            Tooltip.style("left", (xPos + 70) + "px")
                .style("top", (yPos + "px"));
        }

        let ttmove = function (d) {
            //log(d3.event);
            //log(d3.mouse(this));
            //event is a mouseEvent
            ttUpdatePos(d3.event.x, d3.event.y);
            // Tooltip.style("left", (d3.mouse(this)[0] + 70) + "px")
            //     .style("top", (d3.mouse(this)[1]) + "px");
        };

        let ttleave = function (d) {
            //delete all tooltips
            if(d3.event.buttons === 0){
                d3.selectAll('.tooltip').remove();
            }
        };

        const extent = [[margin.left, margin.top], [width - margin.right, height - margin.top]];
        let zoom = d3.zoom()
            .scaleExtent([1, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", updateChart);

        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(zoom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        svg.append('rect')
            .attr("width", width)
            .attr("height", height)
            .style('fill', 'none');



        let clip = svg
            .append('defs')
            .append('clipPath')
            .attr('id', 'barsBox')
            .append('rect')
            .attr('width', width)
            .attr('height', height + margin.top + margin.bottom)
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

        //Create main draggable layer
        // svg.append('rect')
        //     .attr("width", width)
        //     .attr('id', 'dragLayer')
        //     .attr("height", height + margin.top + margin.bottom)
        //     .style("fill", "none")
        //     .style("pointer-events", "all")
        //     .call(zoom);


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

        // let bars = plot.selectAll(".bar")
        //     .data(data, function (d) {
        //         return d ? d.index : this.id;
        //     });

        updateBars();

        //x axis
        let xAxis = barsLayer.append("g")
            .attr('id', 'xaxis')
            .style('color', 'red')
            .attr("class", "x axis")
            //.attr('y', height)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(function (d) {
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

            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX).tickFormat(function (d) {
                return ordinals[d];//now for 0 it will return 'a' for 1 b and so on...
            }));
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
                .data(data, function (d) {
                    log("updateBars: ");
                    log(d);
                    return d.index;
                })
                .join(
                    enter => enter.append('rect')
                        .attr("class", "bar")
                        .attr("x", (d, i) => (scale * barWidth * (i + dataIdx)))
                        .attr("width", scale * barWidth)
                        .attr("y", d => y(d[yColumn]))
                        .attr("height", d => {
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

                    update => update,

                    exit => exit.remove()
                );
        }

        function moveChart() {
            d3.select('#barsLayer')
                .attr("transform", (d) => {
                    return `translate(${deltaX},0)`
                });

            dataIdx = Math.floor(-deltaX / (scale * barWidth));
            data = csvData.slice(dataIdx, numBars + dataIdx);

            updateBars();
        }

        function dragstarted(d) {
            log("dragging");
            let drag = d3.select(this);
            drag.raise()
                .classed("active", true);
        }

        let perfTotal = 0;
        let perfIdx = 0;

        function dragged(d) {
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

        function dragended(d) {
            d3.select(this).classed("active", false);
        }

        // setInterval(function() {
        //     //change this to an each loop
        //     d3.selectAll('.bar').filter(function(d,i)  {
        //         let x = parseInt(d3.select(this).attr('x'));
        //         //let result = ((x + barWidth + barsX) < 0);
        //         if(x < (barWidth + -deltaX)) {
        //             dataIdx++;
        //             return true;
        //         }
        //         else if(x > -deltaX) {
        //             dataIdx--;
        //             if(dataIdx < 0) {
        //                 dataIdx = 0;
        //             }
        //             return true;
        //         }
        //         return false;
        //     });
        //
        //     data = csvData.slice(dataIdx, 100 + dataIdx);
        //
        //     plot.selectAll(".bar")
        //         .data(data)
        //         //.enter()
        //         //.append("rect")
        //         .join('rect')
        //         .attr("class", "bar")
        //         .attr("x", (d, i) => barWidth * (i + dataIdx))
        //         .attr("width", barWidth)
        //         .attr("y", d => y(d[yColumn]))
        //         .attr("height", d => (height - y(d[yColumn])))
        //         .on('mouseover', tip.show)
        //         .on('mouseout', tip.hide);
        //
        //     console.log(dataIdx);
        // }, 100);

        // setInterval(function(){
        //     d3.selectAll('.bar').filter(function(d,i)  {
        //         let x = parseInt(d3.select(this).attr('x'));
        //         let result = ((x + barWidth + barsX) < 0);
        //         if(result) {
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
        //         .attr("y", d => y(d[yColumn]))
        //         .attr("height", d => (height - y(d[yColumn])))
        //         .on('mouseover', tip.show)
        //         .on('mouseout', tip.hide);
        //
        //     console.log(dataIdx);
        // }, 1000)
        // setInterval(function () {
        //     barsX -= (inc * direction);
        //
        //     //barsX *= direction;
        //
        //     d3.select("#barsLayer")
        //         .transition()
        //         .duration(1000)
        //         .ease(d3.easeLinear)
        //         .attr("transform", (d) => {
        //             return `translate(${barsX},0)`
        //         });
        // }, 1000);
        //
        // setInterval(function (){
        //     direction *= -1;
        //     console.log("direction: " + direction);
        // }, 10000);
    }

    render() {
        return (
            <div>
                <Container>
                    <div className="row">
                        <div className="col-12">
                            {/*<CSVReader*/}
                            {/*    cssClass="react-csv-input"*/}
                            {/*    label="Select CSV "*/}
                            {/*    onFileLoaded={this.csvParse}*/}
                            {/*/>*/}
                        </div>
                        <div className="col-12">
                            <input type="file" onChange={this.d3csv}/>
                        </div>
                    </div>
                </Container>

                <div id="svgtarget">
                </div>

                {/*<Home />*/}
            </div>
        );
    }

    async d3csv(event) {
        let t1 = performance.now();
        let csvfile = event.target.files[0];
        let fileReader = new FileReader();

        const handleFileRead = (e) => {
            //let content = d3.csvParse(fileReader.result);
            let content = d3.csvParse(fileReader.result, function (d, i) {
                d['index'] = i;
                d['Order Date Cmp'] = Date.parse(d['Order Date']);
                return d;
            });

            // content = content.sort(function (a, b) {
            //     return Date.parse(a['Order Date']) - Date.parse(b['Order Date']);
            // });

            content = sort(content).asc(c => c['Order Date Cmp']);

            console.log(content);
            this.setState((state) => {
                return {
                    csvData: content,
                    xColumn: "Order Date",
                    yColumn: "Units Sold",
                    width: window.innerWidth,
                    height: window.innerHeight - 100
                }
            });
            this.drawBars();

            let t2 = performance.now();

            log("csv read time: " + (t2 - t1) + "ms");
        };

        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(csvfile);
    }

    async csvParse(csv) {
        let ps = [];
        let ls = [];

        csv = csv.sort(function (a, b) {
            return a[1] - b[1];
        });

        console.log(csv);

        let len = csv.length;

        let i = 1;
        let n = 1;
        //let inc = 1000;
        let inc = Math.ceil(len / this.state.width);
        let temp = 0.0;

        for (i = 1; i < len;) {
            let lsavg = 0;
            let psavg = 0;

            for (n = i; n < (i + inc) && n < len; n++) {
                //console.log(csv[n][1]);
                temp = parseFloat(csv[n][1]);
                lsavg += Number.isNaN(temp) ? 0.0 : temp;

                //console.log("lsavg: " + lsavg);
                if (Number.isNaN(lsavg)) {
                    console.log("lsavg NaN at index: " + n);
                    break;
                }

                temp = parseInt(csv[n][2]);
                psavg += Number.isNaN(temp) ? 0.0 : temp;

                //console.log("psavg: " + psavg);
                if (Number.isNaN(psavg)) {
                    console.log("psavg NaN at index: " + n);
                    break;
                }
            }
            if (Number.isNaN(lsavg)) {
                break;
            }
            if (Number.isNaN(psavg)) {
                break;
            }
            ls.push(lsavg / (n - i));
            ps.push(psavg / (n - i));

            i += inc;
        }
        console.log(ps);
        console.log(ls);

        this.setState({
            csvData: csv,
            points: ps,
            labels: ls
        });

        this.drawChart();
    }
}
