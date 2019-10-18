import React, { Component } from 'react';

export class OccurrenceData extends Component {
  static displayName = OccurrenceData.name;

  constructor(props) {
    super(props);
    this.state = { occurrences: [], loading: true };
      this.populateOccurrenceData = this.populateOccurrenceData.bind(this);
    //this.fetchNewData = this.fetchNewData.bind(this);
  }

  componentDidMount() {
    this.populateOccurrenceData();
  }

  static renderOccurrenceTable(occurrences) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {occurrences.map(occurrence =>
            <tr key={occurrence.date}>
              <td>{occurrence.date}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : OccurrenceData.renderOccurrenceTable(this.state.occurrences);

    return (
      <div>
        <h1 id="tabelLabel" >Occurrence Data</h1>
        <p>This component demonstrates fetching data from the server.</p>
            <button className="btn btn-primary" onClick={this.populateOccurrenceData}>Fetch More</button>
        {contents}
      </div>
    );
  }

  async populateOccurrenceData() {
    const response = await fetch('Test/GetEventOccurrences');
    const data = await response.json();
    this.setState({ occurrences: data, loading: false });
  }
}
