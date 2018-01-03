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
  index: 'logs',
  client: client
};

// winston.exitOnError = false;

module.exports.startElasticSearchWithWinston = function () {
  if (process.env.NODE_ENV !== 'production') {
  }
  winston.add(winston.transports.File, { filename: './logs/systemLogs.log' });
  winston.add(winston.transports.Elasticsearch, esTransportOpts);
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {level: 'silly'});
};
// module.exports.startElasticSearchWithWinston();

module.exports.winstonDatabase = function () {

};

module.exports.trackTime = function (transactionID, route) {
  var startTime = new Date();
  var lastSearched = startTime;
  var winstonCall = winston;
  //      type: 'message',
  // stage: 'send to database',

  var workFunction = function ( dataToSendToWinton = {} ) {
    var time = new Date();

    var defaultInfo = {
      transactionID: transactionID,
      totalTime: time.valueOf() - startTime.valueOf(),
      DeltaTime: time.valueOf() - lastSearched.valueOf(),
      route: route
    };
    var data = Object.assign(defaultInfo, dataToSendToWinton );
    winstonCall.info (data);

    lastSearched = time;
  };
  workFunction();
  return workFunction;
};

module.exports.winston = winston;

module.exports.retrieveTransactionID = function () {
  try {
    var id = transactionID;
  } catch (err) {
    var id = 'unknown';
  }
  return id;
};
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

