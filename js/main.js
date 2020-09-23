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
        universe.add(new Planetoid(10000, center.copy(), Vector.of(0.5, 0), 50, "blue"));
        universe.add(new Planetoid(10, center.copy().add(Vector.of(0, -100)), Vector.of(10, 0), 15, "red"));
        cameraFollow(universe.allBodies[0]);
    },
    
    function() {
        
    }
);

let ThreeBodyScenario = new Scenario(
    function () {
        let center = Vector.of(width / 2, height / 2);
        universe = new Universe();
        universe.add(new Planetoid(10000, center.copy(), Vector.of(0.1, 0), 50, "blue"));
        universe.add(new Planetoid(10, center.copy().add(Vector.of(0, -100)), Vector.of(10, 0), 15, "red"));
        universe.add(new Planetoid(5000, center.copy().add(Vector.of(0, 200)), Vector.of(10, 0), 30, "gray"));
        cameraFollow(universe.allBodies[0]);
    },

    function() {
        
    }
);

let ThreeBodySolution = new Scenario(
    function () {
        let center = Vector.of(width / 2, height / 2);
        universe = new Universe();
        let posScale = 1;
        let radius = 20;
        let mass = 1;
        universe.add(new Planetoid(mass, center.copy().add(Vector.of(-0.97000436, 0.24308753).scale(posScale)), Vector.of(0.4662036850, 0.4323657300), radius, "blue"));
        universe.add(new Planetoid(mass, center.copy().add(Vector.of(0.97000436, -0.24308753).scale(posScale)), Vector.of(0.4662036850, 0.4323657300), radius, "red"));
        universe.add(new Planetoid(mass, center.copy().add(Vector.of(0, 0)), Vector.of(-0.93240737, -0.86473146), radius, "gray"));
        //cameraFollow(universe.allBodies[2]);
    },

    function () {

    }
);

function setup() {
    setScenario(TwoBodyScenario);
    cameraFollow(universe.allBodies[0]);
    canvas = createCanvas();
    resetCanvas();
    
    Input.setup();
    console.log("Setup complete!");
}

function resetCanvas() {
    const windowWidthRatio = 0.6;
    const windowHeightRatio = 0.8;
    canvas = resizeCanvas(window.innerWidth * windowWidthRatio, window.innerHeight * windowHeightRatio)
}

function windowResized() {
    resetCanvas();    
}

function setScenario(scene) {
    currentScenario = scene;
    scene.onStart();
}

function cameraFollow(obj) {
    if(!obj) {
        cameraTarget = Vector.of(0, 0);
        return;
    }
    cameraTarget = obj;
}

function getCameraAnchor(centerPoint) {
    return Vector.of(-centerPoint.x + width / 2, -centerPoint.y + height / 2);
}

function draw() {
    universe.update(.5);
    
    currentScenario.onUpdate();
    
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});