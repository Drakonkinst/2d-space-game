const debug = (function() {
    const debugMode = true;
    return function(msg) {
        if(debugMode) {
            console.log(msg);
        }
    }
})();