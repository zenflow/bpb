# bpb
Browserify transform to replace references to `process.browser` with `true`, so that server-side-only code can be stripped out of isomorphic modules

[![build status](https://travis-ci.org/zenflow/bpb.svg?branch=master)](https://travis-ci.org/zenflow/bpb?branch=master)
[![dependencies](https://david-dm.org/zenflow/bpb.svg)](https://david-dm.org/zenflow/bpb)
[![dev-dependencies](https://david-dm.org/zenflow/bpb/dev-status.svg)](https://david-dm.org/zenflow/bpb#info=devDependencies)

[![npm](https://nodei.co/npm/bpb.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/bpb)

__WARNING__ This module hasn't *really* been implemented yet. (Hence the failing build status)

(Works with [test-dummy module a](https://github.com/zenflow/bpb/blob/master/tests/input/a.js) but not [test-dummy module b](https://github.com/zenflow/bpb/blob/master/tests/input/b.js) 