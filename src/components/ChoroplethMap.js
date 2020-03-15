import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import topologyJson from './topology.json';

class ChoroplethMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.current
    };
    this.createDataSet = this.createDataSet.bind(this);
  }

  componentDidMount() {
    if (!this.props.dataset) {
      return;
    }
    this.createDataMap(this.createDataSet(this.props.dataset));
  }

  componentDidUpdate(prev) {
    if (!this.props.dataset || this.props.dataset === prev.dataset) {
      return;
    }
    this.createDataMap(this.createDataSet(this.props.dataset));
  }

  createDataSet(data) {
    if (!data || !data.values) {
      return;
    }
    let paletteScale = d3.scale
      .linear()
      .domain([data.min, data.max])
      .range(['#FFFFDD', 'red']);

    let dataset = {};

    data.values.forEach(function(item) {
      const iso = item[0],
        value = item[1];
      dataset[iso] = {
        numberOfThings: value,
        fillColor: paletteScale(value)
      };
    });

    return dataset;
  }

  createDataMap(dataset) {
    document.getElementById('cloropleth_map').innerHTML = '';
    new Datamap({
      element: document.getElementById('cloropleth_map'),
      scope: 'italy',
      geographyConfig: {
        popupOnHover: true,
        highlightOnHover: true,
        borderColor: '#444',
        highlightBorderWidth: 1,
        borderWidth: 0.5,
        dataJson: topologyJson,
        popupTemplate: function(geo, data) {
          let numberOfThings = data ? data.numberOfThings : 0;
          // tooltip content
          return [
            '<div class="hoverinfo">',
            '<strong>',
            geo.properties.name,
            '</strong>',
            '<br>Count: <strong>',
            numberOfThings,
            '</strong>',
            '</div>'
          ].join('');
        }
      },
      fills: {
        UNKNOWN: 'rgb(0,0,0)',
        defaultFill: 'white'
      },
      data: dataset,
      setProjection: function(element) {
        var projection = d3.geo
          .mercator()
          .center([13, 42])
          .scale(1500)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

        var path = d3.geo.path().projection(projection);
        return { path: path, projection: projection };
      }
    });
  }

  render() {
    return (
      <div
        id="cloropleth_map"
        style={{
          height: '100%',
          width: '100%'
        }}
      ></div>
    );
  }
}

export default ChoroplethMap;
