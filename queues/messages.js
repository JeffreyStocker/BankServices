var { winston } = require ('../elasticsearch/winston');
var { sqs } = require ('./awsinit.js');

if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}

if (process.env.USEMOCKSQS === 'false') {
  console.log('Using Real SQS Queues');
  var SQS_TRANSACTION_URL = process.env.SQS_TRANSACTION_URL;
  var SQS_CASHOUT_URL = process.env.SQS_CASHOUT_URL;
  var SQS_BankServices = process.env.SQS_BankServices;
} else {
  console.log('Using Mock SQS Queues');
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
}


module.exports.sendMessageToTransactionsQueue = function (transactionID, status) {
  return new Promise ((resolve, revoke) => {
    var msg = {
      transactionID: transactionID,
      status: status //must be 'approved'/ 'declined' / 'cancelled' or 'confirmed'
    };
    var params = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: SQS_TRANSACTION_URL
    };
    sqs.sendMessage(params, (err, response) => {
      if (err) {
        revoke (err);
      } else {
        resolve (response);
      }
    });
  });
};


module.exports.sendMessageToCashoutQueue = function (transactionID, callback = () => {}) {
  return new Promise ((resolve, revoke) => {
    var msg = {
      transactionID: transactionID,
    };
    var params = {
      // MessageBody: JSON.stringify(msg),
      MessageBody: JSON.stringify(msg),
      QueueUrl: SQS_CASHOUT_URL
    };
    sqs.sendMessage(params, (err, response) => {
      if (err) {
        revoke (err);
      } else {
        resolve (response);
      }
    });
  });
};


// var handleBankQueuesMessages = function () {
//   try {
//     message = JSON.parse(message.Body);
//   } catch (err) {
//     message = (message);
//   }
//   winston.info({
//     transactionID: message.transactionID,
//     stage: 'Received from Queue'
//   });
//   actionsForBankDeposits(message);
//   return done();
// };
