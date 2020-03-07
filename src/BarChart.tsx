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
      .join('svg');
    svg
      .attr('height', height)
      .attr('width', width);

    const margin = {top: 20, left: 30, bottom: 20, right: 20};

    const xscale = d3
      .scaleBand()
      .domain(data.map(a => a.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yscale = d3
      .scaleLinear()
      .domain([0, (d3.max(data.map(a => a.value)) ?? 0 ) * 1.2])
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) => { g
        .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xscale));
    };

    const yAxis = (g: any) => { g
        .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yscale).tickFormat(d => `${(d.valueOf() * 100).toFixed(0)}%`));
    };

    const ytitle = (g: any) => { g
        .append('text')
      .text('Frequency ^')
      .attr('font-size', xscale.bandwidth() / 2)
      .attr('transform', `translate(0, ${xscale.bandwidth() / 2})`);
    };

    svg.call(xAxis);
    svg.call(yAxis);
    svg.call(ytitle);

    const gbars = svg
      .append('g')
    .selectAll('g')
    .data(data)
    .join('g');

    gbars
        .append('rect')
      .style('fill', 'steelblue')
      .attr('height', d => yscale(0) - yscale(d.value))
      .attr('width', xscale.bandwidth())
      .attr('x', d => xscale(d.name) ?? 0)
      .attr('y', d => yscale(d.value));

    gbars
      .append('text')
      .attr('font-size', xscale.bandwidth() / 2)
      .text(d => `${(d.value * 100).toFixed(2)}%`)
      .attr('x', d => xscale(d.name) ?? 0)
      .attr('y', d => yscale(d.value) - 2);
  }

  render() {
    return <div id="BarChart"/>;
  }
}
