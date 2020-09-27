let canvas;
let center;
let universe;
let cameraTarget;
let pathAnchor = null;

let defaultUpdatesPerTick = Config.updatesPerTick;
let defaultTimestep = Config.timestep;

/* SCENARIOS */

ScenarioManager.addScenario("2-Body: Large Central Mass",
    function () {
        universe = new Universe();
        let Blue = universe.add(new Planetoid("Blue", 15.0, Vector.of(0, 0), Vector.of(2, 0), 50, "blue"));
        let Red = universe.add(new Planetoid("Red", 1.0, Vector.of(0, -110), Vector.of(20, 0), 15, "red"));
        cameraFollow(Blue);
        //pathAnchor = Blue;
    }
);

ScenarioManager.addScenario("2-Body: Equal Mass",
    function() {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 1.0, Vector.of(0, 0), Vector.of(0.5, 0), 30, "blue"));
        universe.add(new Planetoid("Red", 1.0, Vector.of(0, -110), Vector.of(5, 0), 30, "red"));
        cameraFollow(universe.allBodies[0]);
    }
);

ScenarioManager.addScenario("3-Body: Large Central Mass",
    function() {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 15.0, Vector.of(0, 0), Vector.of(0.5, 0), 50, "blue"));
        universe.add(new Planetoid("Red", 1.0, Vector.of(0, -150), Vector.of(16.2, 0), 15, "red"));
        universe.add(new Planetoid("Gray", 1.0, Vector.of(0, 200), Vector.of(14.6, 0), 20, "gray"));
        cameraFollow(universe.allBodies[0]);
    }
);

ScenarioManager.addScenario("3-Body: Large Central Mass 2",
    function () {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 15.0, Vector.of(0, 0), Vector.of(1, 0), 50, "blue"));
        universe.add(new Planetoid("Red", 1.0, Vector.of(0, 200), Vector.of(14.7, 0), 20, "red"));
        universe.add(new Planetoid("Gray", 1.0, Vector.of(0, -200), Vector.of(-12.7, 0), 20, "gray"));
        cameraFollow(universe.allBodies[0]);
    }
);

ScenarioManager.addScenario("3-Body: Unequal Mass",
    function() {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 5.0, Vector.of(0, 0), Vector.of(0.5, 0), 30, "blue"));
        universe.add(new Planetoid("Red", 1.0, Vector.of(0, -70), Vector.of(-8, 0), 15, "red"));
        universe.add(new Planetoid("Gray", 1.0, Vector.of(0, 120), Vector.of(8, 0), 20, "gray"));
        cameraFollow(universe.allBodies[0]);
    }
);


ScenarioManager.addScenario("3-Body: Equal Mass",
    function() {
        universe = new Universe();
        universe.add(new Planetoid("Blue", 1.0, Vector.of(0, 0), Vector.of(2, 2), 30, "blue"));
        universe.add(new Planetoid("Red", 1.0, Vector.of(-100, -100), Vector.of(5, 0), 30, "red"));
        universe.add(new Planetoid("Gray", 1.0, Vector.of(100, 100), Vector.of(5, 0), 30, "gray"));
        cameraFollow(universe.allBodies[0]);
    }
);

ScenarioManager.addScenario("3-Body: Solution",
    function() {
        universe = new Universe();
        universe.G = 1;
        let posScale = 1;
        let radius = 1;
        let surfaceGravity = 1;

        let Blue = new Planetoid("Blue", surfaceGravity, Vector.of(-0.97000436, 0.24308753).scale(posScale), Vector.of(0.4662036850, 0.4323657300), radius, "blue");
        let Red = new Planetoid("Red", surfaceGravity, Vector.of(0.97000436, -0.24308753).scale(posScale), Vector.of(0.4662036850, 0.4323657300), radius, "red");
        let Gray = new Planetoid("Gray", surfaceGravity, Vector.of(0, 0), Vector.of(-0.93240737, -0.86473146), radius, "gray");

        let displayRadius = .1;
        Blue.radius = displayRadius;
        Red.radius = displayRadius;
        Gray.radius = displayRadius;

        universe.add(Blue);
        universe.add(Red);
        universe.add(Gray);
        cameraFollow(center);
        Graphics.setZoom(200);
        Config.updatesPerTick = 1;
        Config.timestep = 0.02;
    }, null,
    "For information on how/why this works, see the paper by Chenciner & Montgomery (2000) on the 3-body problem. (can be found from Wikipedia)"
);

ScenarioManager.addScenario("Solar System (WIP)",
    function() {
        universe = new Universe();
        let Sun = universe.add(new Planetoid("Sun", 20, Vector.of(0, 0), Vector.of(0, 0), 40, "#FDB813"));
        let Earth = universe.add(new Planetoid("Earth", 10, Vector.of(130, 0), Vector.of(0, 16.1), 15, "green"));
        let Moon = universe.add(new Planetoid("Moon", 1, Vector.of(153, 0), Vector.of(0, 5.9), 4, "gray"))
        let Mars = universe.add(new Planetoid("Mars", 8, Vector.of(300, 0), Vector.of(0, 12.0), 12, "red"));
        let Phobos = universe.add(new Planetoid("Phobos", 0.5, Vector.of(317, 0), Vector.of(0, 3.7), 3, "white"));
        let Deimos = universe.add(new Planetoid("Deimos", 0.5, Vector.of(325, 0), Vector.of(0, 4.95), 2, "pink"));
        
        cameraFollow(Sun);
        pathAnchor = Sun;
    }
);

ScenarioManager.addScenario("Solar System 2 (WIP)",
    function () {
        universe = new Universe();
        universe.G = 1.2;
        let Sun = universe.add(new Planetoid("Sun", 20, Vector.of(0, 0), Vector.of(0, 0), 40, "#FDB813"));
        let Earth = universe.add(new Planetoid("Earth", 10, Vector.of(100, 0), Vector.of(0, 18.5), 15, "green"));
        let Moon = universe.add(new Planetoid("Moon", 1, Vector.of(118, 0), Vector.of(0, 6.8), 2, "gray"))
        let Mars = universe.add(new Planetoid("Mars", 8, Vector.of(200, 0), Vector.of(0, 15.2), 12, "red"));
        //let Phobos = universe.add(new Planetoid("Phobos", 0.5, Vector.of(317, 0), Vector.of(0, 3.7), 3, "white"));
        //let Deimos = universe.add(new Planetoid("Deimos", 0.5, Vector.of(325, 0), Vector.of(0, 4.95), 2, "pink"));

        cameraFollow(Sun);
        pathAnchor = Sun;
        
    }
);

ScenarioManager.addScenario("Chaos",
    function() {
        universe = new Universe();
        recalcluateCenter();
        
        let howMany = 50;
        let minRadius = 5;
        let maxRadius = 50;
        let maxVelocity = 0.1;
        let minVelocity = -maxVelocity;
        let maxPosX = (width / 2) * .9;
        let maxPosY = (height / 2) * .9;
        let minPosX = -maxPosX;
        let minPosY = -maxPosY;
        let surfaceGravity = 1;
        
        for(let i = 0; i < howMany; i++) {
            let c = color(randInt(0, 255), randInt(0, 255), randInt(0, 255));
            let velocity = Vector.of(randNum(minVelocity, maxVelocity));
            let pos = Vector.of(randNum(minPosX, maxPosX), randNum(minPosY, maxPosY));
            let radius = randNum(minRadius, maxRadius);
            universe.add(new Planetoid("Body " + (i + 1), surfaceGravity, pos, velocity, radius, c));
        }
        
        cameraFollow(null);
    }, null,
    "Some people just want to watch the universe burn."
);

/* SETUP AND DRAW */
function setup() {
    recalcluateCenter();
    ScenarioManager.setScenario("2-Body: Large Central Mass");
    canvas = createCanvas();
    resetCanvas();
    Input.setup();
    
    console.log("Setup complete!");
}

function draw() {
    for(let i = 0; i < Config.updatesPerTick; i++) {
        universe.update(Config.timestep);
    }

    ScenarioManager.getCurrentScenario().onUpdate();
    Input.update();
    Graphics.draw();
}

/* CANVAS */
function resetCanvas() {
    let windowWidthRatio = 0.6;
    let windowHeightRatio = 0.8;
    
    if(Config.fullScreen) {
        windowWidthRatio = 1.0;
        windowHeightRatio = 1.0;
    }
    canvas = resizeCanvas(window.innerWidth * windowWidthRatio, window.innerHeight * windowHeightRatio);
    recalcluateCenter();
}

function windowResized() {
    resetCanvas();    
}

/* CAMERA */
function cameraFollow(obj) {
    if(!obj) {
        cameraTarget = center;
        return;
    }
    cameraTarget = obj;
}

function recalcluateCenter() {
    center = Vector.of(width / 2, height / 2);
}