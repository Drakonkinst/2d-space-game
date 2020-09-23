let canvas;
let center;
let currentScenario;
let universe;
let cameraTarget;

let defaultUpdatesPerTick = Config.updatesPerTick;
let defaultTimestep = Config.timestep;

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
        universe.add(new Planetoid("Blue", 15.0, center.copy(), Vector.of(0.5, 0), 50, "blue"));
        universe.add(new Planetoid("Red", 1.0, center.copy().add(Vector.of(0, -110)), Vector.of(20, 0), 15, "red"));
        cameraFollow(universe.allBodies[0]);
    },
    
    function() {
        
    }
);

let ThreeBodyScenario = new Scenario(
    function() {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 15.0, center.copy(), Vector.of(0.5, 0), 50, "blue"));
        universe.add(new Planetoid("Red", 1.0, center.copy().add(Vector.of(0, -150)), Vector.of(-15, 0), 15, "red"));
        universe.add(new Planetoid("Gray", 1.0, center.copy().add(Vector.of(0, 200)), Vector.of(15, 0), 20, "gray"));
        cameraFollow(universe.allBodies[0]);
    },

    function() {
        
    }
);

/*
let ThreeBodySolution = new Scenario(
    function() {
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
);*/

let SolarSystem = new Scenario(
    function() {
        let center = Vector.of(width / 2, height / 2);
        universe = new Universe();
        universe.add(new Planetoid("Sun", 28, center.copy(), Vector.of(1, 0), 70, "#FDB813"));
        universe.add(new Planetoid("Earth", 1, center.copy().add(Vector.of(120, 0)), Vector.of(0, 35), 15, "green"));
        universe.add(new Planetoid("Mars", 1, center.copy().add(Vector.of(180, 0)), Vector.of(0, 30), 20, "red"));
        cameraFollow(universe.allBodies[0]);
    },
    
    function() {
        
    }
);

function setup() {
    setScenario(TwoBodyScenario);
    cameraFollow(universe.allBodies[0]);
    canvas = createCanvas();
    resetCanvas();
    recalcluateCenter();
    
    Input.setup();
    console.log("Setup complete!");
}

function resetCanvas() {
    const windowWidthRatio = 0.6;
    const windowHeightRatio = 0.8;
    canvas = resizeCanvas(window.innerWidth * windowWidthRatio, window.innerHeight * windowHeightRatio);
    recalcluateCenter();
}

function windowResized() {
    resetCanvas();    
}

function setScenario(scene) {
    currentScenario = scene;
    
    // reset some stuff
    Config.updatesPerTick = defaultUpdatesPerTick;
    Config.timestep = defaultTimestep;

    scene.onStart();
    Input.createCameraFollowOptions();
}

function cameraFollow(obj) {
    if(!obj) {
        cameraTarget = Vector.of(0, 0);
        return;
    }
    cameraTarget = obj;
}

function recalcluateCenter() {
    center = Vector.of(width / 2, height / 2);
}

function draw() {
    for(let i = 0; i < Config.updatesPerTick; i++) {
        universe.update(Config.timestep);
    }
    
    currentScenario.onUpdate();
    Input.update();
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});