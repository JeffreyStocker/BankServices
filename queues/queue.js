var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
var AWS = require('aws-sdk');
if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}
var { winston } = require ('../elasticsearch/winston')

// SQS_URL = process.env.NODE_ENV === 'production' ? process.env.SQS_URL : process.env.SQS_MOCK_URL
SQS_URL = process.env.SQS_URL
SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions'
SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout'

AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});

var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices'

var sqs = new AWS.SQS({
  region: 'us-east-2',
})



var sendMessageToTransactionsQueue = function (message, callback) {
  var msg = {payload: message};
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

var action = function (data) {
  if (data.action === "cashout") {
    //ping the api and wait for reply
    //update database
    pingAPI()
    .then (status =>{
      if (status.ok === 'good') {

      }
    })
    .catch (err => {
      console.log(err)

    })
    //write response to outgoing queue
    //write to eventual cashout queue
  } else if (data.action === 'payment') {
    //ping api and wait for reply
    //return response to outgoing queue

  }
  //write transaction to database
}

var pingAPI = function () {

}

var getDataFromQueue = function (callback) {
  var request = Consumer.create({
    queueUrl: process.env.SQS_URL,
    region: 'us-east-2',
    batchSize: 10,
    handleMessage: function (message, done) {
      var msgBody = JSON.parse(message.Body);
      winston.info({transactionID: msgBody.transactionID, stage: 'Received from Queue'})
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
  console.log('polling queue');

  request.on('empty', function () {
    // console.log('queue is empty')
    winston.log('error', 'queue is empty')
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