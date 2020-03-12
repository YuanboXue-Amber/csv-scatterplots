import React, { Component } from 'react';
import * as d3 from 'd3';
import './WorldTree.css';

interface IWorldTree {
  'data': { 'id': string; };
  'children': IWorldTree[];
}

export class WorldTree extends Component<{}, {}> {
  componentDidMount() {
    this.draw();
  }

  // Draw WorldTree on div with id "WorldTree", replace if it exists
  async draw() {

    const data: IWorldTree = await d3.json(process.env.PUBLIC_URL + '/worldTreeData.json');

    const width = 960;
    const height = 800;
    const margin = {top: 0, left: 60, bottom: 0, right: 100};
    const innerwidth = width - margin.left - margin.right;
    const innerheight = height - margin.top - margin.bottom;

    const svg = d3
      .select('#WorldTree')
      .selectAll('svg')
      .data([1])
      .join('svg')
        .attr('height', height)
        .attr('width', width);

    const zoomG = svg
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const g = zoomG.append('g'); // 2 layers of g keeps the margin when zooming

    const worldTreeLayout = d3.tree<IWorldTree>().size([innerheight, innerwidth]);
    const root: d3.HierarchyNode<IWorldTree> = d3.hierarchy(data);
    const links: d3.HierarchyPointLink<IWorldTree>[] = worldTreeLayout(root).links();
    const linkPathGenerator = d3.linkHorizontal<d3.HierarchyPointLink<IWorldTree>, d3.HierarchyNode<IWorldTree>>()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    g
      .selectAll('path')
      .data(links)
      .join('path')
        .attr('d', (d: d3.HierarchyPointLink<IWorldTree>) => linkPathGenerator(d));

    const allNotes: d3.HierarchyNode<IWorldTree>[] = root.descendants();
    g
      .selectAll('text')
      .data(allNotes)
      .join('text')
        .attr('x', (d: any) => d.y)
        .attr('y', (d: any) => d.x)
        .attr('dy', '0.3em')
        .attr('text-anchor', d => d.children ? 'middle' : 'start')
        .attr('font-size', d => 3.25 - d.depth + 'em')
        .text(d  => d.data.data.id);

    // zoom
    const zoom = d3.zoom()
      .on('zoom', () => {
        zoomG.attr('transform', d3.event.transform);
      });
    svg.call(zoom as any);
  }

  render() {
    return <div id="WorldTree"/>;
  }
}
