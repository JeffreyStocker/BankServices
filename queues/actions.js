var dwolla = require ('../middleware/dwolla.js');

var actionsForBankDeposits = function (data) {
  console.log('route', actionData.route);
  dwolla.transferFunds(amount, processorToken)
    .then (transferResults => {
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


module.exports.action = action;
module.exports.actionsForBankDeposits = actionsForBankDeposits;