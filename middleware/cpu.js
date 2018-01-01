var cpu = require('windows-cpu');

//https://www.npmjs.com/package/windows-cpu
// Get total load on server for each CPU

module.exports.getCPUTotalLoad = function () {
  return new Promise ((resolve, revoke) => {
    cpu.totalLoad(function(error, results) {
      if (error) {
        revoke (error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports.getCPUTotalLoad = function () {
  cpu.nodeLoad(function(error, results) {
    return new Promise ((resolve, revoke) => {
      if (error) {
        revoke(error);
      } else {
        resolve (results.load);
      }
    });
  });
};
// results =>
// {
//    load: 20,
//    found: [
//        { pid: 1000, process: 'node', load: 10 },
//        { pid: 1050, process: 'node#1', load: 6 },
//        { pid: 1100, process: 'node#2', load: 4 }
//    ]
// }

// console.log('Total Node.js Load: ' + results.load);


// Get listing of processors
module.exports.cpuInfo = function () {
  cpu.cpuInfo(function(error, results) {
    return new Promise ((resolve, revoke) => {
      if (error) {
        revoke(error);
      } else {
        resolve (results);
      }
    });

    // results =>
    // [
    //    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz',
    //    'Intel(R) Xeon(R) CPU E5-2609 0 @ 2.40GHz'
    // ]

    // console.log('Installed Processors: ', results);
  });
};

var averageCPULoadPercent = function () {
  var load = process.cpuUsage();
  return Math.floor((load.user / load.system ) * 100);
};

var returnPID = function () {
  return process.pid;
};