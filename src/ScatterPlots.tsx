import React, { Component } from 'react';
import * as d3 from 'd3';
// tslint:disable-next-line: no-var-requires
const dsv = require('d3-dsv');

/**
 * Accept a 2D number array as its property.
 * This number array is displayed as a scatterplots with x and y axises.
 *
 * Hovering on each dot will display its coordinate.
 *
 * @export
 * @class ScatterPlots
 * @extends {Component<{data: any[]}, {}>}
 */
export class ScatterPlots extends Component<{data: any[]}, {}> {
  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  // Draw scatterPlots on div with id "scatterPlots", replace if it exists
  draw() {
    // const data = [4, 8, 15, 16, 23, 42];
    const csvString =
    `name,value\nLocke,4\nReyes,8\nFord,15\nJarrah,16\nShephard,23\nKwon,42`;
    const rawData = d3.csvParse(csvString, dsv.autoType);
    const data = rawData.map<{ name: string; value: number }>(a => {
      return { name: a[rawData.columns[0]], value: a[rawData.columns[1]] };
    });

    const width = 800;
    const height = 500;
    const barheight = 50;
    const middleHeight = 5;
    const svg = d3
      .select('#scatterPlots')
      .selectAll('svg')
      .data([1])
      .enter()
        .append('svg');
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(0, 50)');

    const xscale = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, d3.max(data.map(a => a.value)) ?? 0]);
    const yscale = d3
      .scaleBand()
      .range([0, (barheight + middleHeight) * data.length])
      .domain(data.map(a => a.name));

    const bars = svg
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${yscale(d.name)})`);

    bars
      .append('rect')
      .style('fill', 'steelblue')
      .attr('width', d => xscale(d.value))
      .attr('height', barheight);
    bars
      .append('text')
      .style('fill', 'white')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', barheight / 2)
      .attr('x', d => xscale(d.value) - barheight / 2)
      .attr('y', barheight / 2)
      .text(d => d.value);
  }

  render() {
    return <div id="scatterPlots"/>;
  }
}
