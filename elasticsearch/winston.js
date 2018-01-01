var winston = require('winston');
var Elasticsearch = require('winston-elasticsearch');

var eSearch = require('elasticsearch');
//https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new eSearch.Client( {
  hosts: 'localhost:9200',
  // log: 'trace'
});


var esTransportOpts = {
  level: 'silly',
  client: client
};

winston.remove(winston.transports.Console);
winston.exitOnError = false;

module.exports.startElasticSearchWithWinston = function () {
  if (process.env.NODE_ENV !== 'production') {
    winston.add(winston.transports.File, { filename: './logs/systemLogs.log' });
  }
  winston.add(winston.transports.Elasticsearch, esTransportOpts);
  winston.add(winston.transports.Console, {level: 'silly'});
}

module.exports.winston = winston;


///current thinking on formatting
/*
{
  function: 'currentfunction',
  transactionID: id of current transaction,
  work: 'current work being done on the item'
  stage: 'current stage of work'
  error: 'basicly notes on the error
}

*/

