var AWS = require('aws-sdk');
const env = require('dotenv').config();
var fake = true;
var axios = require('axios');
// AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
var url = 'http://localhost:8000/';
var test = 'test';

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
  var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices';
}

// // var sqsURL = 'http://localhost:1000/722156248668/inputToBankServices'

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
var returnRandomNumberUpToMax = function (max = 1) {
  return Math.floor((Math.random() * max) + 1);
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

// for (var i = 0; i < 20; i ++) {
//   // var data = {
//   //   transactionID: Math.floor((Math.random()*2147483640) + 10000001),
//   //   route: Math.floor((Math.random()*2)+1) === 1 ? 'cashout' : 'withdraw',
//   //   userID: Math.floor((Math.random()*2147483640) + 10000001),
//   //   amount: Math.floor(Math.random()*300000)/100
//   // }

//   module.exports.sendMessageToQueue({
//     transactionID: Math.floor((Math.random()*2147483640) + 10000001),
//     route: Math.floor((Math.random()*2)+1) === 1 ? 'cashout' : 'withdraw',
//     userID: Math.floor((Math.random()*2147483640) + 10000001),
//     amount: Math.floor(Math.random()*300000)/100
//   }, (err, returnedData) => {
//     if (err) {
//       console.log('Send Messages to Queue Error', err);
//     } else {
//       // console.log(data)
//       console.log(returnedData);
//     }
//   })
// }

// axios.post ('http://localhost:8000/',
// `Action=CreateQueue&QueueName=test&AWSAccessKeyId=access%20key%20id` )
// .then (status => {
//   console.log(status.data)
//   for (var i = 0; i < 20; i ++) {
//     //"Action=SendMessage&QueueUrl=http%3A%2F%2Fsqs.docker%3A9494%2Ftest-queue&MessageBody=testing123&
//     var message = JSON.stringify(
//       {
//         transactionID: Math.floor((Math.random()*2147483640) + 10000001),
//         route: Math.floor((Math.random()*2)+1) === 1 ? 'cashout' : 'withdraw',
//         userID: Math.floor((Math.random()*2147483640) + 10000001),
//         amount: Math.floor(Math.random()*300000)/100,
//         message: JSON.stringify()
//       }
//     )
//     axios.post('http://localhost:8000/test',
//       `Action=SendMessage&QueueUrl=localHost/test&MessageBody=${message}`
//       )
//       .then (status => {
//         console.log(status.data)
//       })
//       .catch(err => {
//         console.log(err.response.data)
//       })
//     }

// })
// .catch (err => {
//   console.log(err.response.status, err.response.statusText);
// })



var runMessages = function () {
  console.log('300');
  for (var i = 0; i < 300; i ++) {
    //"Action=SendMessage&QueueUrl=http%3A%2F%2Fsqs.docker%3A9494%2Ftest-queue&MessageBody=testing123&
    axios.post('http://localhost:8000/inputToBankServices',
      'Action=SendMessage&QueueUrl=localHost/test&MessageBody=' + JSON.stringify(
        {
          transactionID: Math.floor((Math.random() * 2147483640) + 10000001),
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
        console.log(err.code);
      });
  }
};

var set = setInterval (runMessages, 2000 );