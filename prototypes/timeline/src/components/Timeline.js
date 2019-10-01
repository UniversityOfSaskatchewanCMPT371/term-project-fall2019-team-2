import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

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

function randInts(n)
{
    let rets = []
    for(let i = 0; i < n; i++)
    {
        rets.push(Math.floor((Math.random() * 100)) * (Math.floor(Math.random()*2) == 1 ? 1 : -1));
    }
    return rets;
}

export class Timeline extends Component {
  static displayName = Timeline.name;

    constructor(props) {
        super(props);
        this.state = { points: [], data: {}, loading: true };

        this.populateData = this.populateData.bind(this);
    }

    static renderChart(data) {
        return (
            <div>
                <h2>Line Example</h2>
                <Bar ref="chart" data={data} />
            </div>
        );
    }

  render() {
      let contents = this.state.loading
          ? <p><em>Loading...</em></p>
          : Timeline.renderChart(this.state.data);

    return (
        <div>
            <button className="btn btn-primary" onClick={this.populateData}>Fetch More</button>
            {contents}
        </div>
    );
  }

    componentDidMount() {
        this.populateData();
    }

    populateData() {
        //const response = await fetch('Test/GetRandomInts');
        //const rets = await response.json();
        /*this.data.datasets.data = rets;*/

        //const rets = [];

        // for(let i = 0; i < 7; i++)
        // {
        //     rets.push(Math.floor((Math.random() * 100)));
        // }

        this.setState({ data: {
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
              data: randInts(7)
            },
              {
                  label: 'My Second dataset',
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
                  data: randInts(7)
              }
          ]
        }, loading: false });
    }
}