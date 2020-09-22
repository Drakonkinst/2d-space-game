const Graphics = (function() {
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    
    function vectorVertex(vector) {
        vertex(vector.x, vector.y);
    }
    
    function reset() {
        stroke(0);
        strokeWeight(1);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
    }
    
    return {
        toRadians,
        toDegrees,
        
        draw() {
            clear();
            reset();
            background(50);
            
        }
    };
})();