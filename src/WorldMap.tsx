import React, { Component } from 'react';
import * as d3 from 'd3';
import './WorldMap.css';
// tslint:disable-next-line: no-var-requires
const topojson = require('topojson-client');

export class WorldMap extends Component<{}, {}> {
  componentDidMount() {
    this.draw();
  }

  // Draw WorldMap on div with id "WorldMap", replace if it exists
  async draw() {
    // const data = [4, 8, 15, 16, 23, 42];
    // const csvString =
    // `name,value\nLocke,4\nReyes,8\nFord,15\nJarrah,16\nShephard,23\nKwon,42`;

    const [worldTopo, worldSpec] = await Promise.all([
      d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json'),
      d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv') ]);
    const data = topojson.feature(worldTopo, worldTopo.objects.countries);

    const countryNames = new Map();
    worldSpec.forEach((country: any) => {
      countryNames.set(country.iso_n3, country.name);
    });

    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);

    const width = 960;
    const height = 500;
    const svg = d3
      .select('#WorldMap')
      .selectAll('svg')
      .data([1])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    const mapG = svg.append('g');

    // zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        mapG.attr('transform', d3.event.transform);
      });
    svg.call(zoom as any); // somehow, when it is mapG.call, panning by drag became really hard

    // Add outline for map
    mapG
      .selectAll('.sphere')
      .data([1])
      .join('path')
        .attr('class', 'sphere')
        .attr('d', d => pathGenerator({type: 'Sphere'}));

    // draw countries on map
    mapG
      .selectAll('.country')
      .data(data.features)
      .join('path')
        .attr('class', 'country')
        .attr('d', (d: any) => pathGenerator(d))
        .append('title')
          .text((d: any) => countryNames.get(d.id));

  }

  render() {
    return <div id="WorldMap"/>;
  }
}
