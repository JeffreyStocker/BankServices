var AWS = require('aws-sdk');
const env = require('dotenv').config();
var axios = require('axios');
var url = 'http://localhost:8000/';
var db = require ('../../database/databasePG');

var fake = false;
var destintationURL = process.env.SQS_BankServices;
var count = 10;




if (fake === true) {
  AWS.config.update({
    sqs_endpoint: 'localhost',
    sqs_port: 4789,
    use_ssl: false,
    accessKeyId: 'xxx',
    secretAccessKey: 'yyy',
    sns_endpoint: '0.0.0.0',
    sns_port: 9292
  });

  var sqsURL = 'localhost:4568';
} else {
  AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
  var sqsURL = process.env.SQS_BankServices;
}
var sqs = new AWS.SQS({
  region: 'us-east-2',
});

module.exports.sendMessageToQueue = function (message, callback) {
  // var msg = {payload: message};
  var msg = message;
  var params = {
    // use_ssl: false,
    MessageBody: JSON.stringify(msg),
    // QueueUrl: process.env.SQS_URL
    QueueUrl: sqsURL
  };
  sqs.sendMessage(params, callback);
};

var returnRandomInArray = function (array = ['']) {
  return array[Math.floor((Math.random() * array.length - 1) + 0) ];
};

var returnRandomNumberUpToMax = function (max = 1, min = 1) {
  return Math.floor((Math.random() * (max - min)) + min);
};

var createRandomNumberUpToIntiger = function () {
  return Math.floor((Math.random() * 2147483646) + 1);
};

var createRandomString = function (length = 37, lowerCase = false) {
  if (lowerCase) {
    var possibilities = 'abcdefghijklmnopqrstuvwxyz0123456789';
  } else {
    var possibilities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  var possLength = possibilities.length;
  var output = '';
  for (var i = 0; i < length; i ++) {
    output += possibilities[Math.floor(Math.random() * possLength)];
  }
  return output;
};


var localMockFunction = function () {
  //"Action=SendMessage&QueueUrl=http%3A%2F%2Fsqs.docker%3A9494%2Ftest-queue&MessageBody=testing123&
  axios.post(destintationURL,
    'Action=SendMessage&QueueUrl=localHost/test&MessageBody=' + JSON.stringify(
      {
        transactionID: Math.floor((Math.random() * (2147483640 - 10000001)) + 10000001),
        route: Math.floor((Math.random() * 2) + 1) === 1 ? 'cashout' : 'withdraw',
        userID: Math.floor((Math.random() * 2147483640) + 10000001),
        amount: Math.floor(Math.random() * 300000) / 100,
        message: JSON.stringify()
      }
    )
  )
    .then (status => {
      // console.log(status.data);
    })
    .catch(err => {
      // console.log(err.code);
      console.log(err);
    });
};

var sqsMockFunction = function () {
  module.exports.sendMessageToQueue({
    transactionID: Math.floor((Math.random() * (2147483640 - 10000001)) + 10000001),
    route: Math.floor((Math.random() * 2) + 1) === 1 ? 'cashout' : 'withdraw',
    userID: Math.floor((Math.random() * 2147483640) + 10000001),
    amount: Math.floor(Math.random() * 300000) / 100
  }, (err, returnedData) => {
    if (err) {
      console.log('Send Messages to Queue Error', err);
    } else {
      // console.log(data)
      // console.log(returnedData);
    }
  });
};

var runMessages = function () {
  db.returnNextTransactionID()
    .then (startNumber => {
      startNumber++;

      console.log('start');
      var endNumber = startNumber + count;
      console.log('startNumber', startNumber);
      console.log('endNumber', endNumber);
      for (var i = startNumber; i < endNumber; i ++) {
        if (fake === false ) {
          sqsMockFunction();
          // console.log('i', i);
        } else {
          localMockFunction();
        }
      }
      console.log('finish');
    });
};


runMessages();
// var set = setInterval (runMessages, 2000 );
// var set = setTimeout (runMessages, 2000 );