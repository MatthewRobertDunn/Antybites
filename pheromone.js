const geometry = new THREE.PlaneGeometry(0.2, 1.5, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xaa0000 });

export class Pheromone {
    constructor (world, facing = new THREE.Vector2(0,1), position = new THREE.Vector2(0,0)){
        this.position = position.clone();
        this.world = world;
        this.facing = facing.clone();
        this.facing.normalize();
        this.includeInGrid = true;
        this.age = 20.0 + Math.random();
        this.isStatic = true;
    }

    async create(){
    }

    delete() {
    }

    /*
    tick(delta){
        this.age -= delta;
        if(this.age <= 0){
            this.world.remove(this);
        }
    } 
    */

    createMesh(){
        const mesh =  new THREE.Mesh(geometry, material);
        return mesh;
    }
}
