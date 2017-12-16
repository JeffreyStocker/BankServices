var elasticsearch=require('elasticsearch');
//https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new elasticsearch.Client( {
  hosts: 'localhost:9200',
  log: 'trace'
});

module.exports = client;


client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});