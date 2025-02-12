const distribution = require('../config.js');
const local = distribution.local;
const id = distribution.util.id;

function sendRequest(message, service = "status") {
    return new Promise((resolve) => {
      const node = distribution.node.config;
      const remote = { node: node, service: service, method: "get" };
      local.comm.send(message, remote, (e, v) => resolve());
    });
  }


  test("evaluate performances", async () => {
    const start = performance.now();
  
    const requests = [];
    for (let i = 0; i < 250; i++) {
      requests.push(sendRequest(["nid"]));
      requests.push(sendRequest(["sid"]));
      requests.push(sendRequest(["invalid"]));
      requests.push(sendRequest(["sid"], "invalid"));
    }
  
    await Promise.all(requests); // Ensure all requests finish before measuring time
  
    const end = performance.now();
    const duration = end - start;
  
    console.log(`The average throughput for 1000 comm requests is ${1000 / duration}`);
    console.log(`The average latency for 1000 comm requests is ${duration / 1000}`);
  });

/* Test infrastructure */

let localServer = null;

beforeAll((done) => {
  distribution.node.start((server) => {
    localServer = server;
    done();
  });
});

afterAll((done) => {
  localServer.close();
  done();
});
