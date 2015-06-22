my_process.browserAction();

(function(process){
    assert(process.browser)
})({
    browser: false
});