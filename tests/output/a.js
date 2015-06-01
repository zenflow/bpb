if (true){
    console.log('I am on the client');
} else {
    console.log('I am on the server');
}

console.log('Again, I am on the ' + (true ? 'client' : 'server'));

console.log('My secret token is ' + (!true && '"secret token"' || '..jk, not telling'));

function animate(){
    if (!true){throw new Error('I shouldn\'t be called on the server')}
    doThis().then(doThat);
}