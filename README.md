# bpb
Browserify transform to replace `process.browser` with `true`, so that server-side-only code can be stripped out

[![build status](https://travis-ci.org/zenflow/bpb.svg?branch=master)](https://travis-ci.org/zenflow/bpb?branch=master)
[![dependencies](https://david-dm.org/zenflow/bpb.svg)](https://david-dm.org/zenflow/bpb)
[![dev-dependencies](https://david-dm.org/zenflow/bpb/dev-status.svg)](https://david-dm.org/zenflow/bpb#info=devDependencies)

[![npm](https://nodei.co/npm/bpb.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/bpb)

__WARNING__ This module hasn't *really* been implemented yet. (Hence the failing build status)
It does what it says but it will fuck with the following instances where it shouldn't make any changes.
```js
my_process.browserAction();
```
or
```js

(function(process){assert(process.browser)})({browser: false});
```