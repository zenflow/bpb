my_process.browserAction();

var str = 'process.browser';

(function(process){
    assert(process.browser)
})({
    browser: false
});