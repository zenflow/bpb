var test = require('tape');
var concat = require('concat-stream');
var bpb = require('../lib');

test('excludes the right occurrences in es5 code', getTest([
    'foo(process.browser); var process; ',
    'foo(process.browser); function process(){} ',
    '(function(){foo(process.browser); })(); var process; ',
    '(function(){foo(process.browser); var process; })(); ',
    '(function(process){foo(process.browser); })(); ',
    '(function process(){foo(process.browser); })(); '
]));

test('includes the right occurrences in es5 code', getTest([
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

test('excludes the right occurrences in es6 code', getTest({
    ecmaVersion: 6
}, [
    'foo(process.browser); let process; ',
    'foo(process.browser); const process = {}; ',
    '{foo(process.browser); } var process; ',
    '{foo(process.browser); } let process; ',
    '{foo(process.browser); let process; } ',
    '{foo(process.browser); function process(){} } ',
    'for (let process in {}){foo(process.browser); } ',
    'for (let process = 0; !process; process++){foo(process.browser); } ',
    'try {} catch (process) {foo(process.browser); }' // enough!
]));

test('includes the right occurrences in es6 code', getTest({
    ecmaVersion: 6
}, [
    {
        source: '{ let process; } foo(process.browser); ',
        expected: '{ let process; } foo(true); '
    },
    {
        source: '{ const process = {}; } foo(process.browser); ',
        expected: '{ const process = {}; } foo(true); '
    },
    {
        source: '{ function process(){} } foo(process.browser); ',
        expected: '{ function process(){} } foo(true); '
    },
    {
        source: 'for (let process in {}){} foo(process.browser); ',
        expected: 'for (let process in {}){} foo(true); '
    },
    {
        source: 'for (let process = 0; !process; process++){} foo(process.browser); ',
        expected: 'for (let process = 0; !process; process++){} foo(true); '
    }
]));

function getTest(){
    var options = (arguments[0] instanceof Array ? null : arguments[0]) || {};
    var test_cases = arguments[0] instanceof Array ? arguments[0] : arguments[1];
    return function (t) {
        t.plan(test_cases.length);
        test_cases.forEach(function(test_case){
            var source = typeof test_case == 'object' ? test_case.source : test_case;
            var expected = typeof test_case == 'object' ? test_case.expected : test_case;
            concat(source)
                .pipe(bpb(options))
                .pipe(concat(function(data){
                    t.equal(data.toString('utf8'), expected);
                }));
        })
    };
}