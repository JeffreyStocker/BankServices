var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
var AWS = require('aws-sdk');
if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}

AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});

var sqsURL = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices'

var sqs = new AWS.SQS({
  region: 'us-east-2',
})


var sendMessageToQueue = function (message, callback) {
  var msg = {payload: message};
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: process.env.SQS_URL
  }
  sqs.sendMessage(params, callback)
}

var getDataFromQueue = function () {
  console.log('polling queue')
  var request = Consumer.create({
    queueUrl: process.env.SQS_URL,
    region: 'us-east-2',
    batchSize: 10,
    handleMessage: function (message, done) {
      var date = new Date();
      console.log('ticks: ', date.valueOf() - startTime)
      data.now();
      var msgBody = JSON.parse(message.Body);
      console.log(msgBody);
      // request.stop();
      return done();
    }
  });

  request.on('error', err => {
    console.log('error', err)
  })

  var startTime = new Date();
  startTime = startTime.valueOf();
  request.start();

  request.on('error', function (err) {
    console.log(err);
  });

  request.on('empty', function () {
    console.log('queue is empty')
    })
  }


module.exports.sendMessageToQueue = sendMessageToQueue
module.exports.getDataFromQueue = getDataFromQueue

///////tests//////////
getDataFromQueue()


//sendMessageToQueue('test', (err, data) => {
//   if (err) {
//     console.log('ERR', err);
//   } else {
//     console.log(data);
//   }
// })