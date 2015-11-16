var _ = require('lodash');
var Q = require('q');
var debug = require('debug')('aglex.core');
var aglexLib = require('./aglexLib');

var Aglex = function(config, logLevel) {
  this.config = config;
  this.logLevel = logLevel;
};

Aglex.prototype = {
  updateApi: function() {
    debug('updateApi called');
    var lib = aglexLib(this.config, this.logLevel);
    return lib.getLambda()
      .then(function(lambda) {
        return lib.getApi();
      })
      .then(function(api) {
        return lib.checkResources(api);
      })
      .then(function(resources) {
        var arr = resources.map(function(resource) {
          return function() {
            return lib.checkMethods(resource);
          };
        });
        return arr.reduce(Q.when, Q.resolve());
      });
  },

  updateLambda: function(file) {
    debug('updateLambda called');
    var lib = aglexLib(this.config, this.logLevel);
    return lib.updateLambda(file);
  },

  addLambdaPermission: function() {
    debug('addLambdaPermission called');
    var lib = aglexLib(this.config, this.logLevel);
    return lib.addLambdaPermission();
  }
};

module.exports = function(config, logLevel) {
  return new Aglex(config, logLevel);
};
