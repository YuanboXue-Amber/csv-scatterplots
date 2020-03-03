import React from 'react';
import { render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ScatterPlots } from '../src/ScatterPlots';

configure({ adapter: new Adapter() });

test('scatterPlots with input data renders correct html', () => {
  const scatterPlots = render(<ScatterPlots data={[[1.1, 1.2], [2.3, 2.5], [5.6, 7.9], [12.0, 13.4], [-3, -2.0]]} />);
  expect(scatterPlots.container).toMatchSnapshot();
});

test('scatterPlots with empty data renders correct html, has componentDidMount triggered', () => {
  const spy = jest.spyOn(ScatterPlots.prototype, 'componentDidMount');
  const scatterPlots = render(<ScatterPlots data={[]} />);
  expect(spy).toHaveBeenCalled();
  expect(scatterPlots.container).toMatchSnapshot();
});
