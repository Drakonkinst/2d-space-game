let canvas;
let universe;

function setup() {
    canvas = createCanvas(1000, 800);
    universe = new Universe();
    universe.add(new Planetoid(100000, Vector.of(width / 2, height / 2), Vector.of(0, 0), 50, "blue"));
    universe.add(new Planetoid(2, Vector.of(width / 2, height / 2 - 100), Vector.of(3, 0), 15, "red"));
    
    Input.setup();
    console.log("Setup complete!");
}

function draw() {
    universe.update(1);
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});