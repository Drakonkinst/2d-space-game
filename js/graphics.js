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
    
    function vectorCurveVertex(vector, skipCorrection) {
        if(pathAnchor && !skipCorrection) {
            vector = vector.copy().add(pathAnchor.position);
        }
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
    
    let paths = {};
    let pathCounter = Config.recordPathInterval;
    let zoom = 1;
    
    return {
        toRadians,
        toDegrees,

        getZoom() {
            return zoom;
        },

        setZoom(z) {
            zoom = z;
        },

        getCameraAnchor(centerPoint) {
            return Vector.of(-centerPoint.x + width / (2 * zoom), -centerPoint.y + height / (2 * zoom));
        },
        
        clearPaths() {
            paths = {};
        },
        
        draw() {
            clear();
            reset();
            background(0);
            
            scale(zoom);

            let translateOffset;
            if(cameraTarget.position) {
                translateOffset = Graphics.getCameraAnchor(cameraTarget.position);
            } else {
                translateOffset = Graphics.getCameraAnchor(cameraTarget);
            }

            translate(translateOffset.x, translateOffset.y);
            
            if(pathCounter == 0) {
                pathCounter = Config.recordPathInterval;
            }
            pathCounter--;
            
            this.drawPreview();
            this.drawPlanetoids();
        },
        
        // simulates all bodies of the universe for a number of ticks
        drawPreview() {
            if(!Config.drawPreviews) {
                return;
            }
            
            let virtualBodies = [];
            let virtualPathMap = {};
            let virtualAnchor = null;
            
            // create virtual bodies + find new path anchor
            for(let planetoid of universe.allBodies) {
                let virtualBody = new VirtualBody(planetoid);
                virtualBodies.push(virtualBody);
                if(planetoid == pathAnchor) {
                    virtualAnchor = virtualBody;
                }
            }
            
            // simulate universe and record paths
            let virtualPathCounter = Config.recordPathInterval;
            for(let i = 0; i < Config.previewDistance; i++) {
                for(let body of virtualBodies) {
                    body.updateVelocity(virtualBodies, Config.timestep);
                }
                
                for(let body of virtualBodies) {
                    body.updatePosition(Config.timestep);
                    if(virtualPathCounter === 0) {
                        if(!virtualPathMap.hasOwnProperty(body.host.id)) {
                            virtualPathMap[body.host.id] = [];
                        }
                        let path = virtualPathMap[body.host.id];
                        let pos = body.position.copy();
                        
                        if(virtualAnchor != null) {
                            pos.subtract(virtualAnchor.position);
                        }
                        if(body.host != virtualAnchor) {
                            path.push(pos);
                        }
                        
                        /*
                        // also limited by maximum path length
                        if(path.length > Config.maxPathLength) {
                            path.shift();
                        }*/
                    }
                }
                
                if(virtualPathCounter === 0) {
                    virtualPathCounter = Config.recordPathInterval;
                }
                virtualPathCounter--;
            }
            
            // draw all paths
            for(let body of virtualBodies) {
                // final point of path
                let finalPos = body.position.copy();
                
                if(virtualAnchor != null) {
                    finalPos.subtract(virtualAnchor.position);
                }
                
                virtualPathMap[body.host.id].push(finalPos);
                
                if(virtualPathMap.hasOwnProperty(body.host.id)) {
                    let path = virtualPathMap[body.host.id];
                    Graphics.drawPath(path, null, 50);
                }
            }
        },
        
        drawPlanetoids() {
            if(Config.drawPaths) {
                for(let planetoid of universe.allBodies) {
                    this.drawPlanetoidPath(planetoid);
                }
            }
            
            for(let planetoid of universe.allBodies) {
                this.drawPlanetoid(planetoid);
            }
            reset();
        },
        
        drawPath(path, finalPoint, initColorInt, maxFade, maxDist) {
            let n = path.length;
            if(!maxDist || !maxFade) {
                maxDist = 1;
                maxFade = 0;
            }
            
            strokeWeight(1.5 / zoom);
            noFill();
            stroke(initColorInt - maxFade * min(n / maxDist, 1));
            
            beginShape();
            for(let i = 0; i < n; i++) {
                let point = path[i];
                vectorCurveVertex(point);
                
                if(i > 0 && i % 10 == 0) {
                    endShape();
                    stroke(initColorInt - maxFade * min((n - i) / maxDist, 1));
                    beginShape();
                    vectorCurveVertex(path[i - 2]);
                    vectorCurveVertex(path[i - 1]);
                    vectorCurveVertex(point);
                }
            }
            
            if(finalPoint) {
                vectorCurveVertex(finalPoint, true);
            }
            endShape();
        },

        drawPlanetoidPath(planetoid) {
            if(!paths.hasOwnProperty(planetoid.id)) {
                return;
            }
            let path = paths[planetoid.id];
            Graphics.drawPath(path, planetoid.position, 255, 155, 200);
        },
        
        drawPlanetoid(planetoid) {
            if(!planetoid.visible) {
                return;
            }
            
            noStroke();
            
            if(Input.getSelectedBody() == planetoid && Config.mode == "EDIT") {
                fill("yellow");
                let highlight = planetoid.radius * 2 + 5 / zoom;
                ellipse(planetoid.position.x, planetoid.position.y, highlight, highlight);
            }
            
            fill(planetoid.color);
            let d = planetoid.radius * 2;
            ellipse(planetoid.position.x, planetoid.position.y, d, d);
            
            if(Config.drawVelocityAcceleration) {
                // velocity
                stroke("green");
                strokeWeight(2 / zoom);
                drawLine(planetoid.position, planetoid.velocity, 20 / zoom);
                
                // acceleration
                stroke("yellow");
                strokeWeight(2 / zoom);
                
                for(let accel of planetoid.accelerationsDisplay) {
                    drawLine(planetoid.position, accel, 1000 / zoom);
                }
            }
            
            if(pathCounter === 0 && !Config.isStopped) {
                if(!paths.hasOwnProperty(planetoid.id)) {
                    paths[planetoid.id] = [];
                }
                let path = paths[planetoid.id]
                let pos = planetoid.position.copy();
                
                if(pathAnchor != null) {
                    pos.subtract(pathAnchor.position);
                }
                if(planetoid != pathAnchor) {
                    path.push(pos);
                }
                
                if(path.length > Config.maxPathLength) {
                    path.shift();
                }
            }
        }
    };
})();