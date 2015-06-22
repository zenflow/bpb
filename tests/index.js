var test = require('tape');
var concat = require('concat-stream');
var fs = require('fs');
var path = require('path');
var bpb = require('../lib');

Array.prototype.forEach.call('abc', function(name){
    test('dummy ' + name, function (t) {
        t.plan(1);
        var expected;
        fs.createReadStream(path.join(__dirname, 'input', name+'.js'), {encoding: 'utf8'})
            .pipe(bpb())
            .pipe(concat(function(data){
                t.equal(data.toString('utf8'), expected);
            }));
        expected = fs.readFileSync(path.join(__dirname, 'expected', name+'.js'), 'utf8');
    });
});

