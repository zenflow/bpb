var concat = require('concat-stream');
var Readable = require('stream').Readable;
var bpb = require('../../lib');

function transform(source, cb){
    var readable = new Readable;
    readable._read = function(){};
    readable
        .pipe(bpb())
        .pipe(concat(function(data){
            cb(data.toString('utf8'));
        }));
    readable.push(source);
    readable.push(null);
}

module.exports = transform;