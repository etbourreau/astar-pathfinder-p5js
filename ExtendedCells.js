class Player extends Cell {
    constructor(length) {
        super(length - 1, length - 1);
    }

    getColor() {
        return "red";
    }
}

class Target extends Cell {
    constructor(length) {
        super(0, 0);
    }

    getColor() {
        return "green";
    }
}
