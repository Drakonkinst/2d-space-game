const Universe = (function() {
    const GRAVITATIONAL_CONSTANT = 1;
    
    // actual gravitational constant
    //const GRAVITATIONAL_CONSTANT = 6.67408e-11;
    return class Universe {
        getGravitationalConstant() {
            return this.G;
        }
        
        constructor() {
            this.allBodies = [];
            this.G = GRAVITATIONAL_CONSTANT;
        }
        
        add(celestialBody) {
            this.allBodies.push(celestialBody);
            return celestialBody;
        }
        
        update(timestep) {
            if(Config.isStopped) {
                return;
            }
            
            for(let celestialBody of this.allBodies) {
                celestialBody.updateVelocity(this.allBodies, timestep);
            }
            
            for(let celestialBody of this.allBodies) {
                celestialBody.updatePosition(timestep);
            }
        }
    };
})();