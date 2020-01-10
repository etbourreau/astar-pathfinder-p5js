const TERRAIN_PATCHES = [
    {
        pos: "createVector(this.length / 2, this.length * .05)",
        radius: "this.length / 4",
        value: SETTINGS.MAX_SPEED,
        label: "Fast",
        labelColor: 0
    },
    {
        pos: "createVector(this.length / 2.3, this.length / 1.5)",
        radius: "this.length / 2.2",
        value: SETTINGS.MIN_SPEED,
        label: "Slow",
        labelColor: 255
    },
    {
        pos: "createVector(this.length * .95, this.length / 1.5)",
        radius: "this.length / 10",
        value: 0,
        label: "WALL",
        labelColor: 255
    }
];

class App {
    constructor(length) {
        this.length = length;
        this.grid = this.generateGrid(length);
        this.player = new Player(length);
        this.target = new Target(length);

        this.pathfinder = new Pathfinder();
    }

    generateGrid(nb) {
        const grid = [];
        for (let row = 0; row < nb; row++) {
            const currentRow = [];
            for (let col = 0; col < nb; col++) {
                currentRow.push(new Cell(row, col));
            }
            grid.push(currentRow);
        }
        return this.generateSpeeds(grid);
    }

    generateSpeeds(grid) {
        grid.forEach(row => {
            row.forEach(cell => {
                TERRAIN_PATCHES.forEach(patch => {
                    const pos = eval(patch.pos);
                    const radius = eval(patch.radius);
                    if (
                        !cell.isObstacle() &&
                        dist(cell.x, cell.y, pos.x, pos.y) < radius
                    ) {
                        if (patch.value === 0) {
                            cell.setObstacle(true);
                        } else {
                            cell.setSpeed(patch.value);
                        }
                    }
                });
            });
        });
        return grid;
    }

    switchObstacle(originX, originY) {
        const cellWidth = width / this.length,
            cellHeight = height / this.length;
        const x = floor(originX / cellWidth),
            y = floor(originY / cellHeight);
        const cell = this.grid[y][x];
        cell.setObstacle(!cell.isObstacle());
    }

    draw() {
        const cellWidth = width / this.length,
            cellHeight = height / this.length;

        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.draw(cellWidth, cellHeight);
            });
        });

        this.player.draw(cellWidth, cellHeight);
        this.target.draw(cellWidth, cellHeight);

        stroke(0);
        strokeWeight(1);
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.x < this.length - 1) {
                    const x = cell.x * cellWidth + cellWidth;
                    const y = cell.y * cellHeight;
                    line(x, y, x, y + cellHeight);
                }
                if (cell.y < this.length - 1) {
                    const x = cell.x * cellWidth;
                    const y = cell.y * cellHeight + cellHeight;
                    line(x, y, x + cellWidth, y);
                }
            });
        });

        if (!!this.route) {
            // draw route
            stroke("orange");
            strokeWeight(3);
            this.route.forEach(cell => {
                line(
                    cell.x * cellWidth + cellWidth / 2,
                    cell.y * cellHeight + cellHeight / 2,
                    cell.parent.x * cellWidth + cellWidth / 2,
                    cell.parent.y * cellHeight + cellHeight / 2
                );
            });
        }

        textAlign(CENTER, CENTER);
        noStroke();
        TERRAIN_PATCHES.forEach(patch => {
            if (patch.value > 0) {
                const pos = eval(patch.pos);
                const radius = eval(patch.radius);
                fill(patch.labelColor);
                textSize(radius * 4);
                text(
                    patch.label + " x" + patch.value,
                    pos.x * cellWidth + cellWidth / 2,
                    pos.y * cellHeight + cellHeight / 2
                );
            }
        });
    }

    findRoute() {
        this.route = this.pathfinder.findRoute(
            this.grid,
            this.player,
            this.target
        );
    }
}
