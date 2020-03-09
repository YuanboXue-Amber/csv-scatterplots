import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { BarChart } from './BarChart';
// import { RandomLetters } from './RandomLetters';
import { CarScatterplots } from './CarScatterplots';

ReactDOM.render(
  <div className="container">
    {/* <div className="container">
      <BarChart />
    </ div>
    <div className="container">
      <RandomLetters />
    </ div> */}
    <div className="container">
      <CarScatterplots />
    </ div>
  </ div>,
  document.getElementById('root'),
);
