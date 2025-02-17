const distribution = require('../config.js');
const local = distribution.local;
const id = distribution.util.id;

const config = distribution.node.config;

test('status get: invalid arguments', (done) => {
  local.status.get('invalidArg', (e, v) => {
    try {
      expect(e).toBeTruthy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('status get: nid', (done) => {
  local.status.get('nid', (e, v) => {
    try {
      expect(e).toBeFalsy();
      console.log(v);
      expect(v).toBe('8cf1b7dfcc03aaad55ac5448d8afd324e697b35c1e95eca61bfa4125a9c8419e');
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('routes put: an empty function', (done) => {  
    local.routes.put(()=>{}, 'emptyFunc', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('emptyFunc');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

test('routes put: greetings', (done) => {  
    local.routes.put('i am fine', 'how are you', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('how are you');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

test('routes get: more function', (done) => {  
    local.routes.get('how are you', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('i am fine');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  test('routes get: invalid', (done) => {  
    local.routes.get('i am fine', (e, v) => {
      try {
        expect(e).toBeTruthy();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

test('routes rem: remove function', (done) => {  
    local.routes.rem('emptyFunc', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('emptyFunc');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

test('routes rem: remove invalid', (done) => {  
    local.routes.rem('invalid', (e, v) => {
      try {
        expect(e).toBeTruthy();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

test('comm send: remove greetings', (done) => {
    const node = distribution.node.config;
  
    const remote = {node: node, service: 'routes', method: 'rem'};
    const message = ['how are you']; // Arguments to the method
  
    local.comm.send(message, remote, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('how are you');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  test('comm send: get an invalid func', (done) => {
    const node = distribution.node.config;
    const remote = {node: node, service: 'routes', method: 'get'};
    const message = ['invalidFunc'];
  
    local.comm.send(message, remote, (e, v) => {
      try {
        expect(e).toBeTruthy();
        expect(e).toBeInstanceOf(Error);
        expect(v).toBeFalsy();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

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