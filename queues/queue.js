var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
var AWS = require('aws-sdk');
if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}

var { winston } = require ('../elasticsearch/winston');
var plaid = require ('../middleware/plaid.js');
var db = require('../database/databasePG.js')

// SQS_URL = process.env.NODE_ENV === 'production' ? process.env.SQS_URL : process.env.SQS_MOCK_URL
SQS_URL = process.env.SQS_URL
SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions'
SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout'


AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});

var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices'

var sqs = new AWS.SQS({
  region: 'us-east-2',
})



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
      }
      sqs.sendMessage(params, (err, response) => {
        if (err) {
          revoke (err);
        } else {
          resolve (response);
        }
      })
  })
}

class Queue {
  constructor (url) {
    this.url
  }
  send (message = {}) {
    return new Promise ((resolve, revoke) => {
      var params = {
          MessageBody: JSON.stringify(message),
          QueueUrl: this.url
        }
        sqs.sendMessage(params, (err, response) => {
          if (err) {
            revoke (err);
          } else {
            resolve (response);
          }
        })
    })
  }
}


var sendMessageToCashoutQueue = function (transactionID, callback = () => {}) {
  var msg = {
    transactionID: transactionID,
  };
  var params = {
    // MessageBody: JSON.stringify(msg),
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_TRANSACTION_URL
  }
  sqs.sendMessage(params, callback)
}


var sendMessageToCashoutQueue = function (message, callback) {
  var msg = {payload: message};
  var params = {
    // MessageBody: JSON.stringify(msg),
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_CASHOUT_URL
  }
  sqs.sendMessage(params, callback)
}


var action = function (actionData) {
  var status;
  console.log('route', actionData.route)
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
      console.log(data)
      return sendMessageToTransactionsQueue (actionData.transactionID, status);
    })
    .then ((data)=> {
      console.log('success data', data)
    })
    .catch (err => {
      console.log(err);
      try {
        var id = transactionID;
      } catch (err) {
        var id = 'unknown'
      }
      winston.warn({
        transactionID: id,
        error: err,
      })
    })

  if (actionData.route === "cashout") {

    sendMessageToCashoutQueue(data.transactionID)
  } else if (actionData.route === 'withdraw') {
  } else {
    console.log('no route found')
  }
}


var getDataFromQueue = function (callback) {
  var request = Consumer.create({
    queueUrl: process.env.SQS_URL,
    region: 'us-east-2',
    batchSize: 1,
    handleMessage: function (message, done) {
      var msgBody = JSON.parse(message.Body);
      winston.info({
        transactionID: msgBody.transactionID,
        stage: 'Received from Queue'
      })
      // console.log(msgBody);
      action(msgBody);
      return done();
    }
  });

  request.on('error', err => {
    console.log('Error Retrieving SQS Message', err);
    winston.error('Error retrieving Info', err);
  })
  request.start();
  request.stop();
  console.log('polling queue');

  request.on('empty', function () {
    // console.log('queue is empty')
    winston.info('queue is empty')
  })
}


module.exports.sendMessageToCashoutQueue = sendMessageToCashoutQueue;
module.exports.sendMessageToTransactionsQueue = sendMessageToTransactionsQueue;
module.exports.getDataFromQueue = getDataFromQueue;

///////tests//////////
getDataFromQueue()
winston.log('info', 'testings')

//sendMessageToQueue('test', (err, data) => {
//   if (err) {
//     console.log('ERR', err);
//   } else {
//     console.log(data);
//   }
// })