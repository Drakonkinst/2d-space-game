const Planetoid = (function() {
    return class Planetoid extends CelestialBody {
        constructor(mass, position, initialVelocity, radius, color) {
            super(mass, position, initialVelocity);
            this.radius = radius;
            this.color = color;
        }
    };
})();