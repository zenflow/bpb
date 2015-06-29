# bpb
browserify transform to safely replace `process.browser` with `true` by working on the Abstract Syntax Tree (AST) 

__Note__: Works safely on ES5 code. Does __not__ work safely on ES6 code __yet__. Will not detect block-scoped `let` `const` and `function` declarations that override the `process` identifier.

[![build status](https://travis-ci.org/zenflow/bpb.svg?branch=master)](https://travis-ci.org/zenflow/bpb?branch=master)
[![dependencies](https://david-dm.org/zenflow/bpb.svg)](https://david-dm.org/zenflow/bpb)
[![dev-dependencies](https://david-dm.org/zenflow/bpb/dev-status.svg)](https://david-dm.org/zenflow/bpb#info=devDependencies)

[![npm](https://nodei.co/npm/bpb.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/bpb)

## introduction

The [browserify implementation of `process`](https://github.com/defunctzombie/node-process) 
has a special `browser` member set to `true`, which is not present in the 
[node implementation of `process`](https://nodejs.org/api/process.html).

```js
	// on node
	process.browser === undefined
	// -> true
	
	// on browser
	process.browser === true
	// -> true
```

This can be referenced in isomorphic code that
* adjusts it's behavior depending on which environment it's in
* is fully portable within the nodejs/iojs/browserify ecosystem, and
* is concise and [Don't Repeat Yourself (DRY)](http://programmer.97things.oreilly.com/wiki/index.php/Don't_Repeat_Yourself)

```js
  // example #1
  function animateElement(element) {
    if (!process.browser){
      throw new Error('animateElement function is for use client-side only!'); 
    }
    $(element).animate({/*...*/});
  }
  
  // example #2
  function getCookie(name) {
    return process.browser ? getCookieFromWindow(name) : getCookieFromRequest(req, name);
  }
```

__This is where bpb (short for "browserify-processisfy.browserify") comes in.__

For optimized build-sizes and or security, use bpb in combination with [unreachable-branch-transform](https://github.com/zertosh/unreachable-branch-transform) (or a good minifier like [UglifyJS](https://github.com/mishoo/UglifyJS)) to strip out server-side-only code.

```js
  // example #1 after bpb
  function animateElement(element) {
    if (!true){
      throw new Error('animateElement function is for use client-side only!');
    }
    $(element).animate({/*...*/});
  }

  // example #1 after bpb + unreachable-branch-transform
  function animateElement(element) {
    $(element).animate({/*...*/});
  }
  
  // example #2 after bpb
  function getCookie(name) {
    return true ? getCookieFromWindow(name) : getCookieFromRequest(req, name);
  }
  
  // example #2 after bpb + unreachable-branch-transform
  function getCookie(name) {
    return getCookieFromWindow(name);
  }
```
## usage 

bpb can be used as a [browserify transform](https://github.com/substack/browserify-handbook#transforms), or a regular [transform stream](https://nodejs.org/api/stream.html). 

Either way, it takes no options.

```js
  // with browserify
  var browserify = require('browserify');
  var fs = require('fs');
  browserify('input.js')
  	.transform('bpb')
  	.transform('unreachable-branch-transform')
  	.bundle()
  	.pipe(fs.createWriteStream('output.js'));

  // without browserify
  var fs = require('fs');
  var bpb = require('bpb');
  var unreachable = require('unreachable-branch-transform');
  fs.createReadStream('input.js')
    .pipe(bpb())
    .pipe(unreachable())
    .pipe(fs.createWriteStream('output.js'));
```

## changelog

### 0.1.0

* safe implementation
* advanced tests

### 0.0.1

* tests
* initial dumb implementation
