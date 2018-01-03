if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}
var fake = process.env.USEFAKE;


// var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
// var plaid = require ('../middleware/plaid.js');
var { winston } = require ('../elasticsearch/winston');
var { sqs } = require ('./awsinit.js');
// var db = require('../database/databasePG.js');
// SQS_URL = process.env.NODE_ENV === 'production' ? process.env.SQS_URL : process.env.SQS_MOCK_URL


if (fake === 'false' || fake === false) {
  console.log('Using Real SQS Queues');
  var SQS_URL = process.env.SQS_URL;
  var SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions';
  var SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout';
  var SQS_BankServices = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices';
} else {
  console.log('Using Mock SQS Queues');
  var SQS_URL = 'http://localhost:8000/test';
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
}

// var AWS = require('aws-sdk');
// AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
// var sqs = module.exports.sqs = new AWS.SQS({
//   region: 'us-east-2',
// });


module.exports.sendMessageToTransactionsQueue = function (transactionID, status) {
  return new Promise ((resolve, revoke) => {
    var msg = {
      transactionID: transactionID,
      status: status //must be 'approved'/ 'declined' / 'cancelled' or 'confirmed'
    };
    var params = {
      // MessageBody: JSON.stringify(msg),
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
    sqs.sendMessage(params,(err, response) => {
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
