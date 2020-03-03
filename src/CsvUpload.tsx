import React, { Component } from 'react';
import * as d3 from 'd3';
import { isNullOrUndefined } from 'util';
import { ScatterPlots } from './ScatterPlots';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

interface CsvUploadState { selectedFile: any; csvData: number[][]; }

export class CsvUpload extends Component<{}, CsvUploadState> {

  // Check for the various File API support.
  componentDidMount() {
    if (window.File && window.FileReader && window.Blob) {
      // all the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      selectedFile: null,
      csvData: [],
    };
    this.readCsv = this.readCsv.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  isNumber(value: string | undefined): boolean {
     return ((value != null) &&
             !isNaN(Number(value.toString())));
  }

  // Read uploaded file, parse with d3.csv, and set this.state.csvData
  readCsv(file: Blob) {
    const reader = new FileReader();
    reader.onloadend = (event) => {
      if (!isNullOrUndefined(event.target)) {
        const csvUrl = event.target.result as string; // get content of the uploaded file
        d3.csv(csvUrl).then( // read file as csv
          (data) => {
            if (data.length === 0) {
              toast.error(`Uploaded file is empty`);
            } else {
              const cols = data.columns;
              if (cols.length < 2) {
                toast.error(`CSV file needs to have at least 2 columns`);
              } else {
                // read csv file and set this.state.csvData
                const col1 = Object.keys(data[0])[0];
                const col2 = Object.keys(data[0])[1];
                const csvData: number[][] = [];
                let invalidValueFound = false;
                data.forEach((d) => {
                  const numx = d[col1];
                  const numy = d[col2];
                  if (this.isNumber(numx) && this.isNumber(numy)) {
                    csvData.push([Number(numx), Number(numy)]);
                  } else {
                    invalidValueFound = true;
                  }
                });
                if (invalidValueFound) {
                  toast.warn(`CSV fields should contain only numbers. Invalid values are ignored.`);
                }
                this.setState({
                  selectedFile: this.state.selectedFile,
                  csvData,
                });
              }
            }
          },
          (err) => {
            toast.error(`Error reading uploaded file: ${err}`);
          });
      }
    };
    reader.readAsDataURL(file);
  }

  // Validate that the uploaded file has correct type
  onChangeHandler(event: any) {
    const file = event.target.files[0];
    if (file.type === 'text/plain' || file.type === 'application/vnd.ms-excel' || file.type === 'text/csv') {
      this.setState({
        selectedFile: file,
      });
    } else {
      toast.error(`${file.type} is not a supported format. Only text/plain is supported`);
    }
  }

  onClickHandler() {
    const file = this.state.selectedFile;
    if (isNullOrUndefined(file)) { return; }
    this.readCsv(file);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="offset-md-3 col-md-6">
            <div className="form-group files">
              <label>Upload Your CSV File </label>
              <a href="sample.csv" download="sample.csv">
                <button type="button" className="btn btn-info btn-sm float-right">
                  Download a sample CSV file
                </button>
              </a>
              <input type="file" className="form-control" onChange={this.onChangeHandler} />
            </div>
            <div className="form-group">
              <ToastContainer className="toast-top-right" />
            </div>

            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>
              Upload
            </button>
            <ScatterPlots data={this.state.csvData} />
          </div>
        </div>
      </div>
    );
  }
}
