This is a one-page React App that accepts uploaded **CSV** file, and displays it as a **Scatterplots**.

## App Demo

Download the sample file -> Upload it to see scatterplots -> Try another file -> Try a file that is not CSV and get error.

The same demo can be viewed with better resolution from ./csv-app-demo.mp4

![Demo](/csv-app-demo.gif)

------------

## Start this App from Docker

In the project directory, there is a `Dockerfile` based on **Ubuntu**.

A build.sh file drives the build of this `Dockerfile`. It takes 1 argument from command line, which is the port number of where this application will be served.

### How to run

1. In terminal:
    >`sh build.sh 8080`

2. Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### Dockerfile workflow

1. Install node and npm using nvm.
2. Install this app at `/usr/local/csv-app`.
3. Install npm package `serve` to serve this app.
4. Bundle and **Test** this app.
5. Start serving at port 80 within the docker container.

------------

## Start this App from local

`npm install` to install dependencies.

`npm start` to run this app. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Test this project by `npm test`.

------------

## Folder Structure Explained

Here are the important files in this project.
Also each *.tsx file has detailed comments.

```
project
│
└───src
│   │   index.tsx  -------------------------- Entry point of the App
│   │   CsvUpload.tsx  ---------------------- Accept CSV file uploaded from local
│   │   ScatterPlots.tsx  ------------------- Display uploaded CSV into ScatterPlots
│
└───test  ----------------------------------- Tests written using jest and enzyme
│   │   CsvUpload.test.tsx
│   │   ScatterPlots.test.tsx
│   |
│   ───__snapshots__
│       │   CsvUpload.test.tsx.snap
│       │   ScatterPlots.test.tsx.snap
│
└───public
│   │   index.html  ------------------------- The single page displayed on browser, with some styling
│   │   sample.csv  ------------------------- A sample CSV for user to download and try
```

------------

### References

I am new to React+d3 and I was learning by googling while doing this project.
Therefore I think it is fair to list the articles which helped me most :)

>[React file upload: proper and easy way, with NodeJS!](https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/)
>
>[D3 Scatterplot Example](http://bl.ocks.org/weiglemc/6185069)
>
>[Install node and npm with nvm using Docker](https://gist.github.com/remarkablemark/aacf14c29b3f01d6900d13137b21db3a)
