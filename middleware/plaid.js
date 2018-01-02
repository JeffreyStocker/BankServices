if (!process.env.PORT) {
  var dotenv = require('dotenv').config();
}
var { winston } = require ('../elasticsearch/winston.js');
var plaid = require('plaid');
var axios = require('axios');
var mockAuthResponse = require('../spec/example_data/plaidAuthorizationResponse.js');
if (process.env.useFake === true || process.env.useFake === 'true') {
  var useFake = true;
} else {
  var useFake = 'false';
}

var PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
var PLAID_SECRET_KEY = process.env.PLAID_SECRET_KEY;
var PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
var PLAID_ENV = process.env.PLAID_ENV;

var access_token = 'access-sandbox-25194add-267c-4e10-95aa-05fab88dc69f';

const plaidClient = new plaid.Client(PLAID_CLIENT_ID, PLAID_SECRET_KEY, PLAID_PUBLIC_KEY, plaid.environments[PLAID_ENV]);


if (useFake === 'true' || useFake === true) {
  var getAuth = function () {
    return new Promise ((resolve, revoke) => {
      var data = mockAuthResponse;
      resolve (data);
    });
  };
} else {
  var getAuth = function (access_token) {
    return new Promise ((resolve, revoke) => {
      plaidClient.getAuth(access_token, {}, (err, data) => {
        if (err) {
          revoke (err);
        } else {
          resolve (data);
        }
      });
    });
  };
}


var exchangeTokenForDwollaProcessorToken = function (accessToken, accountID) {
  if (!!useFake) {
    accessToken = access_token;
    accountID = 'JpGN5ELowxTd1LaxGx8JH4pLpjxbV6FpJb3Ve';
  } else if (!accessToken || !accountID) {
    winston.warn({
      function: 'exchangeTokenForDwollaProcessorToken',
      transactionID: transactionID,
      error: 'exchangeTokenForDwollaProcessorToken: Invalid access token or accountID'
    });
    throw 'exchangeTokenForDwollaProcessorToken: Invalid access token or accountID';
  }

  winston.info({
    function: 'exchangeTokenForDwollaProcessorToken',
    transactionID: transactionID || 'unknown',
    work: 'Dwolla Token Exchange',
    state: 'Start'
  });

  return new Promise ((resolve, revoke) => {
    axios.post('https://sandbox.plaid.com/processor/dwolla/processor_token/create', {
      contentType: 'application/json',
      data:
      {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET_KEY,
        access_token: accessToken,
        account_id: accountID,
      }
    })
      .then (response => {
        resolve(response.data);
      })
      .catch(err => {
        revoke (err);
      })
      .finally(() => {
        winston.log ({
          function: 'exchangeTokenForDwollaProcessorToken',
          transactionID: transactionID || 'unknown',
          work: 'Dwolla Token Exchange',
          state: 'Done'
        });
      });
  });
};




var createItem = function () {
  plaidClient.exchangePublicToken('public-sandbox-e3c11412-9417-4ffc-b2c4-e7e67cc9a41a', (err, data) => {
    if (err) {
      console.log('err', err);
    } else {
      console.log('data', data);
    }
  });
};


var checkIfUserHasAccountsWithEnoughBalance = function (infoFromPlaid, amount) {
  if (!infoFromPlaid) { throw 'checkIfUserHasAccountsWithEnoughBalance need info from plaid'; }
  var validAccounts = [];
  var account = infoFromPlaid.accounts;
  if (!infoFromPlaid || account.length === 0) { return false; }
  for (var i = 0; i < account.length; i++ ) {
    if (account[i].balances.available >= amount) {
      validAccounts.push(account[i].account_id);
    }
  }
  if (validAccounts.length > 0) {
    return validAccounts;
  }
  return false;


  //example data from plaid
  //balances = { available: 100, current: 110, limit: null }
  // { accounts:
  //    [ { account_id: 'JpGN5ELowxTd1LaxGx8JH4pLpjxbV6FpJb3Ve',
  //        balances: [Object],
  //        mask: '0000',
  //        name: 'Plaid Checking',
  //        official_name: 'Plaid Gold Standard 0% Interest Checking',
  //        subtype: 'checking',
  //        type: 'depository' },
//      { account_id: '5lwMgopqnbswXzjlqlJGskGQGdxlaMtzdxlq8',
//        balances: [Object],
//        mask: '1111',
//        name: 'Plaid Saving',
//        official_name: 'Plaid Silver Standard 0.1% Interest Saving',
//        subtype: 'savings',
//        type: 'depository' },
//      { account_id: 'lkXQKZE8mDc4R6ZmXmx1I3MmM5pKxDi17LQDg',
//        balances: [Object],
//        mask: '2222',
//        name: 'Plaid CD',
//        official_name: 'Plaid Bronze Standard 0.2% Interest CD',
//        subtype: 'cd',
//        type: 'depository' },
//      { account_id: 'kleQqyEgMDs9LBjAyAGas5EAEGxoJ1Hrpxny7',
//        balances: [Object],
//        mask: '3333',
//        name: 'Plaid Credit Card',
//        official_name: 'Plaid Diamond 12.5% APR Interest Credit Card',
//        subtype: 'credit card',
//        type: 'credit' } ],
//   item:
//    { available_products: [ 'balance' ],
//      billed_products: [ 'auth', 'transactions' ],
//      error: null,
//      institution_id: 'ins_1',
//      item_id: '7KJ5EpqrRbtlR31BrB5JUlBgxLKWrqsgzQXgj',
//      webhook: '' },
//   numbers:
//    [ { account: '1111222233330000',
//        account_id: 'JpGN5ELowxTd1LaxGx8JH4pLpjxbV6FpJb3Ve',
//        routing: '011401533',
//        wire_routing: '021000021' },
//      { account: '1111222233331111',
//        account_id: '5lwMgopqnbswXzjlqlJGskGQGdxlaMtzdxlq8',
//        routing: '011401533',
//        wire_routing: '021000021' } ],
//   request_id: 'lGX6W',
//   status_code: 200 }
};



//https://plaid.com/docs/api/#auth
//“access_token”: “access-sandbox-5cd6e1b1-1b5b-459d-9284-366e2da89755”
//'item_id': 'Jv785paMV8hRGWNBRjbjUybw8N9B3yTBDdkwV'
//'request_id': 'h5Ci1'///// make sure to log this

///token public-sandbox-e3c11412-9417-4ffc-b2c4-e7e67cc9a41a
//item ID = 7KJ5EpqrRbtlR31BrB5JUlBgxLKWrqsgzQXgj
// data { access_token: 'access-sandbox-25194add-267c-4e10-95aa-05fab88dc69f',
//   item_id: '7KJ5EpqrRbtlR31BrB5JUlBgxLKWrqsgzQXgj',
//   request_id: 'UCkiw',
//   status_code: 200 }

//formatting
// /Tokens follow this format:  <type>-<environment>-<8 hex chars>-<4 hex chars>-<4 hex chars>-<4 hex chars>-<12 hex chars>.

// Possible types: public, access, processor
// Possible environments: sandbox, development, production

// For example: access-development-7c69d345-hda9-ka68-ahs3-e9317406a2


module.exports.getAuth = getAuth;
module.exports.checkIfUserHasAccountsWithEnoughBalance = checkIfUserHasAccountsWithEnoughBalance;


//// test/////
// getAuth(access_token)
// .then(data => {
//   data.accounts.forEach(account => {
//     console.log(account.balances)
//   })
//   console.log(data)
//   //data.accounts[0].balances = {available, current, limit}

//   console.log(checkIfUserHasAccountsWithEnoughBalance(data, 100))
// })
// .catch(err => {
//   console.log(err)
// })