var Consumer = require('sqs-consumer'); //https://www.npmjs.com/package/sqs-consumer
var AWS = require('aws-sdk');
if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
  var fake = process.env.USEFAKE;
}

var { winston } = require ('../elasticsearch/winston');
var plaid = require ('../middleware/plaid.js');
var db = require('../database/databasePG.js');

// SQS_URL = process.env.NODE_ENV === 'production' ? process.env.SQS_URL : process.env.SQS_MOCK_URL

if (fake === 'true') {
  console.log('Using Mock SQS Queues');
  var SQS_URL = 'http://localhost:8000/test';
  var SQS_TRANSACTION_URL = 'http://localhost:8000/outputToTransactions';
  var SQS_CASHOUT_URL = 'http://localhost:8000/cashout';
  var SQS_BankServices = 'http://localhost:8000/inputToBankServices';
} else {
  console.log('Using Real SQS Queues');
  var SQS_URL = process.env.SQS_URL;
  var SQS_TRANSACTION_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/outputToTransactions';
  var SQS_CASHOUT_URL = 'https://sqs.us-east-2.amazonaws.com/722156248668/cashout';
  var SQS_BankServices = 'https://sqs.us-east-2.amazonaws.com/722156248668/inputToBankServices';
}



AWS.config.update({accessKeyId: process.env.AWS_PUBLIC_KEY, secretAccessKey: process.env.AWS_SECRET_KEY});
var sqs = new AWS.SQS({
  region: 'us-east-2',
});


var sendMessageToTransactionsQueue = function (transactionID, status) {
  return new Promise ((resolve, revoke) => {
    var msg = {
      transactionID: transactionID,
      status: status //must be 'approved'/ 'declined' / 'cancelled' or 'confirmed'
    };
    var params = {
      // MessageBody: JSON.stringify(msg),
      MessageBody: JSON.stringify(msg),
      QueueUrl: SQS_TRANSACTION_URL
    };
    sqs.sendMessage(params, (err, response) => {
      if (err) {
        revoke (err);
      } else {
        resolve (response);
      }
    });
  });
};

var sendMessageToCashoutQueue = function (transactionID, callback = () => {}) {
  var msg = {
    transactionID: transactionID,
  };
  var params = {
    // MessageBody: JSON.stringify(msg),
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_TRANSACTION_URL
  };
  sqs.sendMessage(params, callback);
};


var sendMessageToCashoutQueue = function (message, callback) {
  var msg = {payload: message};
  var params = {
    // MessageBody: JSON.stringify(msg),
    MessageBody: JSON.stringify(message),
    QueueUrl: SQS_CASHOUT_URL
  };
  sqs.sendMessage(params, callback);
};


var action = function (actionData) {
  var status;
  console.log('route', actionData.route);
  plaid.getAuth()
    .then (apiData =>{
      // console.log('api data', apiData)
      var accounts = plaid.checkIfUserHasAccountsWithEnoughBalance(apiData, actionData.amount);
      if (!accounts) {
        status = 'declined';
      } else {
        status = 'approved';
      }
    })
    .then((data) => {
      return db.createTransaction(actionData.transactionID, actionData.userID, actionData.amount, status);
    })
    .then ((data) => {
      console.log(data);
      return sendMessageToTransactionsQueue (actionData.transactionID, status);
    })
    .then ((data)=> {
      console.log('success data', data);
    })
    .catch (err => {
      console.log(err);
      try {
        var id = transactionID;
      } catch (err) {
        var id = 'unknown';
      }
      winston.warn({
        transactionID: id,
        error: err,
      });
    });

  if (actionData.route === 'cashout') {

    sendMessageToCashoutQueue(data.transactionID);
  } else if (actionData.route === 'withdraw') {
  } else {
    console.log('no route found');
  }
};


var getDataFromQueue = function (callback) {
  var request = Consumer.create({
    queueUrl: SQS_BankServices,
    region: 'us-east-2',
    batchSize: 1,
    handleMessage: function (message, done) {
      console.log('poll queue');
      try {
        message = JSON.parse(message.Body);
      } catch (err) {
        message = (message);
      }
      console.log('message', message);
      winston.info({
        transactionID: message.transactionID,
        stage: 'Received from Queue'
      });
      // console.log(msgBody);
      action(message);
      return done();
    }
  });

  request.on('error', err => {
    console.log('Error Retrieving SQS Message', err);
    winston.error('Error retrieving Info', err);
  });
  request.start();
  request.stop();
  console.log('polling queue');

  request.on('empty', function () {
    // console.log('queue is empty')
    winston.info('queue is empty');
  });
};


class Queue {
  constructor
  (
    url,
    options = {},
    count = 1
  ) {

    this.queues = [];
    this.url = url;

    this.options = {
      count: options.count || 1,
      batchSize: options.batchSize || 10,
      region: options.region || 'us-east-2',
      start: options.start || false,
      handleMessages: options.handleMessages || function (message, done) {
        var msgBody = JSON.parse(message.Body);
        winston.info({
          transactionID: msgBody.transactionID,
          stage: 'Received from Queue'
        });
        action(msgBody);
        return done();
      },
    };
    for (var i = 0; i < this.options.count; i++) {
      this.pushQueue();
    }
  }

  start () {
    console.log('here');
    this.running = true;
    this.queues.forEach(queue => {
      queue.start();
    });
  }
  stop () {
    this.false;
    this.queues.forEach(queue => {
      queue.stop();
    });
  }

  haveRunning(number = 0) {
    for (var i = 0; i < number; i ++) {
      this.queues[i].start();
    }
    for (var i = number; i < this.queues.length; i ++) {
      this.queues[i].stop();
    }
  }

  send (message = {}) {
    return new Promise ((resolve, revoke) => {
      var params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: this.url
      };
      sqs.sendMessage(params, (err, response) => {
        if (err) {
          revoke (err);
        } else {
          resolve (response);
        }
      });
    });
  }

  createQueue () {
    var queue = Consumer.create({
      queueUrl: this.url,
      region: this.options.region,
      batchSize: this.options.batchsize,
      handleMessage: function (message, done) {
        console.log('poll queue');
        try {
          message = JSON.parse(message.Body);
        } catch (err) {
          message = (message);
        }
        winston.info({
          transactionID: message.transactionID,
          stage: 'Received from Queue'
        });
        action(message);
        return done();
      }
    });

    queue.on('error', err => {
      // console.log('Error Retrieving SQS Message', err);
      winston.error('Error retrieving Info', err);
    });
    queue.on('empty', function () {
      // console.log('queue is empty');
      winston.info('queue is empty');
    });
    return queue;
  }

  pushQueue(start = true) {
    var queue = this.createQueue();
    queue.start();
    this.queues.push(queue);
  }

  popQueue () {
    var queue = this.queues.pop();
    queue.stop();
  }

  // changeHandleMessage (func) {
  //   this.options.handleMessage = func;
  // }

  //   // batchsize (size = 1) {
  // //   this.batchsize = size;
  // //   create ();
  // // }
}


module.exports.sendMessageToCashoutQueue = sendMessageToCashoutQueue;
module.exports.sendMessageToTransactionsQueue = sendMessageToTransactionsQueue;
module.exports.getDataFromQueue = getDataFromQueue;


///////tests//////////
// getDataFromQueue()
// winston.log('info', 'testings')

var queueToBankServices = new Queue('localhost:8000/test');
queueToBankServices.start();


//sendMessageToQueue('test', (err, data) => {
//   if (err) {
//     console.log('ERR', err);
//   } else {
//     console.log(data);
//   }
// })


//////
/*
class Queue {
  constructor (url) {
    this.url = url
  }
  send (message = {}) {
    return new Promise ((resolve, revoke) => {
      var params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: this.url
      }
      sqs.sendMessage(params, (err, response) => {
        if (err) {
          revoke (err);
        } else {
          resolve (response);
        }
      })
    })
  }
}

 */