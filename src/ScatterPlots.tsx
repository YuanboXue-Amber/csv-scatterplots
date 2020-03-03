import React, { Component } from 'react';
import * as d3 from 'd3';
import { isNullOrUndefined } from 'util';

export class ScatterPlots extends Component<{data: any[]}, {}> {
  componentDidMount() {
    this.draw();
  }

  // Draw scatterPlots on div with id "scatterPlots", replace if it exists
  draw() {
    const csvData = this.props.data;

    const width = 600; // svg width
    const height = 500; // svg height
    d3.select('svg').remove();
    const svg = d3
      .select('#scatterPlots') // pick div with id scatterPlots
      .append('svg')
      .attr('width', width).attr('height', height)
      .attr('align', 'center');

    const xAxisWidth = 300;
    const yAxisWidth = 300;

    // set scale for x
    let maxOfx = d3.max(csvData, (d) => d[0]);
    if (isNullOrUndefined(maxOfx)) { maxOfx = 0; }
    let minOfx = d3.min(csvData, (d) => d[0]);
    if (isNullOrUndefined(minOfx)) { minOfx = 0; }
    const xScale = d3.scaleLinear()
      .domain([1.2 * minOfx, 1.2 * maxOfx])
      .range([0, xAxisWidth]);

    // set scale for y
    let maxOfy = d3.max(csvData, (d) => d[1]);
    if (!maxOfy) { maxOfy = 0; }
    let minOfy = d3.min(csvData, (d) => d[1]);
    if (!minOfy) { minOfy = 0; }
    const yScale = d3.scaleLinear()
      .domain([1.2 * minOfy, 1.2 * maxOfy])
      .range([yAxisWidth, 0]);

    const padding = { top: 30, right: 30, bottom: 100, left: 100 };

    // draw x and y axis on svg
    const xAxis = d3.axisBottom(xScale);
    svg
      .append('g')
      .attr('class', 'axis')
      .attr(
        'transform',
        `translate(${padding.left}, ${(height - padding.bottom)})`,
      )
      .call(xAxis);
    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .attr('class', 'axis')
      .attr(
        'transform',
        `translate(${padding.left}, ${(height - padding.bottom - yAxisWidth)})`,
      )
      .call(yAxis);

    // add the tooltip for mouseover dots
    const tooltip = d3.select('#scatterPlots').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    // get offset of the svg element, to be used to calculate mouseover position
    let svgOffsetLeft = 0;
    let svgOffsetTop = 0;
    const svgElement = document.getElementById('scatterPlots');
    if (!isNullOrUndefined(svgElement)) {
      svgOffsetLeft = svgElement.offsetLeft;
      svgOffsetTop = svgElement.offsetTop;
    }

    // draw dots on svg
    yScale.range([0, yAxisWidth]);
    // eslint-disable-next-line
    const circle = svg
      .selectAll('circle')
      .data(csvData)
      .enter()
      .append('circle')
      .attr('fill', 'goldEnrod') // color
      .attr('cx', (d) => {
        return padding.left + xScale(d[0]);
      })
      .attr('cy', (d) => {
        return height - padding.bottom - yScale(d[1]);
      })
      .attr('r', 5) // radius
      .on('mouseover', function (d) {
          tooltip.transition()
               .style('opacity', .9);
          tooltip.text(`(${d[0]}, ${d[1]})`)
               .style('left', (parseInt(d3.select(this).attr('cx'), 10) + svgOffsetLeft) + 'px')
               .style('top', (parseInt(d3.select(this).attr('cy'), 10) + svgOffsetTop) + 'px');
      })
      .on('mouseout', (d) => {
          tooltip.transition()
               .style('opacity', 0);
      });
  }

  render() {
    this.draw();
    return <div id="scatterPlots"/>;
  }
}
