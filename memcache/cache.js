const Memcached = require('memcached');

var options = {};
var memcached = new Memcached(process.env.MEM_CACHE, options);

memcached.set('test', 'here', 20, function (err, succ) {
  if (err) {
    console.log(err)
  } else {
    console.log('memcache:', succ)

  }
})

memcached.get('test', (err, data) =>  {
  if (err) {
    console.log(err)
  } else {
    console.log('data', data)
  }
})