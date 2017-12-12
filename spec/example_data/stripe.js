//https://stripe.com/docs/api/node#payout_object
module.exports.stripe_payout_object =
{
  "id": "tr_10340J2eZvKYlo2Cg42HilbB",
  "object": "payout",
  "amount": 5687,
  "arrival_date": 1386374400,
  "automatic": true,
  "balance_transaction": "txn_19XJJ02eZvKYlo2ClwuJ1rbA",
  "created": 1386212146,
  "currency": "usd",
  "description": "STRIPE TRANSFER",
  "destination": null,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "livemode": false,
  "metadata": {
    "order_id": "6735"
  },
  "method": "standard",
  "source_type": "card",
  "statement_descriptor": null,
  "status": "paid",
  "type": "bank_account"
}


//https://stripe.com/docs/api/node#create_payout
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );

// stripe.payouts.create({
//   amount: 400,
//   currency: "usd"
// }, function(err, payout) {
//   // asynchronously called
// });
module.exports.stripe_Create_payout_response =
{
  "id": "tr_10340J2eZvKYlo2Cg42HilbB",
  "object": "payout",
  "amount": 5687,
  "arrival_date": 1386374400,
  "automatic": true,
  "balance_transaction": "txn_19XJJ02eZvKYlo2ClwuJ1rbA",
  "created": 1386212146,
  "currency": "usd",
  "description": "STRIPE TRANSFER",
  "destination": null,
  "failure_balance_transaction": null,
  "failure_code": null,
  "failure_message": null,
  "livemode": false,
  "metadata": {
    "order_id": "6735"
  },
  "method": "standard",
  "source_type": "card",
  "statement_descriptor": null,
  "status": "paid",
  "type": "bank_account"
}

