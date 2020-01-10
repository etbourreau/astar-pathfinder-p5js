let APP;

function setup() {
    const minSize = min(windowWidth, windowHeight) - 50;
    createCanvas(minSize, minSize);
    APP = new App(floor(minSize / 20));
}

function draw() {
    background(255);

    APP.draw();

    stroke(0);
    strokeWeight(1);
    line(0, 0, width, 0);
    line(width, 0, width, height);
    line(width, height, 0, height);
    line(0, height, 0, 0);
}

Number.prototype.isBetween = function(a, b) {
    const minRange = Math.min(a, b);
    const maxRange = Math.max(a, b);
    return this >= minRange && this <= maxRange;
};

function mousePressed() {
    if (mouseX.isBetween(0, width) && mouseY.isBetween(0, height)) {
        APP.switchObstacle(mouseX, mouseY);
    }
}
