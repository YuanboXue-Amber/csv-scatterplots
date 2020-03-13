import React, { Component } from 'react';
import * as d3 from 'd3';
import './ChoroplethMap.css';
import { colorLegendVertical } from './ColorLegendVertical';
// tslint:disable-next-line: no-var-requires
const topojson = require('topojson-client');

export class ChoroplethMap extends Component<{}, {}> {
  worldData: any[] = [];

  componentDidMount() {
    this.draw();
  }

  async getWorldData() {
    const [worldTopo, worldSpec]  = await Promise.all([
      d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
      d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    ]);

    // worldGeo.id is country. worldGeo.geometry contains type Polygon and coordinates array
    const worldGeo = (topojson.feature(worldTopo, worldTopo.objects.countries)).features;

    // process both data to get worldData as:
    // worldGeo
    // worldGeo.name = worldSpec.name, worldGeo.spec = worldSpec.economy
    const map = new Map();
    worldGeo.forEach((country: any) => {
      map.set(country.id, country);
    });

    worldSpec.forEach((country: any) => {
      const countryGeo = map.get(country.iso_n3);
      countryGeo.name = country.name;
      countryGeo.spec = country.economy; // pick economy as the 'spec' we are interested in
      map.set(country.iso_n3, countryGeo);
    });
    this.worldData = Array.from(map.values());
  }

  // Draw ChoroplethMap on div with id "ChoroplethMap", replace if it exists
  async draw() {

    await this.getWorldData();

    const width = 960;
    const height = 800;
    const svg = d3
      .select('#ChoroplethMap')
      .selectAll('svg')
      .data([1])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    // map generator
    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath(projection);

    // color scale
    const colorScale = d3.scaleOrdinal()
      .domain(this.worldData.map((d: any) => d.spec).sort());
    colorScale
      .range(d3.schemeSpectral[colorScale.domain().length]);

    // draw map
    const mapG = svg.append('g');
    mapG
      .selectAll('.sphere')
      .data([null])
      .join('path')
        .attr('class', 'sphere')
        .attr('d', d => pathGenerator({type: 'Sphere'}));

    mapG
      .selectAll('.country')
      .data(this.worldData)
      .join('path')
        .attr('class', 'country')
        .attr('d', (d: any) => pathGenerator(d))
        .attr('fill', (d: any) => colorScale(d.spec) as string)
        .append('title')
          .text((d: any) => `${d.name}: ${d.spec}`); // set hover text

    // draw color legend
    const colorLegendG = svg.append('g')
      .attr('transform', 'translate(0, 250)');
    const selector = colorLegendG;
    const colorRadius = 10;
    const colorDistance = 5;
    colorLegendVertical({ selector, colorScale, colorRadius, colorDistance, textwidth: 200});
  }

  render() {
    return <div id="ChoroplethMap"/>;
  }
}
