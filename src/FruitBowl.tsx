import React, { Component } from 'react';
import * as d3 from 'd3';
import './FruitBowl.css';

interface IFruit {
  type: 'apple' | 'lemon'; id: number;
}

export class FruitBowl extends Component<{}, {time: number}> {
  interval: NodeJS.Timeout | undefined;

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 7000); // re-render every 5s
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Draw FruitBowl on div with id "FruitBowl", replace if it exists
  async draw() {

    const width = 960;
    const height = 500;
    const margin = {top: 20, left: 20, bottom: 20, right: 20};
    // const innerwidth = width - margin.left - margin.right;
    const innerheight = height - margin.top - margin.bottom;

    const colorScale = d3.scaleOrdinal()
      .domain(['apple', 'lemon'])
      .range(['#c11d1d', '#eae600']);
    const sizeScale = d3.scaleOrdinal()
      .domain(['apple', 'lemon'])
      .range([50, 30]);

    const svg = d3
      .select('#FruitBowl')
      .selectAll('svg')
      .data([null])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    // make bowl
    svg
      .selectAll('.bowl')
      .data([null])
      .enter()
      .append('g').attr('class', 'bowl')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .append('rect')
          .attr('height', height / 2)
          .attr('width', width * 0.75)
          .attr('rx', height / 2);

    // make fruits
    const transitionConfigure = (transition: any) => {
      return transition
          .duration(500);
    };

    const transit2NewAttr = (circleSelection: any, textSelection: any) => {
      circleSelection
        .transition().call(transitionConfigure)
        .attr('fill', (d: IFruit) => colorScale(d.type))
        .attr('r',  (d: IFruit) => sizeScale(d.type));
      textSelection
        .attr('text-anchor', 'middle')
        .transition().call(transitionConfigure)
        .text((d: IFruit) => d.type);
    };

    const renderFruits = (data: IFruit[]) => {
      const group = svg
        .selectAll('.fruit')
        .data(data, d => String((d as IFruit).id));
      group
        .transition().call(transitionConfigure)
        .attr('transform', (d: IFruit, i: number) => `translate(${120 + i * 120}, ${innerheight / 4 + 30})`);
      transit2NewAttr(group.selectAll('circle'), group.selectAll('text'));

      const groupEnter = group
        .enter()
        .append('g').attr('class', 'fruit')
        .attr('transform', (d: IFruit, i: number) => `translate(${120 + i * 120}, ${innerheight / 4 + 30})`);
      transit2NewAttr(groupEnter.append('circle'), groupEnter.append('text'));

      const groupExit = group
        .exit();
      groupExit.selectAll('circle')
        .transition().call(transitionConfigure)
        .attr('r',  0);
      groupExit.remove();
    };

    // original data for fruit
    const fruitsData: IFruit[] = [];
    let initSize = 5;
    while (initSize --) {
      fruitsData.push({type: 'apple', id: Math.random()});
    }
    renderFruits(fruitsData);

    setTimeout(() => {
      fruitsData.pop();
      renderFruits(fruitsData);
    }, 1000);

    setTimeout(() => {
      fruitsData[2].type = 'lemon';
      renderFruits(fruitsData);
    }, 2000);

    setTimeout(() => {
      renderFruits(fruitsData.filter((d, i) => i !== 1));
    }, 3000);
  }

  render() {
    return <div id="FruitBowl"/>;
  }
}
