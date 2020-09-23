let canvas;
let universe;
let cameraTarget;

function setup() {
    canvas = createCanvas(1000, 800);
    cameraTarget = Vector.of(0, 0);
    universe = new Universe();
    universe.add(new Planetoid(100000, Vector.of(width / 2, height / 2), Vector.of(0.1, 0), 50, "blue"));
    universe.add(new Planetoid(100, Vector.of(width / 2, height / 2 - 100), Vector.of(3, 0), 15, "red"));
    
    Input.setup();
    console.log("Setup complete!");
}

function cameraFollow(vector) {
    cameraTarget = Vector.of(-vector.x + width / 2, -vector.y + height / 2);
}

function draw() {
    cameraFollow(universe.allBodies[0].position);
    universe.update(1);
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});