if (!!process.env.PORT) {
  var dotenv= require('dotenv').config();
}
const express = require('express');
// var elastic = require ('./elasticsearch/elasticsearch.js');
const queue = require ('./queues/queue.js');
// const axios = require ('axios');

const port = process.env.port || 8080;

var app = express();

// axios.post('localhost:9200/', )

// app.post ('/withdraw/:userID', () => {
//   userID = req.params.userID
// })

// app.post ('/cashout/:userID', () => {
//   userID = req.params.userID
// })

app.use(express.static('public'));

app.post ('/get_access_token', (req, res) => {
  // public_token: public_token,
  console.log ((req.body))
});
var server = app.listen(8080, () =>  {
  // console.log("... port %d in %s mode", app.address().port, app.settings.env);
  console.log('App is listening on port: ', port)
})


process.on('uncaughtException', (error) => {
  console.log ('UncaughtError!!', error)
})