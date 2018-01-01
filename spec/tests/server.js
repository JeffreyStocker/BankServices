var chai = require('chai')
var assert = require('assert');
var expect = require('chai').expect;
var should = chai.should();
var mocha = require ('mocha');

// describe('test' ,() => {
//   it ('should be 5', () => {
//     expect(5).to.be.equal(5)
//   });
// });

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});