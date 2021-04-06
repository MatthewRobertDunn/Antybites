import { arrayRemove } from "./arrays.js";

const surroundingSquares = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0, 1),
    new THREE.Vector2(0, -1),
    new THREE.Vector2(1, 1),
    new THREE.Vector2(-1, -1),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(-1, 0),
    new THREE.Vector2(-1, 1),
    new THREE.Vector2(1, -1),
]

export class Grid {

    constructor(topLeft, bottomRight, gridSize = 1) {
        this.left = topLeft.x;
        this.top = topLeft.y;
        this.bottom = bottomRight.y;
        this.right = bottomRight.x;
        this.gridSize = gridSize;
        this.grid = [];
    }

    add(entity) {
        this._checkBounds(entity);

        let index = this.getIndexFor(entity.position);

        if (this.grid[index.x] == null) {
            this.grid[index.x] = [];
        }

        if (this.grid[index.x][index.y] == null) {
            this.grid[index.x][index.y] = [];
        }
        this.grid[index.x][index.y].push(entity);
    }

    remove(entity) {
        this._checkBounds(entity);
        let index = this.getIndexFor(entity.position);
        let cell = this.getCellAt(index);
        arrayRemove(cell, entity);
    }

    getInRange(position, range) {
        let index = this.getIndexFor(position);
        let results = [];

        for (let c of surroundingSquares) {
            let newIndex = index.clone().add(c);
            let newItems = this.getCellAt(newIndex)
                .filter(entity => entity.position.distanceTo(position) <= range);
            results.push(...newItems);
        }

        return results;
    }

    getIndexFor(position) {
        let x = Math.floor((position.x - this.left) / this.gridSize);
        let y = Math.floor((position.y - this.bottom) / this.gridSize);
        return new THREE.Vector2(x, y);
    }

    getCellAt(index) {
        let x = Math.floor(index.x);
        let y = Math.floor(index.y);

        if (x < 0 || y < 0) {
            return [];
        }

        if (this.grid[x] == null) {
            return [];
        }

        if (this.grid[x][y] == null) {
            return [];
        }

        return this.grid[x][y];
    }


    _checkBounds(entity) {
        if (entity.position.x < this.left || entity.position.x > this.right) {
            console.log("Out of bounds");
            console.log(entity);
            return;
        }

        if (entity.position.y > this.top || entity.position.y < this.bottom) {
            console.log("Out of bounds");
            console.log(entity);
            return;
        }
    }
}
