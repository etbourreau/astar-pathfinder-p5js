class Pathfinder {
    constructor() {
        this.allowDiagonals = true;
    }

    findRoute(gridOrigin, playerOrigin, targetOrigin) {
        const grid = this.initGrid(gridOrigin),
            target = this.initTarget(targetOrigin);

        const obstacles = this.extractObstacles(grid),
            openList = [this.initPlayer(playerOrigin, target)],
            closedList = [];

        while (openList.length > 0) {
            // grab lowest cost neighbor
            let lowIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < openList[lowIndex].f) {
                    lowIndex = i;
                }
            }
            const cell = openList[lowIndex];

            // End case -- result has been found, return the traced path
            if (cell.x === target.x && cell.y === target.y) {
                let curr = cell;
                const ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.splice(lowIndex, 1);
            closedList.push(cell);
            const neighbors = this.getNeighbors(cell, grid, obstacles);

            neighbors.forEach(neighbor => {
                if (
                    !closedList.find(
                        el => el.x === neighbor.x && el.y === neighbor.y
                    )
                ) {
                    // g score is the shortest distance from start to current node, we need to check if
                    //   the path we have arrived at this neighbor is the shortest one we have seen yet
                    const gScore = cell.g + this.getCellScore(cell); // 1 is the distance from a node to it's neighbor
                    let gScoreIsBest = false;

                    if (
                        !openList.find(
                            el => el.x === neighbor.x && el.y === neighbor.y
                        )
                    ) {
                        // This the the first time we have arrived at this node, it must be the best
                        // Also, we need to take the h (heuristic) score since we haven't done so yet
                        gScoreIsBest = true;
                        neighbor.h = this.heuristic(
                            neighbor.x,
                            neighbor.y,
                            target.x,
                            target.y
                        );
                        openList.push(neighbor);
                    } else if (gScore < neighbor.g) {
                        // We have already seen the node, but last time it had a worse g (distance from start)
                        gScoreIsBest = true;
                    }

                    if (gScoreIsBest) {
                        // Found an optimal (so far) path to this node.   Store info on how we got here and
                        //  just how good it really is...
                        neighbor.parent = cell;
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
                    }
                }
            });
        }
        return;
    }

    initGrid(gridOrigin) {
        const grid = [];
        gridOrigin.forEach(row => {
            const newRow = [];
            row.forEach(cell => {
                const newCell = new Cell(cell.y, cell.x);
                newCell.speed = cell.speed;
                newCell.canPassThrough = cell.canPassThrough;
                newRow.push(newCell);
            });
            grid.push(newRow);
        });
        return grid;
    }

    initPlayer(playerOrigin, target) {
        const player = new Cell(playerOrigin.y, playerOrigin.x);
        player.f = 0;
        player.g = 0;
        player.h = this.heuristic(player.x, player.y, target.x, target.y);
        return player;
    }

    initTarget(targetOrigin) {
        const target = new Cell(targetOrigin.y, targetOrigin.x);
        target.speed = targetOrigin.speed;
        return target;
    }

    extractObstacles(grid) {
        const obstacles = [];
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.isObstacle()) {
                    obstacles.push(cell);
                }
            });
        });
        return obstacles;
    }

    getNeighbors(cell, grid, obstacles) {
        const neighbors = [];

        let top = false,
            left = false,
            right = false,
            bottom = false;

        // top
        if (
            cell.y - 1 >= 0 &&
            obstacles.indexOf(grid[cell.y - 1][cell.x]) === -1
        ) {
            top = true;
            neighbors.push(grid[cell.y - 1][cell.x]);
        }
        // left
        if (
            cell.x - 1 >= 0 &&
            obstacles.indexOf(grid[cell.y][cell.x - 1]) === -1
        ) {
            left = true;
            neighbors.push(grid[cell.y][cell.x - 1]);
        }
        // right
        if (
            cell.x + 1 < grid[cell.y].length &&
            obstacles.indexOf(grid[cell.y][cell.x + 1]) === -1
        ) {
            right = true;
            neighbors.push(grid[cell.y][cell.x + 1]);
        }
        // bottom
        if (
            cell.y + 1 < grid.length &&
            obstacles.indexOf(grid[cell.y + 1][cell.x]) === -1
        ) {
            bottom = true;
            neighbors.push(grid[cell.y + 1][cell.x]);
        }

        // diagonals
        if (this.allowDiagonals) {
            // top left
            if (
                top &&
                left &&
                obstacles.indexOf(grid[cell.y - 1][cell.x - 1]) === -1
            ) {
                neighbors.push(grid[cell.y - 1][cell.x - 1]);
            }
            // top right
            if (
                top &&
                right &&
                obstacles.indexOf(grid[cell.y - 1][cell.x + 1]) === -1
            ) {
                neighbors.push(grid[cell.y - 1][cell.x + 1]);
            }
            // bottom left
            if (
                bottom &&
                left &&
                obstacles.indexOf(grid[cell.y + 1][cell.x - 1]) === -1
            ) {
                neighbors.push(grid[cell.y + 1][cell.x - 1]);
            }
            // bottom right
            if (
                bottom &&
                right &&
                obstacles.indexOf(grid[cell.y + 1][cell.x + 1]) === -1
            ) {
                neighbors.push(grid[cell.y + 1][cell.x + 1]);
            }
        }

        return neighbors;
    }

    getCellScore(cell) {
        return 1 / cell.speed;
    }

    heuristic(x1, y1, x2, y2) {
        return dist(x1, y1, x2, y2);
    }
}
