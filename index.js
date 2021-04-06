import { World } from "./world.js"
import { Ant } from "./ant.js";
import { Stats } from "./stats.js";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -100, 100);
const renderer = new THREE.WebGLRenderer();
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setSize(window.innerWidth, window.innerHeight);
onWindowResize();
camera.position.z = 0;
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);
const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
scene.add(light);
scene.background = new THREE.Color(0xffffff);
const stats = createStats();
document.body.appendChild(stats.domElement);

const world = new World(scene, new THREE.Vector2(camera.left, camera.top), new THREE.Vector2(camera.right, camera.bottom));

for (let i = 0; i < 60; i++) {
    let facing = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
    world.add(new Ant(world, facing));
}

let then = 0;
const animate = function (now) {
    requestAnimationFrame(animate);
    stats.begin();
    now = now * 0.001;
    const delta = now - then;
    then = now;
    world.tick(delta);
    renderer.render(scene, camera);
    stats.end();
    //console.log(world.entities.length);
};

requestAnimationFrame(animate);



function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
}

function onWindowResize() {

    const frustumSize = 200;
    var aspect = window.innerHeight / window.innerWidth;
    camera.left = frustumSize / - 2;
    camera.right = frustumSize / 2;
    camera.top = frustumSize * aspect / 2;
    camera.bottom = - frustumSize * aspect / 2;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
