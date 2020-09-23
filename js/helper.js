const debug = (function() {
    const debugMode = true;
    return function(msg) {
        if(debugMode) {
            console.log(msg);
        }
    }
})();

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}