var test = require('tape');
var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');
var bpb = require('../lib');

test('test-dummy module a (easy)', dummyTest('a'));
test('test-dummy module b (trickier)', dummyTest('b'));

function dummyTest(module_name) {
    return function (t) {
        t.plan(1);
        var expected;
        fs.createReadStream(path.join(__dirname, 'input', module_name+'.js'), {encoding: 'utf8'})
            .pipe(bpb())
            .pipe(concat(function(data){
                t.equal(stripWhitespace(data.toString('utf8')), stripWhitespace(expected));
            }));
        expected = fs.readFileSync(path.join(__dirname, 'expected', module_name+'.js'), 'utf8');
    }
}

function stripWhitespace (text){
    return text.replace(/( |\n|\r|\t)+/g, '');
}
