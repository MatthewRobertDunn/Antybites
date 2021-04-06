import { loadGtlf } from './loader.js'
import { Pheromone } from './pheromone.js';

const zero = new THREE.Vector2(0, 0);
export class Ant {
    constructor(world, facing = new THREE.Vector2(0, 1), position = new THREE.Vector2(0, 0)) {
        this.position = position;
        this.world = world;
        this.facing = facing;
        this.facing.normalize();
        this.pheromoneTimer = 0;
    }

    async create() {
        var mesh = await loadGtlf("./res/ant.glb");
        mesh.scale.set(0.2, 0.2, 0.2);
        this.mesh = mesh;
        return;
    }


    tick(delta) {
        this.position.add(this.facing.clone().multiplyScalar(delta * 10.0));
        this.facing.rotateAround(zero, (Math.random() - 0.5) * 0.3).normalize();
        this.wallBounce();
        this.pheromoneTimer += delta;
        if (this.pheromoneTimer >= 0.2) {
            const newPheromone = new Pheromone(this.world, this.facing, this.position);
            this.world.add(newPheromone);
            this.pheromoneTimer = 0;
        }

        let sensorSpot = this.position.clone().add(this.facing.clone().multiplyScalar(4.0));

        let pheromones = this.world.grid.getInRange(sensorSpot, 2.0);
        if (pheromones.length > 0) {
            let p = pheromones[Math.floor(Math.random() * pheromones.length)];
            this.facing = p.position.clone().sub(this.position).normalize();
        }

        this.mesh.position.set(this.position.x, this.position.y, 0);
    }


    wallBounce() {
        if (this.position.x < this.world.left) {
            this.position.setX(this.world.left);
            this.facing.multiply(new THREE.Vector2(-1, 0));
        }

        if (this.position.x > this.world.right) {
            this.position.setX(this.world.right);
            this.facing.multiply(new THREE.Vector2(-1, 0));
        }

        if (this.position.y > this.world.top) {
            this.position.setY(this.world.top);
            this.facing.multiply(new THREE.Vector2(0, -1));
        }


        if (this.position.y < this.world.bottom) {
            this.position.setY(this.world.bottom);
            this.facing.multiply(new THREE.Vector2(0, -1));
        }

    }

    createMesh() {
        const geometry = new THREE.PlaneGeometry(0.5, 1.5, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material)
    }


}