var sequelize = require ('sequelize');
var dotenv= require('dotenv').config();
const db = new sequelize('BankServices', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
})

const Transactions = sequelize.define('Transaction', {
  transactionID: sequelize.INTEGER,
  userID: sequelize.INTEGER,
  status: sequelize.VARCHAR,

})