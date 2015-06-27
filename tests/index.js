var test = require('tape');
var concat = require('concat-stream');
var bpb = require('../lib');

test('works', getTest([
    {
        source: 'foo(process.browser); ',
        expected: 'foo(true); '
    },
    {
        source: '(function(){return !process.browser ? 1 : 2; })(); ',
        expected: '(function(){return !true ? 1 : 2; })(); '
    }
]));

test('excludes occurrences in scope where `process` identifier is overridden', getTest([
    'foo(process.browser); var process; ',
    'foo(process.browser); function process(){} ',
    '(function(){foo(process.browser); })(); var process; ',
    '(function(){foo(process.browser); })(); function process(){} ',
    '(function(){foo(process.browser); var process; })(); ',
    '(function(){foo(process.browser); function process(){} })(); ',
    '(function(process){foo(process.browser); })(); ',
    '(function process(){foo(process.browser); })(); '
]));

test('includes occurrences where `process` is overridden in subscope', getTest([
    {
        source: '(function(){var process; })(); foo(process.browser); ',
        expected: '(function(){var process; })(); foo(true); '
    },
    {
        source: '(function(){function process(){} })(); foo(process.browser); ',
        expected: '(function(){function process(){} })(); foo(true); '
    },
    {
        source: '(function(process){})(); foo(process.browser); ',
        expected: '(function(process){})(); foo(true); '
    },
    {
        source:'(function process(){})(); foo(process.browser); ',
        expected: '(function process(){})(); foo(true); '
    }
]));

function getTest(test_cases){
    return function (t) {
        t.plan(test_cases.length);
        test_cases.forEach(function(test_case){
            var source = typeof test_case == 'object' ? test_case.source : test_case;
            var expected = typeof test_case == 'object' ? test_case.expected : test_case;
            concat(source)
                .pipe(bpb())
                .pipe(concat(function(data){
                    t.equal(data.toString('utf8'), expected);
                }));
        })
    };
}