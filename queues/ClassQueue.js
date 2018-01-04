var Consumer = require('sqs-consumer');
var { winston } = require ('../elasticsearch/winston');
var sqs = require('./awsInit.js').sqs;

class Queue {
  constructor
  (
    url,
    handleMessages = function () {},
    options = {},
    count = 1,
    start = false
  ) {

    this.queues = [];
    this.url = url;
    this.handleMessages = handleMessages;

    this.options = {
      count: options.count || 1,
      batchSize: options.batchSize || 10,
      region: options.region || 'us-east-2',
      start: options.start || false,
      // handleMessages: options.handleMessages || function (message, done) {
      //   // console.log(message)
      //   action(message);
      //   return done();
      // },
      // handleEmptyMessages: options.handleEmptyMessages || function () {}.bind(this)
    };
    this.pushQueue(this.options.count, this.options.start);
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


  setRunningNum(number = 0) {
    number > this.queues.count ? number = this.queues.count : null;

    for (var i = 0; i < number; i ++) {
      this.queues[i].start();
    }
    for (var i = number; i < this.queues.length; i ++) {
      this.queues[i].stop();
    }
  }


  createQueue () {
    var queue = Consumer.create({
      queueUrl: this.url,
      region: this.options.region,
      batchSize: this.options.batchsize,
      handleMessage: this.handleMessages
    });

    queue.on('error', err => {
      console.log('Error Retrieving SQS Message', err);
      winston.error('Error retrieving Info', err);
    });
    queue.on('empty', function () {
      console.log('queue is empty');
      // winston.info('queue is empty');
      // this.options.handleEmptyMessages();
    });
    return queue;
  }


  pushQueue(count = 1, start = false) {
    for (var i = 0; i < count; i ++) {
      var queue = this.createQueue();
      this.queues.push(queue);
      start && queue.start();
    }
  }


  popQueue (count = 1) {
    for (var i = 0; i < count; i ++) {
      var queue = this.queues.pop();
      queue.stop();
    }
  }


  count () {
    return this.queues.length;
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

  //WIP
  // sendBatch(messages = [] ) {
  //   var messageObject = [];
  //   messages.forEach(message => {
  //     var newMessage = {
  //       Id: message.transactionID,
  //       MessageBody: JSON.stringify(message)
  //     };
  //   });
  //   return new Promise ((resolve, revoke) => {
  //     var params = {
  //       SendMessageBatchRequestEntry: messageObject,
  //       QueueUrl: this.url
  //     };
  //     sqs.SendMessageBatch(params, (err, response) => {
  //       if (err) {
  //         revoke (err);
  //       } else {
  //         resolve (response);
  //       }
  //     });
  //   });
  // }

  // changeHandleMessage (func) {
  //   this.options.handleMessage = func;
  // }

  //   // batchsize (size = 1) {
  // //   this.batchsize = size;
  // //   create ();
  // // }
}

module.exports = Queue;