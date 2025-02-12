/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const serialization = require("../util/serialization");
const http = require('node:http');

/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message, remote, callback) {
    const { node, service, method } = remote;
    if (!node||!node.ip||!node.port){
        return callback(new Error('Invalid remote node information!'));
    }

    const path = `/${service}/${method}`
    const serializedData = serialization.serialize(message);

    const config = {
        host: node.ip,
        port: node.port,
        path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(serializedData)
        }
    };

    const req = http.request(config, (res) => {
        //receive data
        let data = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = serialization.deserialize(data);
                callback(null, response);
            } catch (error) {
                callback(new Error('Invalid JSON response from server'));
            }
        });
    });

    req.on('error', (err) => callback(err)); //event listener for error event
    req.write(serializedData); // writes the data
    req.end();
}

module.exports = {send};
