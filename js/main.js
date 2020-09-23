let canvas;
let currentScenario;
let universe;
let cameraTarget;

const Scenario = (function() {
    return class Scenario {
        constructor(onStart, onUpdate) {
            this.onStart = onStart;
            this.onUpdate = onUpdate;
        }
    };
})();

let TwoBodyScenario = new Scenario(
    function() {
        let center = Vector.of(width / 2, height / 2);
        universe = new Universe();
        universe.add(new Planetoid(100000, center.copy(), Vector.of(0.1, 0), 50, "blue"));
        universe.add(new Planetoid(100, center.copy().add(Vector.of(0, -100)), Vector.of(3, 0), 15, "red"));
    },
    
    function() {
        cameraFollow(universe.allBodies[0].position);
    }
);

let ThreeBodyScenario = new Scenario(
    function () {
        let center = Vector.of(width / 2, height / 2);
        universe = new Universe();
        universe.add(new Planetoid(100000, center.copy(), Vector.of(0.1, 0), 50, "blue"));
        universe.add(new Planetoid(100, center.copy().add(Vector.of(0, -100)), Vector.of(3, 0), 15, "red"));
        universe.add(new Planetoid(50000, center.copy().add(Vector.of(0, 200)), Vector.of(3, 0), 30, "gray"));
    },

    function() {
        cameraFollow(universe.allBodies[0].position);
    }
);

function setup() {
    canvas = createCanvas(1000, 800);
    setScenario(TwoBodyScenario);
    
    Input.setup();
    console.log("Setup complete!");
}

function setScenario(scene) {
    currentScenario = scene;
    cameraTarget = Vector.of(0, 0);
    scene.onStart();
}

function cameraFollow(vector) {
    cameraTarget = Vector.of(-vector.x + width / 2, -vector.y + height / 2);
}

function draw() {
    universe.update(1);
    
    currentScenario.onUpdate();
    
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});