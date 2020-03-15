import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMap';
import DateSelector from './components/DateSelector';
import dayjs from 'dayjs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDate: dayjs()
        .subtract(1, 'd')
        .format('YYYY-MM-DD')
    };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(date) {
    this.setState({
      displayDate: date
    });
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
          from="2020-02-01"
          to="2020-03-31"
          current={this.state.displayDate}
          callback={this.onSelect}
        />
        <ChoroplethMap current={this.state.displayDate} />
      </div>
    );
  }
}

export default App;
