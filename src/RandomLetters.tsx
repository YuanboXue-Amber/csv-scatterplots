import React, { Component } from 'react';
import * as d3 from 'd3';

export class RandomLetters extends Component<{}, {time: number}> {
  interval: NodeJS.Timeout | undefined;

  constructor() {
    super({});
    this.draw.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1500);
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  randomLetters() {
    return d3.shuffle('abcdefghijklmnopqrstuvwxyz'.split(''))
      .slice(0, Math.floor(6 + Math.random() * 20))
      .sort();
  }

  // Draw RandomLetters on div with id "RandomLetters", replace if it exists
  async draw() {
    const data = this.randomLetters();

    const width = 800;
    const height = 30;
    const fontsize = 20;
    const svg = d3
      .select('#RandomLetters')
      .selectAll('svg')
      .data([1])
      .join('svg');
    svg
      .attr('height', height)
      .attr('width', width)
      .attr('viewbox', `0 0 ${width} ${height}`)
      .attr('transform', 'translate(0, 50)')
      .attr('font-size', fontsize)
      .attr('font-family', 'monospace');

    const t = svg
      .transition()
      .duration(750);

    svg
      .selectAll('text')
      .data(data, d => (d as string))
      .join(
        enter => enter
            .append('text')
          .style('fill', 'green')
          .text(d => d)
          .attr('x', (d, i) => i * fontsize)
          .attr('y', '10%')
          // tslint:disable: no-shadowed-variable
          .call(enter => enter
            .transition(t)
            .attr('y', '80%')),
        update => update
          .style('fill', 'grey')
          .attr('y', '80%')
          .call(update => update
            .transition(t)
            .attr('x', (d, i) => i * fontsize)),
        exit => exit
          .style('fill', 'brown')
          .call(remove => remove
            .transition(t)
            .attr('y', '150%')
            .remove()),
      );
  }

  render() {
    return <div id="RandomLetters"/>;
  }
}
