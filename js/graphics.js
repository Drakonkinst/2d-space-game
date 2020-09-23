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
    
    function vectorCurveVertex(vector) {
        curveVertex(vector.x, vector.y);
    }
    
    function reset() {
        stroke(0);
        strokeWeight(1);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
    }
    
    function max(a, b) {
        if(a > b) {
            return a;
        }
        return b;
    }
    
    function min(a, b) {
        if(a < b) {
            return a;
        }
        return b;
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
    
    const paths = {};
    let pathCounter = Config.recordPathInterval;
    
    return {
        toRadians,
        toDegrees,
        
        draw() {
            clear();
            reset();
            background(0);
            
            let translateOffset;
            if(cameraTarget.position) {
                // given center point, must find anchor
                translateOffset = getCameraAnchor(cameraTarget.position);
            } else {
                // no need to find anchor
                translateOffset = cameraTarget;
            }
            translate(translateOffset.x, translateOffset.y);
            
            if(pathCounter == 0) {
                pathCounter = Config.recordPathInterval;
            }
            pathCounter--;
            
            this.drawPlanetoids();
        },
        
        drawPlanetoids() {
            for(let planetoid of universe.allBodies) {
                this.drawPlanetoid(planetoid);
            }
            reset();
        },
        
        drawPlanetoid(planetoid) {
            if(Config.drawPaths && paths.hasOwnProperty(planetoid.id)) {
                strokeWeight(1.5);
                noFill();
                beginShape();
                let path = paths[planetoid.id];
                let n = path.length;
                const MAX_FADE = 155;
                const MAX_FADE_DIST = 200;
                stroke(255 - MAX_FADE * min(n / MAX_FADE_DIST, 1));
                for(let i = 0; i < n; i++) {
                    let point = path[i];
                    vectorCurveVertex(point);

                    if(i > 0 && i % 10 == 0) {
                        endShape();
                        stroke(255 - MAX_FADE * min((n - i) / MAX_FADE_DIST, 1));
                        beginShape();
                        vectorCurveVertex(path[i - 2]);
                        vectorCurveVertex(path[i - 1]);
                        vectorCurveVertex(point);
                    }

                }
                vectorCurveVertex(planetoid.position);
                endShape();
            }
            
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
                stroke("yellow");
                strokeWeight(2);
                
                for(let accel of planetoid.accelerationsDisplay) {
                    drawLine(planetoid.position, accel, 100);
                }
            }
            
            if(pathCounter == 0 && !Config.isStopped) {
                if(!paths.hasOwnProperty(planetoid.id)) {
                    paths[planetoid.id] = [];
                }
                let path = paths[planetoid.id]
                path.push(planetoid.position.copy());
                
                if(path.length > Config.maxPathLength) {
                    path.shift();
                }
            }
        }
    };
})();