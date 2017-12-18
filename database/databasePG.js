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
  console.log(createTransaction(100000001, 1, 500, 'tes'))
  // console.log(findByTransactionID(100000000, (err, data) => console.log(err, data)))

})
.catch(err => {
  console.log('error loggin into database', err)
})



createTransaction = function (transactionID, userID, amount, status) {
  pool.query(`insert into transactions (id_transaction, user_id, status, amount) VALUES (${transactionID}, ${userID}, ${status}, ${amount});`, (err, results) => {
    console.log(err, results)
    if (err) {
      return err;
    } else {
      return results.rows;
    }
  })
}

findByUserID = function (userID, callback) {
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
    pool.end()
  })
}

findByTransactionID = function (transactionID, callback) {
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
    pool.end()
  })
}



// pool.query(
//   'SELECT * from transactions \
//   where transactions.user_id = 33421',
//   (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// module.exports.query = query = async function (query) {
//   var res = await client.query ('select count(*) from users')


// }

// query();

module.exports.createTransaction = createTransaction;
module.exports.findByUserID = findByUserID;