import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMap';
import DateSelector from './components/DateSelector';
import dayjs from 'dayjs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalDataset: [],
      currentDate: dayjs()
        .format('YYYY-MM-DD'),
      currentDataset: null
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    return fetch(
      'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json'
    )
      .then(response => {
        return response.json();
      })
      .then(dataset => {
        this.setState(
          {
            originalDataset: dataset,
            currentDate: this.state.currentDate,
            currentDataset: null
          },
          this.filterData
        );
      });
  }

  filterData() {
    const perProvinceMap = this.state.originalDataset.filter(d => {
      return d.sigla_provincia && d.totale_casi;
    });

    const allValues = perProvinceMap.map(d => {
      return d.totale_casi;
    });

    const dataMap = perProvinceMap
      .filter(d => {
        return d.data.startsWith(this.state.currentDate);
      })
      .map(d => {
        return [d.sigla_provincia, d.totale_casi];
      });

    const dataset = {
      min: Math.min.apply(Math, allValues),
      max: Math.max.apply(Math, allValues),
      values: Array.from(dataMap.values())
    };

    this.setState(prevState => ({
      originalDataset: prevState.originalDataset,
      currentDate: prevState.currentDate,
      currentDataset: dataset
    }));
  }

  onDateChange(date) {
    this.setState(
      prevState => ({
        originalDataset: prevState.originalDataset,
        currentDataset: prevState.currentDataset,
        currentDate: date
      }),
      this.filterData
    );
  }

  render() {
    if (!this.state) {
      return <div></div>;
    }

    return (
      <div
        style={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <DateSelector
          from="2020-02-25"
          current={this.state.currentDate}
          callback={this.onDateChange}
        />
        <ChoroplethMap dataset={this.state.currentDataset} />
      </div>
    );
  }
}

export default App;
