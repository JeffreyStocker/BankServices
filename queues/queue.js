var Queue = require ('./ClassQueue.js');

var { winston } = require ('../elasticsearch/winston');
var { actionBankServices, actionsForBankDeposits } = require('./actions.js');

if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}

if (process.env.USEMOCKSQS === 'false') {
  console.log('Using Real SQS Queues');
  var SQS_TRANSACTION_URL = process.env.SQS_TRANSACTION_URL;
  var SQS_CASHOUT_URL = process.env.SQS_CASHOUT_URL;
  var SQS_BankServices = process.env.SQS_BankServices;
} else {
  console.log('Using Mock SQS Queues');
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
}

module.exports.queueToBankServices = new Queue(SQS_BankServices, (message, done) => {
  // console.log('BankServices');
  actionBankServices(message);
  return done();
});
// module.exports.queueToBankServices.pushQueue(2);
// console.log(queueToBankServices.count());

module.exports.queueToTransactions = new Queue (SQS_TRANSACTION_URL, (message, done) => {
  // console.log('Transactions');
  // return done();
});

module.exports.queueToBankDeposits = new Queue(SQS_CASHOUT_URL, (message, done) => {
  // console.log('BankDeposits');
  actionsForBankDeposits(message);
  return done();
});


