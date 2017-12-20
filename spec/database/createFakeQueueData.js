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


for (var i = 0; i < 1; i ++) {
  var data = {
    transactionID: Math.floor(Math.random()*200000),
    route: !!Math.floor(Math.random*1) ? 'cashout' : 'withdraw',
    userID: Math.floor(Math.random()*200000),
    amount: Math.floor(Math.random()*300000)/100
  }
  module.exports.sendMessageToQueue(data, (err, data) => {
    if (err) {
      console.log('Send Messages to Queue Error', err);
    } else {
      console.log(data);
    }
  })
}
