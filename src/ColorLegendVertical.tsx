interface IColorLegendVerticalProps {
  selector: any;
  colorScale: any;
  colorRadius: number;
  colorDistance: number;
  textwidth: number;
  onClick: any;
  clickedDomain: string | undefined;
}

export function colorLegendVertical(props: IColorLegendVerticalProps) {

  const { selector, colorScale, colorRadius, colorDistance, textwidth, onClick, clickedDomain } = props;
  const colordiam = colorRadius * 2;

  const ColorLegendVerticalG = selector
    .selectAll('#ColorLegendVertical')
    .data([1])
    .join('g')
      .attr('id', 'ColorLegendVertical');

  const n = colorScale.domain().length;
  ColorLegendVerticalG
    .selectAll('rect')
    .data([null])
    .join('rect')
      .attr('height', (n + 1) * colordiam + (n - 1) * colorDistance)
      .attr('width', textwidth)
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('x', '1')
      .attr('fill', 'white')
      .attr('opacity', '0.7')
      .attr('ry', colordiam);

  const labels = ColorLegendVerticalG
    .selectAll('g')
    .data(colorScale.domain())
    .join('g')
      .attr('class', 'ColorLegendVertical-label')
      .attr('transform', (d: any, i: number) => `translate(${colordiam}, ${(i + 1) * colordiam + i * colorDistance})`)
      .attr('cursor', 'pointer')
      .attr('opacity', (d: any) =>
          (!clickedDomain || d === clickedDomain)
          ? 1
          : 0.2,
        )
      .on('click', (d: any) =>
          onClick(d === clickedDomain ? null : d),
        );

  labels.selectAll('circle')
    .data((d: string) => [d])
    .join('circle')
      .attr('r', colorRadius)
      .attr('fill', (d: string) => colorScale(d) as string);

  labels.selectAll('text')
    .data((d: string) => [d])
    .join('text')
      .text((d: string) => d)
      .attr('dx', colorRadius * 1.5)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '0.8em')
      .attr('font-family', 'sans-serif');
}
