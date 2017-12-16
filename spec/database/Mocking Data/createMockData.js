var sequelize = require ('sequelize')
var fs = require('fs')
var faker = require('faker')
var chance = require('chance.js')
var nationalBanks = require('../spec/example_data/nationalBanks.js')
var regionalBanks = require('../spec/example_data/regionalBanks.js')

var allBanksLength = regionalBanks.length + nationalBanks.length

//will need to run twice to get all 10 million records
//adjust start to 5000001 and keep amount to add at 5000000
var start = 1;
var amountToAdd = 5000000;

var transactionsLocation = './transactions'
var transactions = fs.createWriteStream(transactionsLocation, { flags: 'a'})
var usersLocation = './users'
var users = fs.createWriteStream(usersLocation, { flags: 'a'})
var accountsLocation = './accounts'
var accounts = fs.createWriteStream(accountsLocation, { flags: 'a'})
var plaidItemsLocation = './plaidItems'
var plaidItems = fs.createWriteStream(plaidItemsLocation, { flags: 'a'})

for (var i = 0; i < amountToAdd; i ++) {
  if ( i % 1000000 === 0 ) {
    console.log(i/1000000)
  }
  let currentCount = i + start;

  let currentCount = i + 1;
  if (currentCount <= 9000005 && currentCount >= 8999997) {
    console.log (currentCount)
  }
  let userID = currentCount;
  let transactionID = currentCount;
  let status = 'good';
  let amount = Math.floor(Math.random()*300000)/100;
  let account = createRandomNumberUpToIntiger();

  let id_accounts = currentCount;
  let bankID = returnRandomNumberUpToMax(allBanksLength);
  let plaid_access_token = createRandomNumberUpToIntiger();
  let plaid_account_ID = createRandomNumberUpToIntiger();

  let plaidID = currentCount;
  let plaid_itemID = createRandomNumberUpToIntiger();

  transactions.write (transactionID + "|" + userID  + "|" + status  + "|" + amount + "\n");
  plaidItems.write (plaidID + "|" + plaid_itemID + "\n");
  users.write (currentCount + "|" + id_accounts + "\n");
  accounts.write (id_accounts + "|" + bankID  + "|" + plaid_access_token  + "|" + plaid_account_ID + "|" + plaidID + "\n");

}

transactions.end()
users.end()
accounts.end()
plaidItems.end()


console.log('complete')


var returnRandomInArray = function (array = ['']){
  return array[Math.floor((Math.random()* array.length - 1) + 0)]
}
var returnRandomNumberUpToMax = function (max = 1) {
  return Math.floor((Math.random()* max) + 1)
}

var createRandomNumberUpToIntiger = function () {
  return Math.floor((Math.random()* 2147483646) + 1)
}