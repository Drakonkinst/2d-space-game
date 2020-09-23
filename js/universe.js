const Universe = (function() {
    const GRAVITATIONAL_CONSTANT = 0.01; //6.67408e-11;
    return class Universe {
        static getGravitationalConstant() {
            return GRAVITATIONAL_CONSTANT;
        }
        
        constructor() {
            this.allBodies = [];
        }
        
        add(celestialBody) {
            this.allBodies.push(celestialBody);
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