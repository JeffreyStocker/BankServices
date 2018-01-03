var { read } = require ('fs');
var { transactionById } = require('dwolla');
var { sendMessageToCashoutQueue, sendMessageToTransactionsQueue } = require('./messages');
const { winston, retrieveTransactionID, trackTime } = require('../elasticsearch/winston');

var db = require ('../database/databasePG.js');
var dwolla = require ('../middleware/dwolla.js');
const plaid = require('../middleware/plaid');

var parseBodyOfMessage = function (message) {
  try {
    message = JSON.parse(message.Body);
  } catch (err) {
    message = (message);
  }
  return message;
};


var action = function (actionData) {
  var status;
  var stats = {};
  stats.startTime = new Date();

  actionData = parseBodyOfMessage(actionData);
  // console.log('route', actionData);
  // console.log('route', actionData.route);
  var transactionID = actionData.transactionID;
  var time = new Date();
  winston.info({
    transactionID: transactionID,
    type: 'message',
    stage: 'received',
    deltaTime: time.valueOf() - stats.startTime.valueOf(),
    route: actionData.route
  });
  plaid.getAuth()
    .then (apiData =>{
      // console.log('api data', apiData)
      var accounts = plaid.checkIfUserHasAccountsWithEnoughBalance(apiData, actionData.amount);
      if (!accounts) {
        status = 'declined';
      } else {
        status = 'approved';
      }
    })
    .then((data) => {
      try {
        var id = transactionID;
      } catch (err) {
        var id = 'unknown';
      }
      var time = new Date();
      winston.info({
        transactionID: id,
        type: 'message',
        stage: 'create Transaction',
        deltaTime: time.valueOf() - stats.startTime.valueOf(),
        route: actionData.route
      });

      return db.createTransaction(actionData.transactionID, actionData.userID, actionData.amount, status);
    })
    .then ((data) => {
      // console.log(data);
      var stopTime = new Date();
      var time = new Date();
      console.log('time', stopTime.valueOf() - stats.startTime.valueOf());
      winston.info({
        transactionID: transactionID,
        type: 'message',
        stage: 'send to database',
        deltaTime: time.valueOf() - stats.startTime.valueOf(),
        route: actionData.route
      });
      return sendMessageToTransactionsQueue (actionData.transactionID, status);
    })
    .then ((data)=> {
      var time = new Date();
      // console.log('success data', data);
      winston.info({
        transactionID: transactionID,
        type: 'message',
        stage: 'send to transaction queue',
        deltaTime: time.valueOf() - stats.startTime.valueOf(),
        route: actionData.route
      });
    })
    .catch (err => {
      var time = new Date();
      winston.warn({
        transactionID: transactionID,
        type: 'message',
        stage: 'error',
        route: actionData.route,
        deltaTime: time.valueOf() - stats.startTime.valueOf(),
        error: err
      });
    });

  if (actionData.route === 'cashout') {
    sendMessageToCashoutQueue(actionData.transactionID);
  } else if (actionData.route === 'withdraw') {
  } else {
    console.log('no route found');
  }
};


var actionsForBankDeposits = function (data) {
  var stats = {};
  stats.startTime = new Date();

  console.log('actionsForBankDeposits start');
  var data = parseBodyOfMessage(data);
  var transactionID = data.transactionID;
  // console.log('route', actionData.route);
  // transactionID: retrieveTransactionID(transactionID);
  var time = new Date();
  winston.info({
    transactionID: transactionID,
    type: 'BankDeposits',
    stage: 'received from queue',
    deltaTime: time.valueOf() - stats.startTime.valueOf(),
    route: 'confirmation'
  });
  db.findProcessTokenByTransactionID(transactionID)
    .then(data => {
      console.log(data);
      return dwolla.transferFunds(data.amount, 'processorToken');
    })
    .then (transferResults => {
      var status;
      if (transferResults === true) {
        status = 'confirmed';
      } else if (transferResults === false) {
        status = 'cancelled';
      }
      db.updateTransactionStatus(transactionID, status);
      return sendMessageToTransactionsQueue(transactionID, status);
    })
    .then(data => {

    })
    .catch (err => {
      console.log(err);
      var time = new Date();
      winston.warn({
        transactionID: transactionID,
        type: 'BankDeposits',
        stage: 'error',
        deltaTime: time.valueOf() - stats.startTime.valueOf(),
        route: 'confirmation',
        error: err
      });
    });
};


module.exports.action = action;
module.exports.actionsForBankDeposits = actionsForBankDeposits;