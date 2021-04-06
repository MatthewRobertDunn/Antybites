import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();
export function loadGtlf(path) {
    const myPromise = new Promise((resolve, reject) => {
        loader.load(path, gltf => resolve(gltf.scene),null, error => reject(error));
    });

    return myPromise;
}
