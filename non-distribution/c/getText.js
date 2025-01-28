#!/usr/bin/env node

/*
Extract all text from an HTML page.
Usage: ./getText.js <input > output
*/

const {convert} = require('html-to-text'); // takes an html string as input and returns a plain text string by stripping out the html tags
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

let htmlText = '';
rl.on('line', (line) => {
  // 1. Read HTML input from standard input, line by line using the `readline` module.
  htmlText += line;
});

// 2. after all input is received, use convert to output plain text.
rl.on('close', () => {
  console.log(convert(htmlText));
});


