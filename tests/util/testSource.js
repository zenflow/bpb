var concat = require('concat-stream');
var Readable = require('stream').Readable;
var bpb = require('../../lib');

function testSource(t, source, expected){
    if (!expected){
        expected = source;
    }
    var readable = new Readable;
    readable._read = function(){};
    readable.push(source);
    readable.push(null);
    var tranformed = readable.pipe(bpb());
    tranformed.pipe(concat(function(data){
        t.equal(data.toString('utf8'), expected);
    }));
}
module.exports = testSource;