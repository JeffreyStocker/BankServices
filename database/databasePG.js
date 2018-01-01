if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}

const { winston } = require('../elasticsearch/winston');
const { Client, Pool } = require('pg');
const pool = new Pool();
////directly call the variables
// const pool = new Pool({
//   PGHOST: process.env.PGHOST,
//   PGPORT: process.env.PGPORT,
//   PGDATABASE: process.env.PGDATABASE,
//   PGUSER: process.env.PGUSER,
//   PGPASSWORD: process.env.PGPASSWORD,
// });

// pool.connect()
// .then(data=> {
//   console.log('DB Connected');

//   // console.log(createTransaction(100000005, 1, 5432, 'test'))
//   // console.log(findByTransactionID(100000002, (err, data) => console.log(err, data)))
//   // console.log(updateTransactionStatus(100000002, 'yep'))
// })
// .catch(err => {
//   console.log('error loggin into database', err)
// })


//id_transaction, user_id, status, amount)
var createTransaction = function (transactionID, userID, amount, status) {
  winston.log({
    transactionID: transactionID || 'unknown',
    location: 'database',
    stage: 'start'
  })
  return new Promise ((resolve, revoke) => {
    pool.query(`insert into "transactions" VALUES (${transactionID}, '${userID}', '${status}', ${amount});`, (err, results) => {
      // console.log(err, results)
      winston.log({
        transactionID: transactionID || 'unknown',
        location: 'database',
        stage: 'end'
      })
      if (err) {
        revoke(err);
      } else {
        resolve(results);
      }
    })
  })
}


var updateTransactionStatus = function (transactionID, status) {
  pool.query(
    `update transactions
    set status = '${status}'
    where transactions.id_transaction = ${transactionID};`,
   (err, results) => {
     if (err) {
      console.log(err)
      return err;
    } else {
      return results;
    }
  })
}


var findByUserID = function (userID, callback) {
  if (!userID || typeof userID !== 'number') { return undefined }
  pool.query(
    'SELECT * from transactions \
    where transactions.user_id =' + userID,
    (err, res) => {
    // console.log(err, res)
    if (err) {
      callback (err, null);
    } else {
      callback (null, res.rows)
    }
    // pool.end()
  })
}


var findByTransactionID = function (transactionID, callback) {
  if (!transactionID || typeof transactionID !== 'number') { return undefined }
  pool.query(
    'SELECT * from transactions \
    where transactions.id_transaction =' + transactionID,
    (err, res) => {
    // console.log(err, res)
    if (err) {
      callback (err, null);
    } else {
      callback (null, res.rows)
    }
    // pool.end()
  })
}


var retrieveAllUsersAndBank = function () {
  return new Promise ((resolve, revoke) => {
    pool.query(
    'SELECT users.id_user, banks.bankName \
    from users, banks, accounts'
    , (err, res) => {
      if (err) {
        revoke (err);
      } else {
        resolve (res.rows)
      }
    })
  })
}


module.exports.pool = pool;
module.exports.createTransaction = createTransaction;
module.exports.updateTransactionStatus = updateTransactionStatus;
module.exports.findByUserID = findByUserID;
module.exports.findByTransactionID = findByTransactionID;
module.exports.retrieveAllUsersAndBank = retrieveAllUsersAndBank;