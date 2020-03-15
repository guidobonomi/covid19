import React, { Component } from 'react';
import './App.css';

import ChoroplethMap from './components/ChoroplethMap';

class App extends Component {
  render() {
    return (
      <div style={{
        height:"100vh",
        width: "100vw"
      }}>
        <ChoroplethMap/>
      </div>
    );
  }
}

export default App;
