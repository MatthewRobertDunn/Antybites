import { Pheromone } from './pheromone.js'
import { loadTexture, load } from './loader.js'

const uniforms = {
    time: { type: "f", value: 0.0 },
};

const geometry = new THREE.PlaneGeometry(1, 2.5, 1);
/*
let material = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.NormalBlending,
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
}); */

let texture = null;

//Class of trailLength pheromones rendered using a single instanced mesh
export class Trail {

    constructor(world, color) {
        this.trailLength = 80;
        this.count = 0;
        this.dummy = new THREE.Object3D();  //use a dummy object to calculate the world transform matrix
        this.dummy.updateMatrix();
        this.pheremones = [];
        this.world = world;
        this.color = color;
    }

    async create() {

        const material = await load("trailMaterial", async function () {
            const texture = await loadTexture('./res/trail.png');
            uniforms.texture1 =  { type: "t", value: texture };
            return new THREE.ShaderMaterial({
                transparent: true,
                //blending: THREE.MultiplyBlending,
                uniforms: uniforms,
                vertexShader: document.getElementById('vertexShader').textContent,
                fragmentShader: document.getElementById('fragmentShader').textContent
            })
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.trailLength);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        for (let i = 0; i < this.trailLength; i++) {
            this.mesh.setColorAt(i, this.color);
        }
        this.mesh.instanceColor.needsUpdate = true;
    }

    tick(delta) {
        uniforms.time.value += delta / 100.0;
    }

    createPheromone(facing, position) {
        //this.dummy.position.set(position.x, position.y, -1.0);


        let matrix = new THREE.Matrix4();   //identity matrix
        var a = new THREE.Vector3(0, 1, 0);
        var qrot = new THREE.Quaternion();
        qrot.setFromUnitVectors(a, new THREE.Vector3(facing.x, facing.y, 0));
        matrix.makeRotationFromQuaternion(qrot);

        matrix.setPosition(position.x, position.y, -1.0); //translate transform

        this.mesh.setMatrixAt(this.count, matrix);
        this.mesh.instanceMatrix.needsUpdate = true;
        const newPheromone = new Pheromone(this.world, facing, position, () => this._deletePheromone(this.count));
        this.world.add(newPheromone);


        this.count += 1;
        this.count = this.count % this.trailLength;
    }
}
