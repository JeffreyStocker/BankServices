var AWS = require('aws-sdk');
const env = require('dotenv').config();
// AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});

var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices'
// var sqsURL = 'http://localhost:1000/722156248668/inputToBankServices'

var sqs = new AWS.SQS({
  region: 'us-east-2',
})

module.exports.sendMessageToQueue = function (message, callback) {
  // var msg = {payload: message};
  var msg = message;
  var params = {
    MessageBody: JSON.stringify(msg),
    // QueueUrl: process.env.SQS_URL
    QueueUrl: sqsURL
  }
  sqs.sendMessage(params, callback)
}

var returnRandomInArray = function (array = ['']){
  return array[Math.floor((Math.random()* array.length - 1) + 0)]
}
var returnRandomNumberUpToMax = function (max = 1) {
  return Math.floor((Math.random()* max) + 1)
}

var createRandomNumberUpToIntiger = function () {
  return Math.floor((Math.random()* 2147483646) + 1)
}

var createRandomString = function (length = 37, lowerCase = false) {
  if (lowerCase) {
    var possibilities = 'abcdefghijklmnopqrstuvwxyz0123456789'
  } else {
    var possibilities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  }
  var possLength = possibilities.length;
  var output = '';
  for (var i = 0; i < length; i ++) {
    output+= possibilities[Math.floor(Math.random() * possLength)];
  }
  return output;
}

for (var i = 0; i < 20; i ++) {
  var data = {
    transactionID: Math.floor((Math.random()*2147483640) + 10000001),
    route: Math.floor((Math.random()*2)+1) === 1 ? 'cashout' : 'withdraw',
    userID: Math.floor((Math.random()*2147483640) + 10000001),
    amount: Math.floor(Math.random()*300000)/100
  }

  module.exports.sendMessageToQueue(data, (err, returnedData) => {
    if (err) {
      console.log('Send Messages to Queue Error', err);
    } else {
      console.log(data)
      console.log(returnedData);
    }
  })
}
