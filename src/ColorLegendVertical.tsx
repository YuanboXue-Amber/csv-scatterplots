interface IColorLegendVerticalProps {
  selector: any;
  colorScale: any; // d3.ScaleOrdinal<string, string>;
  colorRadius: number;
  colorDistance: number;
  textwidth: number;
}

export function colorLegendVertical(props: IColorLegendVerticalProps) {

  const { selector, colorScale, colorRadius, colorDistance, textwidth } = props;

  const ColorLegendVerticalG = selector
    .selectAll('#ColorLegendVertical')
    .data([1])
    .join('g')
      .attr('id', 'ColorLegendVertical');

  const n = colorScale.domain().length;
  ColorLegendVerticalG
    .append('rect')
      .attr('height', (n + 1) * colorRadius * 2 + (n - 1) * colorDistance)
      .attr('width', textwidth)
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('x', '1')
      .attr('fill', 'white')
      .attr('opacity', '0.7')
      .attr('ry', colorRadius * 2);

  const labels = ColorLegendVerticalG
    .selectAll('g')
    .data(colorScale.domain())
    .join('g')
      .attr('class', 'ColorLegendVertical-label')
      .attr('transform', `translate(${colorRadius}, ${colorRadius})`);
  labels
    .append('circle')
      .attr('r', colorRadius)
      .attr('fill', (d: string) => colorScale(d) as string)
      .attr('cx', colorRadius)
      .attr('cy', (d: string, i: number) => colorRadius + i * (colorDistance + 2 * colorRadius));
  labels
    .append('text')
      .text((d: string) => d)
      .attr('x', colorRadius * 2.5)
      .attr('y', (d: string, i: number) => colorRadius + i * (colorDistance + 2 * colorRadius))
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '0.8em')
      .attr('font-family', 'sans-serif');
}
