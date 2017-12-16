var env = require('dotenv').config()
var express = require('express');
var app = express();
var port = process.env.port || 8080;
var elastic = require ('./elasticsearch/elasticsearch.js')



app.post ('/withdraw/:userID', () => {
  userID = req.params.userID
})

app.post ('/cashout/:userID', () => {
  userID = req.params.userID
})


app.get ('/users/banks', () => {

})




var server = app.listen(8080, () =>  {
  // console.log("... port %d in %s mode", app.address().port, app.settings.env);
  console.log('App is listening on port: ', port)
})


process.on('uncaughtException', (error) => {
  console.log ('UncaughtError!!', error)
})