var Consumer = require('sqs-consumer');
var { winston } = require ('../elasticsearch/winston');

class Queue {
  constructor
  (
    url,
    options = {},
    count = 1,
    start = true
  ) {

    this.queues = [];
    this.url = url;

    this.options = {
      count: options.count || 1,
      batchSize: options.batchSize || 10,
      region: options.region || 'us-east-2',
      start: options.start || false,
      handleMessages: options.handleMessages || function (message, done) {
        // console.log('poll queue');
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
      },
      handleEmptyMessages: options.handleEmptyMessages || function () {}.bind(this)
    };
    for (var i = 0; i < this.options.count; i++) {
      this.pushQueue();
    }
    if (start === true ) {
      this.start();
    }
  }

  start () {
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
      handleMessage: this.options.handleMessages
    });

    queue.on('error', err => {
      console.log('Error Retrieving SQS Message', err);
      winston.error('Error retrieving Info', err);
    });
    queue.on('empty', function () {
      console.log('queue is empty');
      winston.info('queue is empty');
      this.options.handleEmptyMessages();
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

module.exports = Queue;