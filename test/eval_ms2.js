const distribution = require('../config.js');
const local = distribution.local;
const id = distribution.util.id;

jest.setTimeout(15000);

function sendRequest(message, service = "status") {
      const node = distribution.node.config;
      const remote = { node: node, service: service, method: "get" };
      local.comm.send(message, remote, (e, v) => {});
  }

  test("comm performance", () => {
    const start = performance.now();
  
    for (let i = 0; i < 250; i++) {
      sendRequest(["nid"]);
      sendRequest(["sid"]);
      sendRequest(["invalid"]);
      sendRequest(["sid"], "invalid");
    }
  
    const end = performance.now();
    const duration = end - start;
  
    console.log(`The average throughput for 1000 comm requests is ${1000 / duration}`);
    console.log(`The average latency for 1000 comm requests is ${duration / 1000}`);
  });

  test('rpc performance', (done) => {
    let n = 0;
    const addOne = () => {
      return ++n;
    };
  
    const node = {ip: '127.0.0.1', port: 9009};
  
    //creates the RPC function, which will be sent to n1 (127.0.0.1)
    let addOneRPC = distribution.util.wire.createRPC(distribution.util.wire.toAsync(addOne));
    let loops = 0;

    const rpcService = {
      addOne: addOneRPC,
    };
  
    function cleanup(callback) {
    // localServer.close();
    distribution.local.comm.send([],
        {node: node, service: 'status', method: 'stop'},
        callback);
    }
  
      // Spawn the remote node.
      distribution.local.status.spawn(node, (e, v) => {
        if (e){
          console.error("Error spawning node:", e);
          return;
        }
        });

        let start = performance.now();
        for (let i = 0; i < 1000; i++){
            // Install the addOne service on the remote node with the name 'addOneService'.
            distribution.local.comm.send([rpcService, 'addOneService'],
                {node: node, service: 'routes', method: 'put'}, (e, v) => {   
                    loops += 1;
                    
                    if (loops == 1000){
                        let end = performance.now();
                        let duration = end - start;
                        console.log(`The average throughput for 1000 rpc requests is ${1000 / duration}`);
                        console.log(`The average latency for 1000 rpc requests is ${duration / 1000}`);
                        cleanup(done);
                    }
            });
        }
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