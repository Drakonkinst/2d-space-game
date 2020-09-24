const CelestialBody = (function() {
    return class CelestialBody {
        constructor(name, mass, position, initialVelocity) {
            this.name = name;
            this.id = uuidv4();
            this.universe = universe;
            this.mass = mass;
            this.position = position.copy().add(center);
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
                let accelMag = universe.getGravitationalConstant() * otherBody.mass / distSq;
                let acceleration = forceDir.scale(accelMag * timestep);
                this.velocity.add(acceleration);
                this.accelerationsDisplay.push(acceleration);
                
                if(accelMag > this.maxAccel && accelMag > 4) {
                    this.maxAccel = accelMag;
                }
            }
        }
        
        updatePosition(timestep) {
            // update position
            this.position.add(this.velocity.copy().scale(timestep));
        }
    };
})();

const VirtualBody = (function () {
    return class VirtualBody {
        constructor(body) {
            this.host = body;
            this.position = body.position.copy();
            this.velocity = body.velocity.copy();
            this.mass = body.mass;
        }
        
        updateVelocity(allBodies, timestep) {
            for(let otherBody of allBodies) {
                if(otherBody == this) {
                    continue;
                }
                
                let distSq = otherBody.position.distanceSquared(this.position);
                let forceDir = otherBody.position.copy().subtract(this.position).normalize();
                let accelMag = universe.getGravitationalConstant() * otherBody.mass / distSq;
                let acceleration = forceDir.scale(accelMag * timestep);
                this.velocity.add(acceleration);
            }
        }
        
        updatePosition(timestep) {
            this.position.add(this.velocity.copy().scale(timestep));
        }
    }
})();