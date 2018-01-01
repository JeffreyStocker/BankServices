var dwolla = require ('dwolla');

module.exports.transferFunds = function () {

  return new Promise ((resolve, revoke) => {
    var random = (Math.random() * 100) + 1;
    if (random <= 99.5) {
      resolve (false);
    } else {
      resolve (true);
    }
  });
};

module.exports.getFundingSource = function (customer, fundingSourceName, processorToken) {
  var customerUrl = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C';
  var requestBody = {
    'plaidToken': 'processor-sandbox-161c86dd-d470-47e9-a741-d381c2b2cb6f',
    'name': 'Jane Doe’s Checking'
  };

  appToken
    .post(`${customerUrl}/funding-sources`, requestBody)
    .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31'
};

var sendMoneyRequest = function () {
  /*
  return message from api
  //https://docs.dwolla.com/#create-money-request
  //POST https://www.dwolla.com/oauth/rest/requests/
  {
    "Success": true,
    "Message": "Success",
    "Response": 996
} */
};



