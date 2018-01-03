if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}

var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
var sqs = module.exports.sqs = new AWS.SQS({
  region: 'us-east-2',
});

module.exports.sqs = sqs;