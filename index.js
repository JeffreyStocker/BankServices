var env = require('dotenv').config()
var express = require('express');
var app = express();
var port = process.env.port || 8080;
// var elastic = require ('./elasticsearch/elasticsearch.js')
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});


var sqs = new AWS.SQS({
  region: 'us-east-2',
  credentials: process.env.AWS_PUBLIC_KEY
})

var sendMessage = function (message, callback) {
  var msg = {payload: message};
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: process.env.SQS_URL
  }
  sqs.sendMessage(params, callback)
}

// sendMessage('test', (err, data) => {
//   if (err) {
//     console.log('ERR', err);
//   } else {
//     console.log(data);
//   }
// })

var getData = function () {
  console.log('runing')
  var request = Consumer.create({
    queueUrl: process.env.SQS_URL,
    region: 'us-east-2',
    batchSize: 10,
    handleMessage: function (message, done) {
      var msgBody = JSON.parse(message.Body);
      console.log(msgBody);
      return done();
    }
  });
  request.on('error', err => {
    console.log('error', err)
  })
  request.start();

  request.on('error', function (err) {
    console.log(err);
  });
  // request.on('empty', function () {
    // console.log('queue is empty')
  // })
}
getData()



// app.post ('/withdraw/:userID', () => {
//   userID = req.params.userID
// })

// app.post ('/cashout/:userID', () => {
//   userID = req.params.userID
// })


app.get ('/users/banks', () => {

})

var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices'


var server = app.listen(8080, () =>  {
  // console.log("... port %d in %s mode", app.address().port, app.settings.env);
  console.log('App is listening on port: ', port)
})


process.on('uncaughtException', (error) => {
  console.log ('UncaughtError!!', error)
})