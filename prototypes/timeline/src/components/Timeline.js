import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import * as chartjs from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import CSVReader from "react-csv-reader";

/*
var data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []//[65, 59, 80, 81, 56, 55, 40]
    }
  ]
};
*/

function r50()
{
    return Math.floor(Math.random() * 2);
}

//50/50 chance of returning 1 or -1
function pn()
{
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

export class Timeline extends Component {
    static displayName = Timeline.name;

    constructor(props) {
        super(props);
        this.state = {
            points: [],
            labels: [],
            chart: "Line",
            data: {},
            loading: true,
            csvData: []
        };

        this.populateData = this.populateData.bind(this);
        this.changeChart = this.changeChart.bind(this);
        this.csvParse = this.csvParse.bind(this);
    }

    static renderChart(data, chart) {
        let testing = chartjs.Line;

        switch (chart) {
            case "Bar":
                return (
                    <div>
                        <h2>Bar Example</h2>
                        <chartjs.Bar ref="chart" data={data} options={{scales: {
                                xAxes: [{
                                    barPercentage: 1.0,
                                    categoryPercentage: 1.0,
                                    stacked: true,
                                    gridLines: {
                                        offsetGridLines: false
                                    }
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }}}/>
                    </div>
                );
                break;
            case "Line":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Line ref="chart" data={data} options={{scales : {
                                xAxes: [{
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 20
                                    }
                                }]
                            }}}/>
                    </div>
                );
                break;
            case "Doughnut":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Doughnut ref="chart" data={data}/>
                    </div>
                );
                break;
            case "Bubble":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Bubble ref="chart" data={data}/>
                    </div>
                );
                break;
            case "HorizontalBar":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.HorizontalBar ref="chart" data={data}/>
                    </div>
                );
                break;
            case "Pie":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Pie ref="chart" data={data}/>
                    </div>
                );
                break;
            case "Polar":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Polar ref="chart" data={data}/>
                    </div>
                );
                break;
            case "Radar":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Radar ref="chart" data={data}/>
                    </div>
                );
                break;
            case "Scatter":
                return (
                    <div>
                        <h2>Line Example</h2>
                        <chartjs.Scatter ref="chart" data={data}/>
                    </div>
                );
                break;
        }
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Timeline.renderChart(this.state.data, this.state.chart);

        // const handleForce = data => {
        //     Timeline.
        //     //console.log(data);
        // };

        return (
            <div>
                <div className="row">
                    <div className="col-2">
                        <div className="form-group">
                            <button className="btn btn-primary form-control" onClick={this.populateData}>Fetch More
                            </button>
                        </div>
                    </div>
                    <div className="col-4">
                        <select value={this.state.chart} onChange={this.changeChart} className="form-control">
                            <option value="Bar">Bar</option>
                            <option value="Line">Line</option>
                            <option value="Doughnut">Doughnut</option>
                            <option value="Bubble">Bubble</option>
                            <option value="HorizontalBar">Horizontal Bar</option>
                            <option value="Pie">Pie</option>
                            <option value="Polar">Polar</option>
                            <option value="Radar">Radar</option>
                            <option value="Scatter">Scatter</option>
                        </select>
                    </div>
                    <div className="col-6">
                        <CSVReader
                            cssClass="react-csv-input"
                            label="Select CSV"
                            onFileLoaded={this.csvParse}
                        />
                        <p>and then open the console</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {contents}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.populateData();
    }

    async changeChart(event) {
        console.log(event);
        let newChart = event.target.value;
        this.setState({chart: newChart});
        //renderChart(this.state.data);
    }

    async populateData() {
        let dc1 = dynamicColors();
        let dc2 = dynamicColors();

        // let labels = [];
        // let points = [];
        //
        // this.state.getState()
        //
        // if(this.state.csvData !== []) {
        //     for(let i = 1; i < this.state.csvData.length; i++) {
        //         if(this.state.csvData[i].length == 2) {
        //             points.concat(this.state.csvData[i][0]);
        //             labels.concat(this.state.csvData[i][1]);
        //             console.log(points);
        //             console.log(labels);
        //         }
        //     }
        // }
        // else {
        //     let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        //     let points = randInts(7);
        // }

        this.setState((state) => {
            let t = [];
            // for(let i = 0; i < this.state.points.length; i++)
            // {
            //     t.push(this.state.points[i] * -1);
            // }

            // for(let i = 0; i < this.state.points.length; i++)
            // {
            //     t.push(this.state.points[i] * pn());
            // }

            //console.log(t);
            return {
                data: {
                    labels: this.state.labels,
                    datasets: [
                        {
                            label: 'My First dataset',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(' + dc1['r'] + ',' + dc1['g'] + ',' + dc1['b'] + ',' + 0.4 + ')',
                            borderColor: 'rgba(' + dc1['r'] + ',' + dc1['g'] + ',' + dc1['b'] + ',' + 1 + ')',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(' + dc1['r'] + ',' + dc1['g'] + ',' + dc1['b'] + ',' + 1 + ')',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(' + dc1['r'] + ',' + dc1['g'] + ',' + dc1['b'] + ',' + 1 + ')',
                            pointHoverBorderColor: 'rgba(' + dc1['r'] + ',' + dc1['g'] + ',' + dc1['b'] + ',' + 1 + ')',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: this.state.labels
                        }
                        // },
                        // {
                        //     label: 'My Second dataset',
                        //     fill: false,
                        //     lineTension: 0.1,
                        //     backgroundColor: 'rgba(' + dc2['r'] + ',' + dc2['g'] + ',' + dc2['b'] + ',' + 0.4 + ')',
                        //     borderColor: 'rgba(' + dc2['r'] + ',' + dc2['g'] + ',' + dc2['b'] + ',' + 1 + ')',
                        //     borderCapStyle: 'butt',
                        //     borderDash: [],
                        //     borderDashOffset: 0.0,
                        //     borderJoinStyle: 'miter',
                        //     pointBorderColor: 'rgba(' + dc2['r'] + ',' + dc2['g'] + ',' + dc2['b'] + ',' + 1 + ')',
                        //     pointBackgroundColor: '#fff',
                        //     pointBorderWidth: 1,
                        //     pointHoverRadius: 5,
                        //     pointHoverBackgroundColor: 'rgba(' + dc2['r'] + ',' + dc2['g'] + ',' + dc2['b'] + ',' + 1 + ')',
                        //     pointHoverBorderColor: 'rgba(' + dc2['r'] + ',' + dc2['g'] + ',' + dc2['b'] + ',' + 1 + ')',
                        //     pointHoverBorderWidth: 2,
                        //     pointRadius: 1,
                        //     pointHitRadius: 10,
                        //     data: t
                        // }
                    ]
                },
                loading: false
            }
        });
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