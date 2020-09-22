let canvas;
let currentWorld;

function setup() {
    createCanvas(1000, 800);
    Input.setup();
    console.log("Setup complete!");
}

function draw() {
    Graphics.draw();
}

$(document).ready(function() {
    console.log("Ready!");
});