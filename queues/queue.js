var Queue = require ('./ClassQueue.js');if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}
var fake = process.env.USEFAKE;

if (fake === 'false' || fake === false) {
  console.log('Using Real SQS Queues');
  var SQS_URL = process.env.SQS_URL;
  var SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions';
  var SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout';
  var SQS_BankServices = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices';
} else {
  console.log('Using Mock SQS Queues');
  var SQS_URL = 'http://localhost:8000/test';
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
}
var { winston } = require ('../elasticsearch/winston');
var { action, actionsForBankDeposits } = require('./actions.js');


var queueToBankServices = new Queue(SQS_BankServices, (message, done) => {
  action(message);
  return done();
});
queueToBankServices.pushQueue(2);
// console.log(queueToBankServices.count());

var queueToBankDeposits = new Queue(SQS_CASHOUT_URL, (message, done) => {
  actionsForBankDeposits(message);
  return done();
});
queueToBankDeposits.start();


