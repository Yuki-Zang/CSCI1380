const id = require('../util/id');
const log = require('../util/log');

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() { };
  // TODO: implement remaining local status items

  if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
    return;
  }
  if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
    return;
  }
  if (configuration === 'nid'){
    callback(null, global.moreStatus.nid);
    return;
  }
  if (configuration === 'sid'){
    callback(null, global.moreStatus.sid);
    return;
  }
  if (configuration === 'ip'){// not sure about this part!
    if (global.nodeConfig && global.nodeConfig.ip){
        callback(null, global.nodeConfig.ip);
    }else{
        callback(new Error('IP address not found in configuration!'))
    }
    return;
  }
  if (configuration === 'port'){
    if (global.nodeConfig && global.nodeConfig.port) {
        callback(null, global.nodeConfig.port);
    } else {
        callback(new Error('Port not found in configuration!'));
    }
    return;
  }
  if (configuration === 'counts'){
    callback(null, global.moreStatus.counts);
    return;
  }
  callback(new Error('status key not found'));
};


status.spawn = function(configuration, callback) {
};

status.stop = function(callback) {
};

module.exports = status;
