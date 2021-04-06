import { Pheromone } from './pheromone.js'
const uniforms = {
    time: { type: "f", value: 0.0 },
};

const geometry = new THREE.PlaneGeometry(2, 2, 1);
//const material = new THREE.MeshBasicMaterial({ color: 0xaaaa00 });

const material = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.NormalBlending,
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});


//Class of trailLength pheromones rendered using a single instanced mesh
export class Trail {
    constructor(world) {
        this.trailLength = 80;
        this.count = 0;
        this.dummy = new THREE.Object3D();  //use a dummy object to calculate the world transform matrix
        this.dummy.updateMatrix();
        this.pheremones = [];
        this.world = world;
        this.mesh = new THREE.InstancedMesh(geometry, material, this.trailLength);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.trailColor = new THREE.Color(Math.random() * 0xaaaaaa);
    }

    async create() {
        console.log("Trail created");
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
        this.mesh.setColorAt(this.count, this.trailColor);
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;


        const newPheromone = new Pheromone(this.world, facing, position, () => this._deletePheromone(this.count));
        this.world.add(newPheromone);


        this.count += 1;
        this.count = this.count % this.trailLength;
    }
}
