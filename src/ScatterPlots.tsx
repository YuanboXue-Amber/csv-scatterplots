import React, { Component } from 'react';
import * as d3 from 'd3';

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
    const data = [4, 8, 15, 16, 23, 42];
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
      .domain([0, d3.max(data) ?? 0]);
    const yscale = d3
      .scaleBand()
      .range([0, (barheight + middleHeight) * data.length])
      .domain(d3.range(data.length).map(String));

    const bars = svg
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${yscale(i.toString())})`);

    bars
      .append('rect')
      .style('fill', 'steelblue')
      .attr('width', d => xscale(d))
      .attr('height', barheight);
    bars
      .append('text')
      .style('fill', 'white')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', barheight / 2)
      .attr('x', d => xscale(d) - barheight / 2)
      .attr('y', barheight / 2)
      .text(d => d);
  }

  render() {
    return <div id="scatterPlots"/>;
  }
}
