define(['viewerConstants'], function (constants) {
    const transparent_material = new THREE.MeshLambertMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.3
    });
    let fieldMesh = null;

    function createMaterials() {
        return {
            field_material : new THREE.MeshLambertMaterial({color: 0x007B0C}),
            car_material_blue : new THREE.MeshLambertMaterial({color: 0x0000ff}),
            car_material_orange : new THREE.MeshLambertMaterial({color: 0xff4500}),
            car_wheel_material : new THREE.MeshLambertMaterial({color: 0x555555}),
            yellow_toon : new THREE.MeshBasicMaterial({color: 0xffff00}),
            ball_material : new THREE.MeshBasicMaterial({color: 0xcccccc}),
        }
    }

    function createGeometry() {
        return {
            backboard: new THREE.BoxGeometry(constants.FIELD_WIDTH, constants.FIELD_HEIGHT, 5),
            wall: new THREE.BoxGeometry(constants.FIELD_LENGTH, constants.FIELD_HEIGHT, 5),
            field: new THREE.PlaneGeometry(constants.FIELD_WIDTH, constants.FIELD_LENGTH),
            car: new THREE.BoxGeometry(constants.CAR_LENGTH, constants.CAR_WIDTH, constants.CAR_HEIGHT),
            wheel: new THREE.CylinderGeometry(50, 50, 50, 16),
            front_mesh: new THREE.SphereGeometry(2, 16),
            ball_geo: new THREE.SphereGeometry(120, 32),
            car_top: new THREE.BoxGeometry(constants.CAR_LENGTH * 2 / 3, constants.CAR_WIDTH, constants.CAR_HEIGHT),
        }
    }

    function createField(geometry, materials) {
        const field_obj = new THREE.Mesh(geometry.field, materials.field_material);
        field_obj.receiveShadow = true;

        let blue_bb = new THREE.Mesh(geometry.backboard, transparent_material);
        blue_bb.receiveShadow = true;
        blue_bb.position.set(0, constants.FIELD_LENGTH / 2, constants.FIELD_HEIGHT / 2);
        blue_bb.rotation.set(Math.PI / 2, 0, 0);

        let orange_bb = new THREE.Mesh(geometry.backboard, transparent_material);
        orange_bb.receiveShadow = true;
        orange_bb.position.set(0, -constants.FIELD_LENGTH / 2, constants.FIELD_HEIGHT / 2);
        orange_bb.rotation.set(Math.PI / 2, 0, 0);

        let wall1 = new THREE.Mesh(geometry.wall, transparent_material);
        wall1.receiveShadow = true;
        wall1.position.set(-constants.FIELD_WIDTH / 2, 0, constants.FIELD_HEIGHT / 2);
        wall1.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        let wall2 = new THREE.Mesh(geometry.wall, transparent_material);
        wall2.receiveShadow = true;
        wall2.position.set(constants.FIELD_WIDTH / 2, 0, constants.FIELD_HEIGHT / 2);
        wall2.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        return {
            field_obj: field_obj,
            blue_backboard: blue_bb,
            orange_backboard: orange_bb,
            walls: [wall1, wall2],
            objectList: [field_obj, blue_bb, orange_bb, wall1, wall2]
        }
    }

// Geometry


//OBJ loader
// instantiate a loader
// var loader = new THREE.OBJLoader();
// var ball_obj;
// // load a resource
// loader.load(
//     // resource URL
//     '/static/obj/Ball.obj',
//     // called when resource is loaded
//     function (object) {
//         ball_obj = object;
//
//         ball_obj.scale.set( 0.05, 0.05, 0.05 );
//         ball_obj.receiveShadow = true;
//         ball_obj.castShadow = true;
//         scene.add(ball_obj);
//
//     },
//     // called when loading is in progresses
//     function (xhr) {
//
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//
//     },
//     // called when loading has errors
//     function (error) {
//
//         console.log('An error happened');
//
//     }
// );

// Field creation


// Ball creation
    function createBall(geometry, materials) {
        const ball_obj = new THREE.Mesh(geometry.ball_geo, materials.ball_material);
        ball_obj.receiveShadow = true;
        ball_obj.castShadow = true;
        return ball_obj
    }

// LIGHTS //

    function createLight() {
        let ambient = new THREE.AmbientLight(0xffffff, 0.5);
        let light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.castShadow = true;
        light.position.set(0, 100, 100);
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 3100;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        light.shadow.camera.top = -100;
        light.shadow.camera.bottom = 100;
        let lightHelper = new THREE.DirectionalLightHelper(light); // this shows where the light is pointing (good for debug)
        // scene.add(lightHelper);

// Create a helper for the shadow camera (optional)
        let helper = new THREE.CameraHelper(light.shadow.camera);
//     scene.add(helper);
        return {
            ambient: ambient,
            defaultLight: light,
            lightHelper: lightHelper,
            shadowHelper: helper,
            objectList: [ambient, light]
        }
    }

    function createCars(geometry, materials, data) {
        const cars = [];
        const num_players = data['players'].length;
        const boosts = [];
        for (let i = 0; i < num_players; i++) {
            let group = new THREE.Group();
            let body_mat = data['colors'][i] ? materials.car_material_orange : materials.car_material_blue;
            let body = new THREE.Mesh(geometry.car, body_mat);

            body.castShadow = true;
            body.position.set(0, 0, 1.5);

            // let top = new THREE.Mesh(car_top, body_mat);
            // top.castShadow = true;
            // top.position.set(0, 0, CAR_HEIGHT * 1.5);
            let wheel_pos = [
                [constants.CAR_WIDTH / 2, -constants.CAR_LENGTH / 3, 0],
                [constants.CAR_WIDTH / 2, constants.CAR_LENGTH / 3, 0],
                [-constants.CAR_WIDTH / 2, -constants.CAR_LENGTH / 3, 0],
                [-constants.CAR_WIDTH / 2, constants.CAR_LENGTH / 3, 0],
            ];
            wheel_pos.forEach(function (w) {
                let wh = new THREE.Mesh(geometry.wheel, materials.car_wheel_material);
                wh.position.set(w[0], w[1], w[2]);
                group.add(wh);
            });
            let front = new THREE.Mesh(geometry.front_mesh, materials.yellow_toon);
            front.position.set(3, 0, 0);
            group.add(front);

            group.add(body);
            // group.add(top);
            // PARTICLE BOOST
            let particleSystem = new THREE.GPUParticleSystem({
                maxParticles: 2000
            });

            group.add(particleSystem);
            boosts[i] = particleSystem;
            cars[i] = group;
            group.castShadow = true;
            group.receiveShadow = true;

            // // TEXT
            // names[i] = createLabel(name_arr[i].toString(), 0, 0, 0, 3, '');
            // scene.add(text);
        }
        return {
            cars: cars,
            boosts: boosts
        }

    }

    function createLabels(names, container) {
        let labels = [];
        for (let i = 0; i < names.length; i++) {
            labels.push(createLabel(names[i].toString(), 0, 0, 0, 3, '', container));
        }
        return labels;
    }

    function createLabel(text, x, y, z, size, color, container) {
        let div = document.createElement("div");
        div.innerText = text;
        let pos = [0, 0];
        div.style.display = 'inline-block';
        div.style.position = 'absolute';
        div.style.top = pos[1].toString() + 'px';
        div.style.left = pos[0].toString() + 'px';
        div.style.color = 'white';
        div.style.borderRadius = '10px';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        div.style.padding = '0 5px';
        div.style.fontSize = '0.6em';
        container.appendChild(div);
        return div
    }

    function createStaticObjects() {
        let materials = createMaterials();
        let geometry = createGeometry();
        if (fieldMesh == null) {
            fieldMesh = createField(geometry, materials);
        } else {
            fieldMesh.wireframe = true;
            let scale = 10;
            fieldMesh.scale = {"x":scale, "y":scale, "z":scale};
        }
        let field = fieldMesh;
        let ball = createBall(geometry, materials);
        let lights = createLight();

        return {
            objects: {
                field: field,
                ball: ball,
                lights: lights
            },
            geometry: geometry,
            materials: materials
        }
    }

    function loadObjects(callback) {
        var loader = new THREE.OBJLoader();
        loader.load('/static/img/field/field.obj', function (loadedFieldMesh) {
            let material = new THREE.MeshBasicMaterial({color: 0xff0000});
            material.wireframe = true;
            fieldMesh = loadedFieldMesh;
            fieldMesh.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                    child.wireframe = true;
                }
            } );
            fieldMesh.wireframe = true;
            fieldMesh.scale.x = fieldMesh.scale.y = fieldMesh.scale.z = 500;
            callback();
        }, function (whoCares) {

        }, function (onError) {
            console.log(onError);
        });
    }

    function addStaticObjectsToScene(objects, scene) {
        for (let property in objects) {
            if (objects.hasOwnProperty(property)) {
                let value = objects[property];
                if (value.hasOwnProperty('objectList')) {
                    for (let i = 0; i < value.objectList.length; i++) {
                        scene.add(value.objectList[i]);
                    }
                } else {
                    scene.add(value)
                }
            }

        }
    }

    return {
        createMaterials: createMaterials,
        createGeometry: createGeometry,
        createField: createField,
        createBall: createBall,
        createLight: createLight,
        loadObjects: loadObjects,
        createCars: createCars,
        createStaticObjects: createStaticObjects,
        createLabels: createLabels,
        addStaticObjectsToScene: addStaticObjectsToScene
    }
});
