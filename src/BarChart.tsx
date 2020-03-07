import React, { Component } from 'react';
import * as d3 from 'd3';
// tslint:disable-next-line: no-var-requires
const dsv = require('d3-dsv');

export class BarChart extends Component<{}, {}> {
  componentDidMount() {
    this.draw();
  }

  async fetchFile() {
    const response = await fetch(
      'https://raw.githubusercontent.com/thegazettedata/d3charts/master/projects/cr-bike-trails/data/letter-frequency.csv',

    );
    // Check if the request is 200
    if (response.ok) {
      return response.text();
    }
    return Promise.reject(response);
  }

  // Draw BarChart on div with id "BarChart", replace if it exists
  async draw() {
    // const data = [4, 8, 15, 16, 23, 42];
    // const csvString =
    // `name,value\nLocke,4\nReyes,8\nFord,15\nJarrah,16\nShephard,23\nKwon,42`;

    const csvString = await this.fetchFile();

    const rawData = d3.csvParse(csvString, dsv.autoType);
    const data = rawData.map<{ name: string; value: number }>(a => {
      return { name: a[rawData.columns[0]], value: a[rawData.columns[1]] };
    });

    const width = 800;
    const height = 600;
    const svg = d3
      .select('#BarChart')
      .selectAll('svg')
      .data([1])
      .enter()
        .append('svg');
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(0, 50)')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const margin = {top: 20, left: 30, bottom: 20, right: 30};

    const yscale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, (d3.max(data.map(a => a.value)) ?? 0) * 1.2]);

    const xscale = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .domain(data.map(a => a.name))
      .padding(0.3);

    const xAxis = (g: any) => g
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xscale));

    const yAxis = (g: any) => g
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yscale).tickFormat(d => `${(d.valueOf() * 100).toFixed(0)}%`));

    svg
        .append('g')
      .call(xAxis);
    svg
        .append('g')
      .call(yAxis);
    svg
        .append('text')
        .attr('font-size', xscale.bandwidth() / 2)
        .attr('x', 0)
        .attr('y', xscale.bandwidth() / 2)
        .text('↑ Frequency');

    const bars =
    svg
        .append('g')
      .selectAll('g')
      .data(data)
      .join('g');

    bars
        .append('rect')
      .style('fill', 'steelblue')
      // .attr('transform', (d) => `translate(${xscale(d.name)}, 0)`)
      .attr('height', d => yscale(0) - yscale(d.value))
      .attr('width', xscale.bandwidth())
      .attr('x', d => xscale(d.name) ?? 0)
      .attr('y', d => yscale(d.value));

    bars
      .append('text')
      .style('fill', 'black')
      .attr('font-size', xscale.bandwidth() / 2)
      .attr('x', d => xscale(d.name) ?? 0)
      .attr('y', d => yscale(d.value) - 2)
      .text(d => `${(d.value * 100).toFixed(2)}%`);
  }

  render() {
    return <div id="BarChart"/>;
  }
}
