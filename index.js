const { queueToBankServices, queueToTransactions, queueToBankDeposits } = require ('./queues/queue.js');
const routes = require ('./middleware/routes');
const db = require('./database/databasePG').pool;
const { winston, startElasticSearchWithWinston } = require('./elasticsearch/winston');

if (!!process.env.PORT) {
  const dotenv = require('dotenv').config();
}

const port = process.env.port || 8080;

var server = routes.app.listen(8080, () => {
  // console.log("... port %d in %s mode", app.address().port, app.settings.env);
  console.log('App is listening on port: ', port);
  winston.info({
    type: 'system',
    message: 'App is listening on port: ', port
  });
});


db.connect()
  .then(data=> {
    console.log('DB Connected');
    winston.info({
      type: 'database',
      message: 'Database Connected'
    });
  })
  .catch(err => {
    console.log('error loggin into database', err);
    winston.error({
      type: 'Database',
      message: err
    });
  });


// process.on('uncaughtException', (error) => {
//   console.log ('UncaughtError!!', error);
//   winston.error({
//     type: 'UncaughtError',
//     message: error
//   });
// });


startElasticSearchWithWinston();

winston.info({
  type: 'system',
  message: 'Server Start'
});