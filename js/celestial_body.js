const CelestialBody = (function() {
    return class CelestialBody {
        constructor(mass, position, initialVelocity) {
            this.id = uuidv4();
            this.universe = universe;
            this.mass = mass;
            this.position = position;
            this.velocity = initialVelocity.copy();
            
            // display variables
            this.accelerationsDisplay = [];
            this.maxAccel = -1;
        }
        
        updateVelocity(allBodies, timestep) {
            this.accelerationsDisplay.length = 0;
            for(let otherBody of allBodies) {
                if(otherBody == this) {
                    continue;
                }
                
                let distSq = otherBody.position.distanceSquared(this.position);
                let forceDir = otherBody.position.copy().subtract(this.position).normalize();
                let accelMag = Universe.getGravitationalConstant() * otherBody.mass / distSq;
                if(accelMag > this.maxAccel && accelMag > 4) {
                    console.log("distSq=" + distSq + ", accelMag=" + accelMag)
                    this.maxAccel = accelMag;
                }
                let acceleration = forceDir.scale(accelMag * timestep);
                this.velocity.add(acceleration);
                this.accelerationsDisplay.push(acceleration);
            }
        }
        
        updatePosition(timestep) {
            // update position
            this.position.add(this.velocity.copy().scale(timestep));
        }
    };
})();