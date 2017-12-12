//https://plaid.com/docs/quickstart/#pulling-auth-data
// app.get('/auth', function(req, res, next) {
//   // Retrieve Auth information for the Item, which includes high-level
//   // account information and account numbers for depository auth.
//   client.getAuth(ACCESS_TOKEN, function(error, numbersData) {
//     if(error != null) {
//       var msg = 'Unable to pull accounts from Plaid API.';
//       console.log(msg + '\n' + error);
//       return response.json({error: msg});
//     }
//     response.json({
//       error: false,
//       accounts: numbersData.accounts,
//       numbers: numbersData.numbers,
//     });
//   });
// });

module.exports.auth_response =
{
  "accounts": [
    {
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "balances": {
        "available": 100,
        "current": 110,
        "limit": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "subtype": "checking",
      "type": "depository"
    },
  ],
  "numbers": [
    {
      "account": "9900009606",
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "routing": "011401533",
      "wire_routing": "021000021"
    },
  ]
}


