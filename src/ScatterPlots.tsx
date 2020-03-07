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
    const svg = d3.select('#scatterPlots').select('svg');
    const height = 500;
    const width = 800;
    svg
      .attr('transform', 'translate(0, 50)')
      .attr('height', height).attr('width', width)
      .attr('font-size', 10)
      .attr('text-anchor', 'end');

    const xscale =
      d3.scaleLinear()
        .domain([0, d3.max(data) ?? 0])
        .range([0, width]);
    const yscale =
      d3.scaleBand()
        .domain(d3.range(data.length).map(String))
        .range([0, Math.min(height, 22 * data.length)]);

    const bar =
      svg.selectAll('g')
         .data(data)
         .join('g')
         .attr('transform',
              (d, i) => `translate(0, ${yscale(i.toString())})`);

    bar.append('rect')
       .attr('fill', 'steelblue')
       .attr('width', d => xscale(d)).attr('height', yscale.bandwidth() - 2);
       // why does it put in the bottom of <g> elm?? maybe because append means last child?

    bar.append('text')
       .attr('fill', 'white')
       .text(d => d.toString())
       .attr('x', d => xscale(d) - 10)
       .attr('y', yscale.bandwidth() / 2 + 2 );
  }

  render() {
    return <div id="scatterPlots">
            <svg />
           </ div>;
  }
}
