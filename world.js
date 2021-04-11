import { Grid } from "./grid.js";
import { arrayRemove } from "./arrays.js"
export class World {
    constructor(scene, topLeft, bottomRight) {
        this.grid = new Grid(topLeft, bottomRight);
        this.left = topLeft.x;
        this.top = topLeft.y;
        this.bottom = bottomRight.y;
        this.right = bottomRight.x;

        this.scene = scene;
        this.newEntities = [];
        this.deletedEntities = [];
        this.entities = [];
        this.ticklessEntities = [];
        this.gameTime = 0.0;
    }

    add(entity) {
        if (entity.create != null) {
            entity.create()
                .then(x => this.newEntities.push(entity))
                .catch(x => {
                    console.log("error in create");
                    console.log(x);
                });
        }
        else {
            this.newEntities.push(entity);
        }
    }

    remove(entity) {
        this.deletedEntities.push(entity);
    }

    //debugTimer = 1.0;
    tick(delta) {
        this._deleteEntities();
        this._tickEntities(delta);
        this._createEntities();
        this.gameTime += delta;
        /*
        this.debugTimer -= delta;
        if(this.debugTimer < 0){
            console.log(`deleted ${this.deletedEntities.length}`);
            console.log(`created ${this.newEntities.length}`);
            console.log(`entities ${this.entities.length}`);
            console.log(`static entities ${this.ticklessEntities.length}`);
            this.grid.print();
            this.debugTimer = 10.0;
        }*/
    }

    _tickEntities(delta) {
        for (let entity of this.entities) {
            if (entity.tick != null) {
                entity.tick(delta, this.gameTime);
            }

            if (entity.facing != null && entity.mesh != null && entity.isStatic != true) {
                var a = new THREE.Vector3(0, 1, 0);
                var qrot = new THREE.Quaternion();
                qrot.setFromUnitVectors(a, new THREE.Vector3(entity.facing.x, entity.facing.y, 0));
                entity.mesh.rotation.setFromQuaternion(qrot);
                entity.mesh.rotation.x = 0;
                entity.mesh.rotation.y = 0;
            }
        }
    }

    _createEntities() {
        for (let entity of this.newEntities) {

            if (entity.includeInGrid == true) {
                this.grid.add(entity);
            }

            if (entity.mesh != null) {
                this.scene.add(entity.mesh);
            }

            if (entity.tick != null) {
                this.entities.push(entity);
            } else {
                this.ticklessEntities.push(entity);
            }
        }

        this.newEntities.length = 0; //clear created entities
    }

    _deleteEntities() {
        for (let entity of this.deletedEntities) {
            this._deleteEntity(entity);
        }
        this.deletedEntities.length = 0;
        
        while(this.ticklessEntities.length > 24100){
            this._deleteEntity(this.ticklessEntities[0]);
            this.ticklessEntities.shift();
        } 
    }

    _deleteEntity(entity) {
        if (entity.includeInGrid) {
            this.grid.remove(entity);
        }
        if (entity.mesh != null) {
            this.scene.remove(entity.mesh);
        }

        if (entity.delete != null) {
            entity.delete();
        }

        if (entity.tick != null) {
            arrayRemove(this.entities, entity);
        }
    }
}
