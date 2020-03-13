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
      .data([null])
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

    // draw stable part of the map
    const mapG = svg
      .selectAll('.map')
      .data([null])
      .join('g')
        .attr('class', 'map');

    mapG
      .selectAll('.sphere')
      .data([null])
      .join('path')
        .attr('class', 'sphere')
        .attr('d', d => pathGenerator({type: 'Sphere'}));

    // zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        mapG.attr('transform', d3.event.transform);
      });
    svg.call(zoom as any); // somehow, when it is mapG.call, panning by drag became really hard

    // draw color legend
    const colorLegendG = svg
      .selectAll('.colorLegend')
      .data([null])
      .join('g')
        .attr('class', 'colorLegend')
        .attr('transform', 'translate(0, 250)');
    const selector = colorLegendG;
    const colorRadius = 10;
    const colorDistance = 5;

    // add event when click color legend
    let clickedDomain: any;
    const onClick = (clicked: string) => {
      console.log(clicked);
      clickedDomain = clicked;
      renderMap();
    };

    // render dynamic part of map
    const renderMap = () => {
      const countries = mapG
        .selectAll('.country')
        .data(this.worldData)
        .join('path')
          .attr('class', 'country')
          .attr('d', (d: any) => pathGenerator(d))
          .attr('fill', (d: any) => colorScale(d.spec) as string)
          .attr('opacity', (d: any) =>
            (!clickedDomain || d.spec === clickedDomain)
            ? 1
            : 0.2,
          )
          .classed('hilighted', d => d.spec === clickedDomain);

      countries
        .selectAll('title')
        .data(d => [d])
        .join('title')
          .text((d: any) => `${d.name}: ${d.spec}`); // set hover text

      colorLegendVertical({ selector, colorScale, colorRadius, colorDistance, textwidth: 200, onClick, clickedDomain});
    };

    renderMap();
  }

  render() {
    return <div id="ChoroplethMap"/>;
  }
}
