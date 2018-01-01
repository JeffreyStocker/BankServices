
var fs = require('fs');
var nationalBanks = require('../spec/example_data/nationalBanks.js');
var regionalBanks = require('../spec/example_data/regionalBanks.js');


var allBanks = regionalBanks.concat(nationalBanks);
var createBankData = function () {
  var banksLocation = './banks';
  var banks = fs.createWriteStream(banksLocation, { flags: 'a'});
  var length = regionalBanks.length + nationalBanks.length;
  for (var i = 0; i < allBanks.length; i++) {
    banks.write (`${i+1}|${allBanks[i]}\n`);
  }
  banks.end();
};

createBankData();