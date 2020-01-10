const SETTINGS = {
    DEFAULT_SPEED: 1,
    MIN_SPEED: 0.25,
    MAX_SPEED: 1.5
};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

class Cell {
    constructor(y, x) {
        this.x = x;
        this.y = y;
        this.speed = SETTINGS.DEFAULT_SPEED;
        this.canPassThrough = true;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    isObstacle() {
        return !this.canPassThrough;
    }

    setObstacle(value) {
        this.canPassThrough = !value;
    }

    getColor() {
        return this.isObstacle() ? 0 : map(this.speed, SETTINGS.MIN_SPEED, SETTINGS.MAX_SPEED, 50, 255);
    }

    draw(cellWidth, cellHeight) {
        noStroke();
        fill(this.getColor());
        const x = this.x * cellWidth;
        const y = this.y * cellHeight;
        rect(x, y, x + cellWidth, y + cellHeight);
    }
}
