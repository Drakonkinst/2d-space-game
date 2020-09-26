const debug = (function() {
    const debugMode = true;
    return function(msg) {
        if(debugMode) {
            console.log(msg);
        }
    }
})();

// ID Generator
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function randNum(min, max) {
    return Math.random() * (max - min) + min;
}

// min/max integer, inclusive
function randInt(min, max) {
    return ~~(randNum(min, max + 1));
}