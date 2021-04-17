import { Pheromone } from './pheromone.js'
import { loadTexture, load } from './loader.js'

const uniforms = {
    time: { type: "f", value: 0.0 },
};

let texture = null;

//Class of trailLength pheromones rendered using a single instanced mesh
export class Trail {

    constructor(world, color) {
        this.trailLength = 60;
        this.count = 0;
        this.dummy = new THREE.Object3D();  //use a dummy object to calculate the world transform matrix
        this.dummy.updateMatrix();
        this.pheremones = [];
        this.world = world;
        this.color = color;
        this.gameTime = 0.0;
        this.trailsCreatedTime = new Float32Array(this.trailLength);
    }

    async create() {
        const material = await load("trailMaterial", async function () {
            const texture = await loadTexture('./res/trail.png');
            uniforms.texture1 =  { type: "t", value: texture };
            return new THREE.ShaderMaterial({
                transparent: true,
                uniforms: uniforms,
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent
            })
        });

        //this.instanceGeometry = new THREE.InstancedBufferGeometry().copy(this.geometry);
        this.instanceGeometry = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(0.5, 0.5));
        this.trailsAttribute = new THREE.InstancedBufferAttribute(this.trailsCreatedTime, 1);
        this.instanceGeometry.setAttribute("created", this.trailsAttribute);

        this.mesh = new THREE.InstancedMesh(this.instanceGeometry, material, this.trailLength);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        for (let i = 0; i < this.trailLength; i++) {
            this.mesh.setColorAt(i, this.color);
        }
        this.mesh.instanceColor.needsUpdate = true;
    }

    tick(delta, gameTime) {
        this.gameTime = gameTime;
        uniforms.time.value = gameTime;
    }

    createPheromone(facing, position) {
        //this.dummy.position.set(position.x, position.y, -1.0);


        let matrix = new THREE.Matrix4();   //identity matrix
        var a = new THREE.Vector3(0, 1, 0);
        var qrot = new THREE.Quaternion();
        qrot.setFromUnitVectors(a, new THREE.Vector3(facing.x, facing.y, 0));
        matrix.makeRotationFromQuaternion(qrot);
        //moves them behind the fishies
        matrix.setPosition(position.x, position.y, -1.0);
       

        this.mesh.setMatrixAt(this.count, matrix);
        
        this.trailsCreatedTime[this.count] = this.gameTime;
        
       
        this.mesh.instanceMatrix.needsUpdate = true;
        this.trailsAttribute.needsUpdate = true;
        const newPheromone = new Pheromone(this.world, facing, position, () => this._deletePheromone(this.count));
        this.world.add(newPheromone);

        this.count += 1;
        this.count = this.count % this.trailLength;
    }
}
