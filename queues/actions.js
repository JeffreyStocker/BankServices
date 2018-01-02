var { read } = require ('fs');
var { transactionById } = require('dwolla');
var { sendMessageToCashoutQueue } = require('./queue');
var sendMessageToTransactionsQueue = require('./messages').sendMessageToTransactionsQueue;
const { winston } = require('../elasticsearch/winston');
console.log('erfsdfsf3', sendMessageToTransactionsQueue.toString());
// console.log(sendMessageToTransactionsQueue);
// console.log(sendMessageToCashoutQueue);

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
  // console.log('teste');
  actionData = parseBodyOfMessage(actionData);
  // console.log('route', actionData);
  // console.log('route', actionData.route);

  winston.info({
    transactionID: actionData.transactionID,
    type: 'message',
    stage: 'received',
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
      return db.createTransaction(actionData.transactionID, actionData.userID, actionData.amount, status);
    })
    .then ((data) => {
      console.log(data);
      // console.log('jsf;klsaj;flk', sendMessageToTransactionsQueue.toString() )
      return sendMessageToTransactionsQueue (actionData.transactionID, status);
    })
    .then ((data)=> {
      console.log('success data', data);
    })
    .catch (err => {
      console.log(err);
      try {
        var id = transactionID;
      } catch (err) {
        var id = 'unknown';
      }
      winston.warn({
        transactionID: id,
        error: err,
      });
    });

  if (actionData.route === 'cashout') {

    sendMessageToCashoutQueue(data.transactionID);
  } else if (actionData.route === 'withdraw') {
  } else {
    console.log('no route found');
  }
};


var actionsForBankDeposits = function (data) {
  var data = actionData = parseBodyOfMessage(data);
  // console.log('route', actionData.route);

  winston.info({
    trasactionID: actionData.transactionById,
    type: 'confirmation',
    stage: 'received from queue',
  });

  dwolla.transferFunds(amount, processorToken)
    .then (transferResults => {
      var status;
      if (transferResults === true) {
        status = 'confirmed';
      } else if (transferResults === false) {
        status = 'cancelled';
      }
      db.updateTransactionStatus(transactionById, status);
      return sendMessageToTransactionsQueue(transactionById, status);
    })
    .then(data => {

    })
    .catch (err => {
      console.log(err);
      try {
        var id = transactionID;
      } catch (err) {
        var id = 'unknown';
      }
      winston.warn({
        transactionID: id,
        error: err,
      });
    });
};


module.exports.action = action;
module.exports.actionsForBankDeposits = actionsForBankDeposits;