const request = require('request');
const Promise = require('bluebird');

class Request {
  constructor(options) {
    this.requestInstance = request.defaults({ ...options });

    this.jar = request.jar();

    this.Get = Promise.promisify(this.requestInstance.get);
    this.Post = Promise.promisify(this.requestInstance.post);
    this.Put = Promise.promisify(this.requestInstance.put);
    this.Delete = Promise.promisify(this.requestInstance.delete);
  }
}

module.exports = Request;
