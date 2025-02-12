/** @typedef {import("../types").Callback} Callback */

serviceMap = {}

/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    callback = callback || function(){};
    console.log(serviceMap);
    if(serviceMap[configuration]){
        callback(null, serviceMap[configuration]);
    }else{
        callback(new Error('Service not found!'));
    }
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
    callback = callback || function (){};

    if (service && configuration){
        serviceMap[configuration] = service;
        callback(null, configuration);
    }else{
        callback(new Error('Invalid service or configuration!'))
    }
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {//remove the configuration from the service map
    callback = callback || function(){};

    if (serviceMap[configuration]){
        delete serviceMap[configuration];
        callback(null, configuration);
    }else{
        callback(new Error('Service not found!'));
    }
};

module.exports = {get, put, rem};
