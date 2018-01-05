const db = require ('../database/databasePG.js');
const dwolla = require ('../middleware/dwolla.js');
const plaid = require('../middleware/plaid');

const { read } = require ('fs');
const { transactionById } = require('dwolla');
const { sendMessageToCashoutQueue, sendMessageToTransactionsQueue } = require('./messages');
const { winston, trackTime } = require('../elasticsearch/winston');
const { queueToBankServices, queueToTransactions, queueToBankDeposits } = require ('./queue.js');

var parseBodyOfMessage = function (message) {
  try {
    message = JSON.parse(message.Body);
  } catch (err) {
    message = (message);
  }
  // console.log(message);
  return message;
};


var actionBankServices = function (actionData) {
  var status;
  actionData = parseBodyOfMessage(actionData);
  var tracker = trackTime(actionData.transactionID, actionData.route, {type: 'message'}, {
    stage: 'Received from Transaction Queue',
  });

  plaid.getAuth()
    .then (apiData =>{
      tracker({
        stage: 'Received Authorization from Plaid',
      });
      var accounts = plaid.checkIfUserHasAccountsWithEnoughBalance(apiData, actionData.amount);
      if (!accounts) {
        status = 'declined';
      } else {
        status = 'approved';
      }
      return db.createTransaction(actionData.transactionID, actionData.userID, actionData.amount, status);
    })
    .then ((data) => {
      tracker({
        stage: 'Wrote Transaction To Database',
      });
      return sendMessageToTransactionsQueue (actionData.transactionID, status);
      return queueToTransactions.send(actionData.transactionID, status);
    })
    .then ((data)=> {
      tracker({
        stage: 'Sent to Transaction Queue',
      });
      if (actionData.route === 'cashout') {
        queueToBankDeposits.send(actionData.transactionID)
        // sendMessageToCashoutQueue(actionData.transactionID)
          .then (results => {
            tracker({
              stage: 'Sent to Cashout Queue',
            });
          });
      } else if (actionData.route === 'withdraw') {
      } else {
        throw 'no route found';
      }
    })
    .catch (err => {
      tracker({
        stage: 'error',
        error: err
      }, 'warn');
    });
};


var actionsForBankDeposits = function (data) {
  console.log('actionsForBankDeposits start');

  var data = parseBodyOfMessage(data);
  var transactionID = data.transactionID;

  var tracker = trackTime(data.transactionID, 'confirmation', {type: 'BankDeposits'}, {
    stage: 'Received from Bank Deposits Queue',
  });

  db.findProcessTokenByTransactionID(transactionID)
    .then(data => {
      tracker ({
        stage: 'Search Database for Process Token',
      });
      return dwolla.transferFunds(data.amount, 'processorToken');
    })
    .then (transferResults => {
      tracker ({
        stage: 'Dwolla Transfered Funds Received Confirmations',
      });
      var status;
      if (transferResults === true) {
        status = 'confirmed';
      } else if (transferResults === false) {
        status = 'cancelled';
      }
      return db.updateTransactionStatus(transactionID, status);
    })
    .then (results => {
      tracker ({
        stage: 'Updated Database',
      });
      console.log('queueToTransactions', queueToTransactions);
      return queueToTransactions.send(transactionID, status);
      // return sendMessageToTransactionsQueue(transactionID, status);
    })
    .then(data => {
      tracker ({
        stage: 'Sent To Transaction Queue',
      });
    })
    .catch (err => {
      console.log(err);
      tracker({
        stage: 'error',
        error: err
      }, 'warn');
    });
};


module.exports.actionBankServices = actionBankServices;
module.exports.actionsForBankDeposits = actionsForBankDeposits;