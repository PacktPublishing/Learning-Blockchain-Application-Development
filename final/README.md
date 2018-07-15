# Learning Blockchain Application Development

## React, Redux, Truffle, and Material-UI Dapp

This is the _*final*_ version of the code you will be working on in the course.

Use this as a reference to check your own work, or browse the code on your own. Use the _*start*_ folder for a copy of the code, ready for you to follow along in the course with.

## Installation

1. Install node.js (version 8.9.x)

1. Install webpack globally
    ```
    npm install -g webpack
    npm install -g webpack-cli
    ```

1. Install truffle and Ganache, both available from [Truffle](https://truffleframework.com/).

1. Compile and migrate the contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

1. Run the webpack server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.
    ```javascript
    npm start
    ```

## Docker

1. Build the docker container.
    ```
    docker build -t etherslist .
    ```

1. Launch the docker container.
    ```
    docker run -p 3000:3000 etherslist:latest
    ```

1. Browse to http://localhost:3000

## FAQ

* __Why is there both a truffle.js file and a truffle-config.js file?__

    Truffle requires the truffle.js file be named truffle-config on Windows machines. Feel free to delete the file that doesn't correspond to your platform.
