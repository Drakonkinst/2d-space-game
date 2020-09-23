const Planetoid = (function() {
    return class Planetoid extends CelestialBody {
        constructor(name, surfaceGravity, position, initialVelocity, radius, color) {
            super(name, surfaceGravity * radius * radius / universe.getGravitationalConstant(), position, initialVelocity);
            this.radius = radius;
            this.color = color;
        }
        
        pointOnPlanetoid(vector) {
            return vector.distanceSquared(this.position) < this.radius * this.radius;
        }
    };
})();