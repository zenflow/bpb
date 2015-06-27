var test = require('tape');
var concat = require('concat-stream');
var bpb = require('../lib');

test('works', function(t){
    t.plan(1);
    testSource(t, '(function(){return !process.browser ? 1 : 2; })(); ',
                '(function(){return !true ? 1 : 2; })(); ');
});
test('excludes occurrences in scope where `process` identifier is overridden', function(t){
    t.plan(12);
    testSource(t, 'foo(process.browser); var process; ');
    testSource(t, 'foo(process.browser); function process(){} ');
    testSource(t, '(function(){foo(process.browser); })(); var process; ');
    testSource(t, '(function(){foo(process.browser); })(); function process(){} ');
    testSource(t, '(function(){foo(process.browser); var process; })(); ');
    testSource(t, '(function(){foo(process.browser); function process(){} })(); ');
    testSource(t, '(function(process){foo(process.browser); })(); ');
    testSource(t, '(function process(){foo(process.browser); })(); ');
    // nested function scopes
    testSource(t, '(function(){(function(){foo(process.browser); })(); })(); var process; ');
    testSource(t, '(function(){(function(){foo(process.browser); })(); })(); function process(){} ');
    testSource(t, '(function(process){(function(){foo(process.browser); })(); })(); ');
    testSource(t, '(function process(){(function(){foo(process.browser); })(); })(); ');
});
test('includes occurrences where `process` is overridden in subscope', function(t){
    t.plan(4);
    testSource(t, '(function(){var process; })(); foo(process.browser); ',
                  '(function(){var process; })(); foo(true); ');
    testSource(t, '(function(){function process(){} })(); foo(process.browser); ',
                  '(function(){function process(){} })(); foo(true); ');
    testSource(t, '(function(process){})(); foo(process.browser); ',
                  '(function(process){})(); foo(true); ');
    testSource(t, '(function process(){})(); foo(process.browser); ',
                  '(function process(){})(); foo(true); ');
});

function testSource(t, source, expected){
    expected = typeof expected == 'undefined' ? source : expected;
    concat(source)
        .pipe(bpb())
        .pipe(concat(function(data){
            t.equal(data.toString('utf8'), expected);
        }));
}