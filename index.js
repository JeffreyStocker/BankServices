const env = require('dotenv').config()
const express = require('express');
// var elastic = require ('./elasticsearch/elasticsearch.js')
const queue = require ('./queues/queue.js')

const port = process.env.port || 8080;

var app = express();



// app.post ('/withdraw/:userID', () => {
//   userID = req.params.userID
// })

// app.post ('/cashout/:userID', () => {
//   userID = req.params.userID
// })


app.get ('/users/banks', () => {

})



// var server = app.listen(8080, () =>  {
//   // console.log("... port %d in %s mode", app.address().port, app.settings.env);
//   console.log('App is listening on port: ', port)
// })


process.on('uncaughtException', (error) => {
  console.log ('UncaughtError!!', error)
})