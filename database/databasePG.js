var { winston } = require('../elasticsearch/winston');

const { Client, Pool } = require('pg');
if (!process.env.PORT) {
  var dotenv= require('dotenv').config();
}

const pool = new Pool();
////directly call the variables
// const pool = new Pool({
//   PGHOST: process.env.PGHOST,
//   PGPORT: process.env.PGPORT,
//   PGDATABASE: process.env.PGDATABASE,
//   PGUSER: process.env.PGUSER,
//   PGPASSWORD: process.env.PGPASSWORD,
// });

pool.connect()
.then(data=> {
  console.log('DB Connected');

  // console.log(createTransaction(100000005, 1, 5432, 'test'))
  // console.log(findByTransactionID(100000002, (err, data) => console.log(err, data)))
  // console.log(updateTransactionStatus(100000002, 'yep'))
})
.catch(err => {
  console.log('error loggin into database', err)
})


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



// pool.query(
//   'SELECT * from transactions \
//   where transactions.user_id = 33421',
//   (err, res) => {
//   console.log(err, res)
//   pool.end()
// })


module.exports.createTransaction = createTransaction;
module.exports.findByUserID = findByUserID;