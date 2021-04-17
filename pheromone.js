export class Pheromone {
    constructor (world, facing = new THREE.Vector2(0,1), position = new THREE.Vector2(0,0)){
        this.position = position.clone();
        this.world = world;
        this.facing = facing.clone();
        this.facing.normalize();
        this.includeInGrid = true;
    }
}
