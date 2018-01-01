if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
  var fake = process.env.USEFAKE;
}
var AWS = require('aws-sdk');

// var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
// var plaid = require ('../middleware/plaid.js');
var { winston } = require ('../elasticsearch/winston');

// var db = require('../database/databasePG.js');
var Queue = require ('./ClassQueue.js');
var { action, actionsForBankDeposits } = require('./actions.js');
// SQS_URL = process.env.NODE_ENV === 'production' ? process.env.SQS_URL : process.env.SQS_MOCK_URL

if (fake === 'true') {
  console.log('Using Mock SQS Queues');
  var SQS_URL = 'http://localhost:8000/test';
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
} else {
  console.log('Using Real SQS Queues');
  var SQS_URL = process.env.SQS_URL;
  var SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions';
  var SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout';
  var SQS_BankServices = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices';
}

AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
var sqs = new AWS.SQS({
  region: 'us-east-2',
});


var sendMessageToTransactionsQueue = function (transactionID, status) {
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


var sendMessageToCashoutQueue = function (transactionID, callback = () => {}) {
  var msg = {
    transactionID: transactionID,
  };
  var params = {
    // MessageBody: JSON.stringify(msg),
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_TRANSACTION_URL
  };
  sqs.sendMessage(params, callback);
};

// var getDataFromQueue = function (callback) {
//   var request = Consumer.create({
//     queueUrl: SQS_BankServices,
//     region: 'us-east-2',
//     batchSize: 1,
//     handleMessage: function (message, done) {
//       console.log('poll queue');
//       try {
//         message = JSON.parse(message.Body);
//       } catch (err) {
//         message = (message);
//       }
//       console.log('message', message);
//       winston.info({
//         transactionID: message.transactionID,
//         stage: 'Received from Queue'
//       });
//       // console.log(msgBody);
//       action(message);
//       return done();
//     }
//   });

//   request.on('error', err => {
//     console.log('Error Retrieving SQS Message', err);
//     winston.error('Error retrieving Info', err);
//   });
//   request.start();
//   request.stop();
//   console.log('polling queue');

//   request.on('empty', function () {
//     // console.log('queue is empty')
//     winston.info('queue is empty');
//   });
// };
// module.exports.getDataFromQueue = getDataFromQueue;


var handleBankQueuesMessages = function () {
  try {
    message = JSON.parse(message.Body);
  } catch (err) {
    message = (message);
  }
  winston.info({
    transactionID: message.transactionID,
    stage: 'Received from Queue'
  });
  actionsForBankDeposits(message);
  return done();
};




module.exports.sendMessageToCashoutQueue = sendMessageToCashoutQueue;
module.exports.sendMessageToTransactionsQueue = sendMessageToTransactionsQueue;


///////tests//////////
// getDataFromQueue()
// winston.log('info', 'testings')

var queueToBankServices = new Queue(SQS_BankServices);
// queueToBankServices.start();


//sendMessageToQueue('test', (err, data) => {
//   if (err) {
//     console.log('ERR', err);
//   } else {
//     console.log(data);
//   }
// })