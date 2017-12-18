var sequelize = require ('sequelize');
if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}
const db = new sequelize('BankServices', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
})

const Transactions = sequelize.define('Transaction', {
  transactionID: sequelize.INTEGER,
  userID: sequelize.INTEGER,
  status: sequelize.VARCHAR,

})

const Account = sequelize.define('Account', {
id_account:  sequelize.Integer ,
bank_id: sequelize.INTEGER ,
plaid_access_token: sequelize.STRING(20) ,
plaid_account_id: sequelize.STRING(20) ,
plaid_item_id: sequelize.INTEGER ,
})

//