var winston = require('winston');
var Elasticsearch = require('winston-elasticsearch');

var eSearch=require('elasticsearch');
//https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new eSearch.Client( {
  hosts: 'localhost:9200',
  // log: 'trace'
});


var esTransportOpts = {
  level: 'silly',
  client: client
};

if (process.env.NODE_ENV !== 'production') {
  winston.add(winston.transports.File, { filename: './logs/systemLogs.log' });
}
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level: 'silly'});
winston.add(winston.transports.Elasticsearch, esTransportOpts)
winston.exitOnError = false;

module.exports.winston = winston;

