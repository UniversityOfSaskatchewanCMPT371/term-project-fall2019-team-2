import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import * as chartjs from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
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


export class d3test extends Component {
    static displayName = d3test.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [12, 5, 6, 6, 9, 10],
            width: 700,
            height: 500,
            id: "d3test"
        };

        this.csvParse = this.csvParse.bind(this);
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = [12, 5, 6, 6, 9, 10];

        const svg = d3.select("#svgtarget")
            .append("svg")
            .attr("width", this.state.width)
            .attr("height", this.state.height);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 50)
            .attr("y", (d, i) => this.state.height - (d * 10))
            //.attr("y", 0)
            .attr("width", 50)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div id="svgtarget" className="col-12">
                    </div>
                </div>
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
        let inc = 1000;
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

        await this.populateData();
    }
}
