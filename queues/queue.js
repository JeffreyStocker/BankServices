var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});

var sqs = new AWS.SQS({
  region: 'us-east-2',
})

module.exports.sendMessageToQueue = function (message, callback) {
  var msg = {payload: message};
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: process.env.SQS_URL
  }
  sqs.sendMessage(params, callback)
}
module.exports.getDataFromQueue = function () {
  console.log('polling queue')
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




  // module.exports.sendMessageToQueue('test', (err, data) => {
  //   if (err) {
  //     console.log('ERR', err);
  //   } else {
  //     console.log(data);
  //   }
  // })


  // module.exports.getDataFromQueue()