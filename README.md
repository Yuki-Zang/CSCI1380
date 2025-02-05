# distribution

This is the distribution library. When loaded, distribution introduces functionality supporting the distributed execution of programs. To download it:

## Installation

```sh
$ npm i '@brown-ds/distribution'
```

This command downloads and installs the distribution library.

## Testing

There are several categories of tests:
  *	Regular Tests (`*.test.js`)
  *	Scenario Tests (`*.scenario.js`)
  *	Extra Credit Tests (`*.extra.test.js`)

### Running Tests

By default, all regular tests are run. Use the options below to run different sets of tests:

1. Run all regular tests (default): `$ npm test` or `$ npm test -- -t`
2. Run scenario tests: `$ npm test -- -c` 
3. Run extra credit tests: `$ npm test -- -ec`
4. Run the `non-distribution` tests: `$ npm test -- -nd`
5. Combine options: `$ npm test -- -c -ec -nd -t`

## Usage

To import the library, be it in a JavaScript file or on the interactive console, run:

```js
let distribution = require("@brown-ds/distribution");
```

Now you have access to the full distribution library. You can start off by serializing some values. 

```js
let s = distribution.util.serialize(1); // '{"type":"number","value":"1"}'
let n = distribution.util.deserialize(s); // 1
```

You can inspect information about the current node (for example its `sid`) by running:

```js
distribution.local.status.get('sid', console.log); // 8cf1b
```

You can also store and retrieve values from the local memory:

```js
distribution.local.mem.put({name: 'nikos'}, 'key', console.log); // {name: 'nikos'}
distribution.local.mem.get('key', console.log); // {name: 'nikos'}
```

You can also spawn a new node:

```js
let node = { ip: '127.0.0.1', port: 8080 };
distribution.local.status.spawn(node, console.log);
```

Using the `distribution.all` set of services will allow you to act 
on the full set of nodes created as if they were a single one.

```js
distribution.all.status.get('sid', console.log); // { '8cf1b': '8cf1b', '8cf1c': '8cf1c' }
```

You can also send messages to other nodes:

```js
distribution.all.comm.send(['sid'], {node: node, service: 'status', method: 'get'}, console.log); // 8cf1c
```

# M0: Setup & Centralized Computing

* name: `Yuki Zang`

* email: `matianyu_zang@brown.edu`

* cslogin: `mzang2`


## Summary

> 
My implementation involves three key components that address tasks T1–8: setting up the crawler, writing shell scripts to execute files, and deploying the project both locally and on AWS to record performance. The most challenging aspect was writing the shell scripts, as I had limited prior experience with them.


## Correctness & Performance Characterization

To characterize correctness, I developed 8 tests that test the following files:
stem.js

getText.js 

getURLs.js *2

process.sh

merge.js

query.js *2


*Performance*: The throughput of various subsystems is described in the `"throughput"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.


## Wild Guess

> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? Add that number to the `"dloc"` portion of package.json, and justify your answer below.

I believe it will take over 5,000 lines of code to build a fully distributed, scalable search engine, given the multiple components involved, such as core engine logic, scalability, concurrency, networking, deployment, and infrastructure.


# M1: Serialization / Deserialization


## Summary

Im this milestone, I implemented a serializer and deserializer for the following data types:
- Basic: Number, string, boolean, null, undefined
- Function
- Complex: date, error, object, array

The general strategy that I employed is as follows:
- Enclose each object within {} to distinguish it from others.
- Inside each object, use , as the separator between the data type and its value.
- Prefix each object with its length (number of characters) to ensure accurate delimitation during decoding. This approach proved particularly useful for handling strings containing special characters like {} as well as nested objects.

My implementation, including tests, totals approximately 200 lines of code. The key challenges involved managing recursive data structures and handling special characters used in the serialization format that could also appear within strings.


## Correctness & Performance Characterization


*Correctness*: In serialization.js, I implemented a test function to validate the functionality of my serializer for each data type. The logic is assert(a) === deserialize(serialize(a)).


*Performance*: The latency of various subsystems is described in the `"latency"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.