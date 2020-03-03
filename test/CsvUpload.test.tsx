import React from 'react';
import { render } from '@testing-library/react';
import { CsvUpload } from '../src/CsvUpload';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('CsvUpload has componentDidMount triggered', () => {
  const spy = jest.spyOn(CsvUpload.prototype, 'componentDidMount');
  shallow(<CsvUpload />);
  expect(spy).toHaveBeenCalled();
});

test('CsvUpload renders correct html', () => {
  const csvUpload = render(<CsvUpload />);
  expect(csvUpload.container).toMatchSnapshot();
});

describe('CsvUpload calls onChangeHandler when file is uploaded.', () => {
  let component: any;
  beforeEach(() => {
      component = shallow(<CsvUpload />);
  });

  test('Image uploaded, state.selectedFile should be undefined', () => {
    const event = {
      preventDefault() {},
      target: {
        files: [
          {type: 'image/jpeg'},
        ],
      },
    };
    component.find('input').simulate('change', event);
    expect(component.state()).toMatchSnapshot();
  });

  test('Text file uploaded, state.selectedFile should be changed', () => {
    const event = {
      preventDefault() {},
      target: {
        files: [
          {type: 'text/plain'},
        ],
      },
    };
    component.find('input').simulate('change', event);
    expect(component.state()).toMatchSnapshot();
  });
});

test('CsvUpload calls onClickHandler when upload buttom is clicked', () => {
  jest.spyOn(CsvUpload.prototype, 'onClickHandler');

  const component = shallow(<CsvUpload />);
  const file = new Blob([''], {type: 'text/plain;charset=ISO-8859-1'});
  component.setState({ selectedFile: file, csvData: [] });
  const event = {
    preventDefault() {},
    target: {
      files: [file],
    },
  };

  const buttons = component.find('button');
  expect(buttons.length).toBe(2);

  const uploadButton = component.find('button').at(1);
  uploadButton.simulate('click', event);
  expect(CsvUpload.prototype.onClickHandler).toHaveBeenCalledWith(event);
});
