var sequelize = require ('sequelize');
var fs = require('fs');
var faker = require('faker');
var chance = require('chance.js');
var nationalBanks = require('../../example_data/nationalBanks.js');
var regionalBanks = require('../../example_data/regionalBanks.js');

var allBanksLength = regionalBanks.length + nationalBanks.length;


var integer = 2;

var amountToAdd = 5000000;
var start = ((integer - 1) * amountToAdd) + 1;
var stop = 11000000;

var timeRangeInMonths = 6;

var baseFolder = './database/mockData';

console.log('integer:', integer);


var transactionsLocation = '/transactions';
var transactions = fs.createWriteStream(baseFolder + transactionsLocation, { flags: 'a'});
var usersLocation = '/users';
var users = fs.createWriteStream(baseFolder + usersLocation, { flags: 'a'});
var accountsLocation = '/accounts';
var accounts = fs.createWriteStream(baseFolder + accountsLocation, { flags: 'a'});
var plaidItemsLocation = '/plaidItems';
var plaidItems = fs.createWriteStream(baseFolder + plaidItemsLocation, { flags: 'a'});


var returnRandomInArray = function (array = ['']) {
  return array [Math.floor ((Math.random () * array.length - 1) + 0) ];
};
var returnRandomNumberUpToMax = function (max = 1) {
  return Math.floor((Math.random() * max) + 1);
};

var createRandomNumberUpToIntiger = function () {
  return Math.floor((Math.random() * 2147483646) + 1);
};

var createTimeStamp = function () {
  var millisecondsInAMonth = 2629746000 * timeRangeInMonths;
  var randomInt = returnRandomNumberUpToMax(millisecondsInAMonth);
  var date = new Date();
  var dateDifference = new Date(date.valueOf() - randomInt);
  return dateDifference;
};

var createRandomString = function (length = 37, lowerCase = false) {
  if (lowerCase) {
    var possibilities = 'abcdefghijklmnopqrstuvwxyz0123456789';
  } else {
    var possibilities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  var possLength = possibilities.length;
  var output = '';
  for (var i = 0; i < length; i ++) {
    output += possibilities[Math.floor(Math.random() * possLength)];
  }
  return output;
};

var pickRandom = function (input) {
  var keys;
  if (typeof input === 'object') {
    keys = Object.keys(input);
  } else {
    keys = input;
  }
  return input[keys[Math.floor(Math.random() * keys.length)]];
};

var createPlaidRandomFakeToken = function (accessRandom = false) {
  //"plaid_access_token follow this format:  <type>-<environment>-<8 hex chars>-<4 hex chars>-<4 hex chars>-<4 hex chars>-<12 hex chars>.
  // -- "Possible types: public, access, processor
  // -- "Possible environments: sandbox, development, production
  // -- "For example: access-development-7c69d345-hda9-ka68-ahs3-e9317406a2
  // -- So max of 56 char for processor and development
  var envPoss = ['sandbox', 'development', 'production'];
  var accessPoss = ['public', 'access', 'processor'];
  var envPoss = ['sandbox'];
  var accessPoss = ['access'];
  var char8 = createRandomString(8);
  var char4a = createRandomString(4);
  var char4b = createRandomString(4);
  var char4c = createRandomString(4);
  var char12 = createRandomString(12);

  if (!!accessRandom) {
    var env = pickRandom(envPoss);
    var access = pickRandom(accessPoss);
  } else {
    var env = 'sandbox';
    var access = 'access';
  }
  var token = `${env}-${access}-${char8}-${char4a}-${char4b}-${char4c}-${char12}`;
  return token;
};

var randomStatus = function () {
  // var status = ['approved', 'declined', 'cancelled', 'confirmed'];
  var random = returnRandomNumberUpToMax(10000);
  if (random >= 9995) {
    return 'approved';
  } else if (random >= 9990) {
    return 'declined';
  } else if (random >= 10) {
    return 'confirmed';
  } else if (random >= 0) {
    return 'cancelled';
  }
};

/// main program

for (var i = 0; i < amountToAdd; i ++) {
  if ( i >= stop ) {
    break;
  }

  if ( i % 1000000 === 0 ) {
    console.log(i * start);
  }

  let currentCount = i + start;

  let userID = currentCount;
  let transactionID = currentCount;
  let status = randomStatus();
  let amount = Math.floor(Math.random() * 300000) / 100;
  let account = createRandomNumberUpToIntiger();

  let id_accounts = currentCount; //length 37
  let bankID = returnRandomNumberUpToMax(allBanksLength);
  let plaid_access_token = createPlaidRandomFakeToken(); // length  56
  let plaid_account_ID = createRandomString(); //length 37

  let plaidID = currentCount;
  let plaid_itemID = createRandomString();
  let timeStamp = createTimeStamp().toUTCString();

  transactions.write (transactionID + '|' + userID + '|' + status + '|' + amount + '|' + timeStamp + '\n');
  // plaidItems.write (plaidID + '|' + plaid_itemID + '\n');
  // users.write (currentCount + '|' + id_accounts + '\n');
  // accounts.write (id_accounts + '|' + bankID + '|' + plaid_access_token + '|' + plaid_account_ID + '|' + plaidID + '\n');

}

transactions.end();
users.end();
accounts.end();
plaidItems.end();


console.log('writing');