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


module.exports.trackTime = function (transactionID, route, staticData = {}, initialData = {}) {
  var startTime = new Date();
  var lastSearched = startTime;
  var winstonCall = winston;

  var workFunction = function ( dataToSendToWinton = {}, level = 'info' ) {
    var time = new Date();

    var totalData = {
      transactionID: transactionID,
      route: route,
      totalTime: time.valueOf() - startTime.valueOf(),
      deltaTime: time.valueOf() - lastSearched.valueOf(),
    };

    var data = Object.assign(totalData, dataToSendToWinton, staticData );
    console.log(data)
    if (level = 'info') {
      winstonCall.info(data);
    } else if (level = 'warn') {
      winstonCall.warn (data);
    } else if (level = 'error') {
      winstonCall.error (data);
    } else {
      winstonCall[level](data);
    }
    lastSearched = time;
  };

  workFunction(initialData);
  return workFunction;
};

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

