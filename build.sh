#!/usr/bin/env bash

echo 'localhost port: ' $1

# confirm docker daemon is running and connected
docker version

# build the image "yuanbo-csv-app" based on the Dockerfile
docker build -t yuanbo-csv-app .

# run container
docker run -it -p $1:80 yuanbo-csv-app