var AWS = require('aws-sdk');
const env = require('dotenv').config();

var axios = require('axios');
// AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
var url = 'http://localhost:8000/';
// var url = 'http://sqs-mock.docker:8000/';


var createRoute = function (route = 'test') {
  axios.post (url,
    `Action=CreateQueue&QueueName=${route}&AWSAccessKeyId=access%20key%20id` )
    .then (status => {
      console.log(status.data);
    })
    .catch (err => {
      try {
        console.log(err.response.status, err.response.statusText);
      } catch (anotherError) {
        console.log(err.code);
        // console.log(err.Error);
        // console.log(err);
      }
    });
};

createRoute('outputToTransactions');
createRoute('cashout');
createRoute('inputToBankServices');