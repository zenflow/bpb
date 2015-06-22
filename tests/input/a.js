// automatic ones

if (process.browser){
    console.log('I am on the client');
} else {
    console.log('I am on the server');
}

console.log('Again, I am on the ' + (process.browser ? 'client' : 'server'));

console.log('My secret token is ' + (!process.browser && '"secret token"' || '..jk, not telling'));

function animate(){
    if (!process.browser){throw new Error('I shouldn\'t be called on the server')}
    doThis().then(doThat);
}