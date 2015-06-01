var test = require('tape');
var bpb = require('../lib');
var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');

test('dummy a (easy)', dummyTest('a'));
test('dummy b (trickier)', dummyTest('b'));

function dummyTest(name) {
    return function (t) {
        t.plan(1);
        asyncBoth(function(cb){
            apply(name, cb);
        }, function(cb){
            fs.readFile(path.join(__dirname, 'output', name+'.js'), 'utf8', cb);
        }, function(error, actual, expected){
            if (error){return t.fail(error);}
            t.equal(stripWhitespace(expected), stripWhitespace(actual));
        });
    };
}

function asyncBoth(taskA, taskB, cb) {
    var task_a_results, task_b_results;
    var _cb = function (error) {
        if (error) {
            return cb(error);
        }
        if (task_a_results && task_b_results) {
            cb.apply(null, [null].concat(task_a_results, task_b_results));
        }
    };
    taskA(function (error) {
        if (error) {
            return _cb(error)
        }
        task_a_results = Array.prototype.slice.call(arguments, 1);
        _cb();
    });
    taskB(function (error) {
        if (error) {
            return _cb(error)
        }
        task_b_results = Array.prototype.slice.call(arguments, 1);
        _cb();
    });
}

function apply(file, cb){
    var in_stream = fs.createReadStream(path.join(__dirname, 'input', file+'.js'), {encoding: 'utf8'});
    in_stream.pipe(bpb()).pipe(concat(function(data){
        cb(null, data.toString('utf8'));
    }));
}

function stripWhitespace (text){
    return text.replace(/( |\n|\r|\t)+/g, '');
}