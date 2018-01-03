const banksData = require('../database/databasePG').retrieveAllUsersAndBank;
const { winston } = require('../elasticsearch/winston');
const express = require('express');
const queue = require ('../queues/queue.js');

if (!!process.env.PORT) {
  const dotenv= require('dotenv').config();
}

var app = express();

// axios.post('localhost:9200/', )

// app.post ('/withdraw/:userID', () => {
//   userID = req.params.userID
// })

// app.post ('/cashout/:userID', () => {
//   userID = req.params.userID
// })

app.get('/users/banks', (req, res) => {
  banksData()
    .then((data) => {
      res.status(200).json(data);
      // res.send(data);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});


///used to get a access token for testing

// app.use(express.static('public'));

// app.post ('/get_access_token', (req, res) => {
//   // public_token: public_token,
//   console.log ((req.body));
// });

module.exports.app = app;