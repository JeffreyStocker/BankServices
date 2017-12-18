var elasticsearch=require('elasticsearch');
//https://www.compose.com/articles/getting-started-with-elasticsearch-and-node/
var client = new elasticsearch.Client( {
  hosts: 'localhost:9200',
  log: 'trace'
});

module.exports.client = client;

//create the initial index
var createIndex = function (name) {
  return client.indices.create({
    index: name
  })
}
createIndex('log')
.then(
  console.log('index complete')
)
.catch(err => {
  console.log('index did not complete')
})

// var mapping = module.exports.mapping = function (index) {
//   return client.indices.putMapping({
//     index: index,
//     type: 'document',
//     body: {
//       properties: {
//         data
//       }
//     }
//   })
// }
// mapping('log')

var ping = module.exports.ping = function () {
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      // console.trace('elasticsearch cluster is down!');
      console.log('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
}

module.exports.addRecord = function (data) {
  //https://blog.raananweber.com/2015/11/24/simple-autocomplete-with-elasticsearch-and-node-js/
  return client.index({
    index: 'log',
    type: 'document',
    body: {
      data: data
    }
  })
}

module.exports.addRecord('testings')
.then (data => {
  console.log('data', data)
})
.catch(err => {
  console.log('err', err)
})
// module.exports.addRecord('testings2')
// module.exports.addRecord('testings1')
// module.exports.addRecord('testings4342')