import React, { Component } from 'react';
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import topologyJson from './topology.json';

class ChoroplethMap extends Component {
    componentDidMount() {
        fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json')
            .then((response) => {
                return response.json();
            })
            .then((d) => {
                const myMap = d.filter(d => {
                    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString().substring(0, 10);
                    return d.data.startsWith(this.props.current) && d.sigla_provincia;
                }).map(d => {
                    return [d.sigla_provincia, d.totale_casi]
                })

                const data = Array.from(myMap.values());

                let uniqValues = data.map(function (obj) { return obj[1]; });
                let minValue = Math.min.apply(null, uniqValues),
                    maxValue = Math.max.apply(null, uniqValues);

                let paletteScale = d3.scale.linear()
                    .domain([minValue, maxValue])
                    .range(["#FFFFDD", "red"]);

                let dataset = {};

                data.forEach(function (item) {
                    const iso = item[0],
                        value = item[1];
                    dataset[iso] = {
                        numberOfThings: value,
                        fillColor: paletteScale(value)
                    };
                });

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
                        popupTemplate: function (geo, data) {
                            let numberOfThings = data ? data.numberOfThings : 0;
                            // tooltip content
                            return ['<div class="hoverinfo">',
                                '<strong>', geo.properties.name, '</strong>',
                                '<br>Count: <strong>', numberOfThings, '</strong>',
                                '</div>'].join('');
                        }
                    },
                    fills: {
                        UNKNOWN: 'rgb(0,0,0)',
                        defaultFill: 'white'
                    },
                    data: dataset,
                    setProjection: function (element) {
                        var projection = d3.geo.mercator()
                            .center([13, 42])
                            .scale(2500)
                            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

                        var path = d3.geo.path().projection(projection);
                        return { path: path, projection: projection };
                    }
                });
            });
    }

    render() {
        return (
            <div id="cloropleth_map" style={{
                height: "100%",
                width: "100%",
            }}></div>
        );
    }
}

export default ChoroplethMap;