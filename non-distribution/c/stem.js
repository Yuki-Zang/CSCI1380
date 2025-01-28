#!/usr/bin/env node

/*
Convert each term to its stem
Usage: ./stem.js <input >output
*/

const readline = require('readline'); // importing the readline library in node.js
const natural = require('natural');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', function(line) {// this is an event listener; gets executed whenever a new line is input
  // Print the Porter stem from `natural` for each element of the stream.
  // TODO BEGINS =========
  const stem = natural.PorterStemmer.stem(line.trim());
  console.log(stem); // write to the stdout, but when we do ./stem.js <input >output, we specify the stdout
  // TODO ENDS =========
});
