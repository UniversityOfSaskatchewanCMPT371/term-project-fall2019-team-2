import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import * as chartjs from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import { Container } from 'reactstrap';
import CSVReader from "react-csv-reader";
import * as d3 from "d3";

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


export class CanvasTest extends Component {
    static displayName = CanvasTest.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [12, 5, 6, 6, 9, 10],
            width: 10000,
            height: 1000,
            id: "CanvasTest",
            csvData: [],
            points: [],
            labels: []
        };

        this.csvParse = this.csvParse.bind(this);
    }

    componentDidMount() {
        //this.drawChart();
    }

    drawChart() {
        let t0 = performance.now();
        console.log("drawChart");
        //const data = [12, 5, 6, 6, 9, 10];
        const data = this.state.points;
        const rects = [];

        console.log(this.state.points);

        let canvas = document.getElementById("canvastarget");
        let ctx = canvas.getContext("2d");

        //ctx.fillStyle = "#FF0000";

        console.log(Math.max(data));

        let max = data.reduce(function(a, b) {
            return Math.max(a, b);
        });

        let heightScale = this.state.height / max;
        //let width = Math.floor(this.state.width / data.length);
        let width = 50;

        console.log("Width: " + width)
        console.log(heightScale);

        for(let i = 0; i < data.length; i++)
        {
            rects.push({
                x: width * i,
                y: this.state.height - (data[i] * heightScale),
                w: width,
                h: data[i] * heightScale,
                c: 'yellow'
            });

            ctx.fillStyle = rects[i].c;
            //ctx.fillRect(width * i, this.state.height - (data[i] * heightScale), width, data[i] * heightScale);
            ctx.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
        }

        let blues = [];

        canvas.onmousemove = function (e) {
            let rect = this.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top,
                i = 0, r;

            //ctx.clearRect(0, 0, canvas.width, canvas.height);

            for(let n = (blues.length - 1); n >= 0; n--)
            {
                let index = blues[n];
                let r = rects[index];
                r.c = 'yellow';
                ctx.beginPath();
                ctx.rect(r.x, r.y, r.w, r.h);
                ctx.fillStyle = r.c;
                ctx.fill();

                blues.pop();
            }

            i = x > 5 ? x - 5 : 0;
            for( i; i < rects.length && i < (x + 10); i++)
            {
                let r = rects[i];
                ctx.beginPath();
                ctx.rect(r.x, r.y, r.w, r.h);
                if(ctx.isPointInPath(x, y))
                {
                    r.c = 'blue';
                    blues.push(i);
                }
                ctx.fillStyle = r.c;
                ctx.fill();
            }
        };

        canvas.onmouseout = function(e) {
            for(let n = (blues.length - 1); n >= 0; n--)
            {
                let index = blues[n];
                let r = rects[index];
                r.c = 'yellow';
                ctx.beginPath();
                ctx.rect(r.x, r.y, r.w, r.h);
                ctx.fillStyle = r.c;
                ctx.fill();

                blues.pop();
            }
        }

        let t1 = performance.now();
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    }
    render() {
        return (
            <div>
                <Container>
                    <div className="row">
                        <div className="col-12">
                            <CSVReader
                                cssClass="react-csv-input"
                                label="Select CSV "
                                onFileLoaded={this.csvParse}
                            />
                        </div>
                    </div>
                </Container>


                <canvas id="canvastarget" width={this.state.width} height={this.state.height}>
                </canvas>

            </div>
        );
    }

    async csvParse(csv) {
        let ps = [];
        let ls = [];

        csv = csv.sort(function(a, b) {
            return a[1] - b[1];
        });

        console.log(csv);

        let len = csv.length;

        let i = 1;
        let n = 1;
        //let inc = 1000;
        let inc = Math.ceil(len / this.state.width);
        let temp = 0.0;

        for (i = 1; i < len; ) {
            let lsavg = 0;
            let psavg = 0;

            for(n = i; n < (i+inc) && n < len; n++)
            {
                //console.log(csv[n][1]);
                temp = parseFloat(csv[n][1]);
                lsavg += Number.isNaN(temp) ? 0.0 : temp;

                //console.log("lsavg: " + lsavg);
                if(Number.isNaN(lsavg))
                {
                    console.log("lsavg NaN at index: " + n);
                    break;
                }

                temp = parseInt(csv[n][2]);
                psavg += Number.isNaN(temp) ? 0.0 : temp;

                //console.log("psavg: " + psavg);
                if(Number.isNaN(psavg))
                {
                    console.log("psavg NaN at index: " + n);
                    break;
                }
            }
            if(Number.isNaN(lsavg))
            {
                break;
            }
            if(Number.isNaN(psavg))
            {
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
        //await this.populateData();
    }
}
