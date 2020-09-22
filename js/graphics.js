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
    
    function drawLine(position, velocity, scale) {
        let theta = Math.atan2(velocity.y, velocity.x);
        let r = velocity.magnitude() * scale;
        let x1 = position.x;
        let y1 = position.y;
        let x2 = position.x + r * Math.cos(theta);
        let y2 = position.y + r * Math.sin(theta);
        line(x1, y1, x2, y2);
    }
    
    return {
        toRadians,
        toDegrees,
        
        draw() {
            clear();
            reset();
            background(0);
            
            this.drawPlanetoids();
            
        },
        
        drawPlanetoids() {
            for(let planetoid of universe.allBodies) {
                this.drawPlanetoid(planetoid);
            }
            reset();
        },
        
        drawPlanetoid(planetoid) {
            noStroke();
            fill(planetoid.color);
            let d = planetoid.radius * 2;
            ellipse(planetoid.position.x, planetoid.position.y, d, d);
            
            if(Config.drawVelocity) {
                stroke("green");
                strokeWeight(2);
                drawLine(planetoid.position, planetoid.velocity, 10);
            }
            
            if(Config.drawAcceleration) {
                stroke("white");
                strokeWeight(2);
                
                for(let accel of planetoid.accelerationsDisplay) {
                    drawLine(planetoid.position, accel, 1000);
                }
            }
        }
    };
})();