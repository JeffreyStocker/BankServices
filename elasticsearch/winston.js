var winston = require('winston');
var wElastic = require('winston-elasticsearch');

var Elasticsearch = require('winston-elasticsearch');

var esTransportOpts = {
  level: 'info'
};

winston.add(winston.transports.Elasticsearch, esTransportOpts);
winston.add(winston.transports.File, { filename: 'systemLogs.log' });


module.exports.winston = winston;

winston.log('info', 'testings')
