const Planetoid = (function() {
    return class Planetoid extends CelestialBody {
        constructor(name, surfaceGravity, position, initialVelocity, radius, color) {
            super(name, surfaceGravity * radius * radius / Universe.getGravitationalConstant(), position, initialVelocity);
            this.radius = radius;
            this.color = color;
        }
    };
})();