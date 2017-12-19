const Memcached = require('memcached');

var options = {};
var memcached = new Memcached(process.env.MEM_CACHE, options);

var set = function (key, value, timeout = 20) {
  return new Promise ((resolve, revoke) => {
    memcached.set(key, value, timeout, function (err, succ) {
      if (err) {
        // console.log(err)
        revoke (err)
      } else {
        // console.log('memcache:', succ)
        resolve(succ)
      }
    })
  })
}


var get = function (key) {
  return new Promise ((resolve, revoke) => {
    memcached.get(key, (err, data) =>  {
      if (err) {
        revoke (err)
        // console.log(err)
      } else {
        resolve(data)
        // console.log('data', data)
      }
    })
  })
}

module.exports.set = set;
module.exports.get = get;
