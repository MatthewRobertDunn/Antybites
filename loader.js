import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
export function loadGtlf(path) {
    const myPromise = new Promise((resolve, reject) => {
        loader.load(path, gltf => resolve(gltf.scene), null, error => reject(error));
    });

    return myPromise;
}

let materialCache = {};
let loading = {};

export async function loadTexture(path) {
    return load(path,async () => _loadTexture(path));
}

export async function load(key, func){
    return mutex(key, async function () {
        return cached(key,  async function() {
            return await func();
        });
    });
}


function _loadTexture(path) {
    const myPromise = new Promise((resolve, reject) => {
        textureLoader.load(path, texture => resolve(texture), null, error => reject(error));
    });
    return myPromise;
}

async function cached(key, func) {
    if (materialCache[key] != null) {
        return materialCache[key];
    } else {
        let result = await func();
        materialCache[key] = result;
        return result;
    }
}

async function mutex(key,  func) {
    while (loading[key] != null) {
        await wait(100);
    }
    loading[key] = true;
    let result = await func();
    loading[key] = null;
    return result;
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
