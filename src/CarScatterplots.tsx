import React, { Component } from 'react';
import * as d3 from 'd3';
import './CarScatterplots.css';
// tslint:disable-next-line: no-var-requires
const dsv = require('d3-dsv');

interface ICar {
  mpg: number;
  cylinders: number;
  displacement: number;
  horsepower: number;
  weight: number;
  acceleration: number;
  year: number;
  origin: string;
  name: string;
}

export class CarScatterplots extends Component<{}, {}> {
  componentDidMount() {
    this.draw();
  }

  async fetchFile() {
    const response = await fetch(
      'https://vizhub.com/curran/datasets/auto-mpg.csv',
    );
    // Check if the request is 200
    if (response.ok) {
      return response.text();
    }
    return Promise.reject(response);
  }

  async draw() {

    const csvString = await this.fetchFile();
    const data: d3.DSVParsedArray<ICar> = d3.csvParse(csvString, dsv.autoType);

    const title = 'Cars';
    const xvar = (d: ICar) => d.weight;
    const yvar = (d: ICar) => d.horsepower;
    const xinfo = 'weight';
    const yinfo = 'horsepower';
    const width = 960;
    const height = 500;
    const margin = {top: 80, left: 80, bottom: 80, right: 60};
    const innerwidth = width - margin.left - margin.right;
    const innerheight = height - margin.top - margin.bottom;
    const radius = 5;

    const svg = d3
      .select('#CarScatterplots')
      .selectAll('svg')
      .data([1])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    const xscale = d3
      .scaleLinear()
      .domain([d3.min(data, xvar) ?? 0, d3.max(data, xvar) ?? 0])
      .range([0, innerwidth])
      .nice();
    const yscale = d3
      .scaleLinear()
      .domain([d3.min(data, yvar) ?? 0, d3.max(data, yvar) ?? 0])
      .range([innerheight, 0])
      .nice();

    const xAxis = (g: any) => {
      const xAxisG = g.append('g');
      xAxisG
        .attr('transform', `translate(${margin.left}, ${margin.top + innerheight})`)
        .call(d3.axisBottom(xscale)
                .tickSizeInner(0 - innerheight)
                .tickPadding(10));
      xAxisG
        .select('.domain')
        .remove();
    };
    const yAxis = (g: any) => {
      const yAxisG = g.append('g');
      yAxisG
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yscale)
                .tickSizeInner(0 - innerwidth)
                .tickPadding(5));
      yAxisG
        .select('.domain')
        .remove();
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
          .text(`(${xvar(d)}, ${yvar(d)})`);
      })
      .on('mouseout', (d) => {
        tooltip
          .transition()
          .style('opacity', 0);
      });
  }

  render() {
    return <div id="CarScatterplots"/>;
  }
}
