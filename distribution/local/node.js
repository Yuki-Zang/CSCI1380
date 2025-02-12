const http = require('http');
const url = require('url');
const log = require('../util/log');
const serialization = require('../util/serialization');

/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/


const start = function(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */

    // Write some code...
    if (req.method != 'PUT'){
        res.writeHead(405, {'Content-Type': 'application/json'});
        //check the following line
        res.end(JSON.stringify({ error: 'Only PUT requests are allowed' }));
        return;
    }

    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */

    // Write some code...
    const parsedUrl = url.parse(req.url, true);
    const parsedParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (parsedParts.length != 2){
        res.writeHead(404, {'Content-Type': 'application/json'});
        // check if it's okay to use my own serializer!
        res.end(JSON.stringify({ error: 'Invalid request format!' }));
    }
    
    // extract the service name and the method name
    const service = parsedParts[0]; 
    const method = parsedParts[1];  

    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */

    // Write some code...
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    })


      /* Here, you can handle the service requests. */

      // Write some code...
    req.on('end', () => {
        try{
            //parse the input data 
            const jsonData = serialization.deserialize(body); 
            if (!global.serviceMap || !global.serviceMap[service] || !global.serviceMap[service][method]){
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Service or method not found!'}))
                return;
            }

            // process the data CHECK HERE!!!!
            global.serviceMap[service][method](jsonData[0], (err, result)=>{
                if (err){
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: err.message}));
                }else{
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(serialization.serialize(result))
                }
            });
        }catch (error){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON!' }));
        }
    })

    //   const serviceName = service;
        // Write some code...
  });


  // Write some code...

  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the `callback` callback when your server has successfully
    started.

    At some point, we'll be adding the ability to stop a node
    remotely through the service interface.
  */

  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    log(`Server running at http://${global.nodeConfig.ip}:${global.nodeConfig.port}/`);
    global.distribution.node.server = server;
    callback(server);
  });

  server.on('error', (error) => {
    // server.close();
    log(`Server error: ${error}`);
    throw error;
  });
};

module.exports = {
  start: start,
};
