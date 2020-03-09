import React, { Component } from 'react';
import * as d3 from 'd3';
import './TemperatureLineArea.css';
// tslint:disable-next-line: no-var-requires
const dsv = require('d3-dsv');

interface ITempr {
  timestamp: Date;
  temperature: number;
}

export class TemperatureLineArea extends Component<{}, {}> {
  componentDidMount() {
    this.draw();
  }

  async fetchFile() {
    const response = await fetch(
      'https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv',
    );
    // Check if the request is 200
    if (response.ok) {
      return response.text();
    }
    return Promise.reject(response);
  }

  async draw() {

    const csvString = await this.fetchFile();
    const data: d3.DSVParsedArray<ITempr> = d3.csvParse(csvString, dsv.autoType);

    const title = 'Temperatures in a week';
    const xvar = (d: ITempr) => d.timestamp;
    const yvar = (d: ITempr) => d.temperature;
    const xinfo = 'date';
    const yinfo = 'temperature';
    const width = 960;
    const height = 500;
    const margin = {top: 80, left: 80, bottom: 80, right: 60};
    const innerwidth = width - margin.left - margin.right;
    const innerheight = height - margin.top - margin.bottom;
    const radius = 5;

    const svg = d3
      .select('#TemperatureLineArea')
      .selectAll('svg')
      .data([1])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    const xscale = d3
      .scaleTime()
      .domain([d3.min(data, xvar) ?? 0, d3.max(data, xvar) ?? 0])
      .range([0, innerwidth]);
    const yscale = d3
      .scaleLinear()
      .domain([d3.min(data, yvar) ?? 0, d3.max(data, yvar) ?? 0])
      .range([innerheight, 0]);

    const xAxis = (g: any) => {
      const xAxisG = g.append('g');
      xAxisG
        .attr('transform', `translate(${margin.left}, ${margin.top + innerheight})`)
        .call(d3.axisBottom(xscale)
                .tickSizeInner(0 - innerheight)
                .tickPadding(10)
                .ticks(d3.timeHour.every(12)));

    };
    const yAxis = (g: any) => {
      const yAxisG = g.append('g');
      yAxisG
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yscale)
                .tickSizeInner(0 - innerwidth)
                .tickPadding(5));
    };

    const xTitle = (g: any) => {
      const xTitleG = g.append('g');
      xTitleG
        .attr('class', 'axisTitle')
        .attr('transform', `translate(${margin.left + innerwidth / 2}, ${margin.top + innerheight + 50})`)
        .attr('text-anchor', 'middle')
        .append('text')
          .text(xinfo);
    };
    const yTitle = (g: any) => {
      const yTitleG = g.append('g');
      yTitleG
        .attr('class', 'axisTitle')
        .attr('transform', `translate(40, ${margin.top + innerheight / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .append('text')
          .text(yinfo);
    };

    const chartTitle = (g: any) => {
      const titleG = g.append('g');
      titleG
        .attr('class', 'chart-title')
        .attr('transform', `translate(${margin.left + innerwidth / 2}, 50)`)
        .attr('text-anchor', 'middle')
        .append('text')
          .text(title);
    };

    svg.call(xAxis);
    svg.call(yAxis);
    svg.call(xTitle);
    svg.call(yTitle);
    svg.call(chartTitle);

    const dots = svg
      .append('g')
        .attr('class', 'dots')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('r', radius)
        .attr('cx', d => xscale(xvar(d)) + margin.left)
        .attr('cy', d => yscale(yvar(d)) + margin.top);
    const tooltip = svg.append('g')
      .attr('class', 'mytooltip')
      .append('text')
      .style('opacity', 0);
    dots
      .on('mouseover', function (d) {
        tooltip
          .transition()
          .style('opacity', 1);
        tooltip
          .attr('x', d3.select(this).attr('cx'))
          .attr('y', d3.select(this).attr('cy'))
          .text(`(${xvar(d).getUTCHours()}h, ${yvar(d).toFixed(1)})`);
      })
      .on('mouseout', (d) => {
        tooltip
          .transition()
          .style('opacity', 0);
      });

    const lineGenerator = d3.line<ITempr>()
      .x((d) => xscale(xvar(d)) + margin.left)
      .y((d) => yscale(yvar(d)) + margin.top)
      .curve(d3.curveBasis);

    const areaGenerator = d3.area<ITempr>()
      .x((d) => xscale(xvar(d)) + margin.left)
      .y0(innerheight + margin.top)
      .y1((d) => yscale(yvar(d)) + margin.top);

    svg
      .append('g')
        .attr('class', 'temp-line')
        .append('path')
          .attr('d', lineGenerator(data) ?? '');

    svg
      .append('g')
        .attr('class', 'temp-area')
        .append('path')
          .attr('d', areaGenerator(data) ?? '');
  }

  render() {
    return <div id="TemperatureLineArea"/>;
  }
}
