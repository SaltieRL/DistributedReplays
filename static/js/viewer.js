// import * as THREE from "./three";

function jsonGet(yourUrl) {
    let req = new XMLHttpRequest(); // a new request
    req.open("GET", yourUrl, false);
    req.send(null);
    return JSON.parse(req.responseText);
}

function createLabel(text, x, y, z, size, color) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = size + "pt Arial";
    var margin = 10;
    var textWidth = context.measureText(text).width;
    context.strokeStyle = "black";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "red";
    context.strokeRect(canvas.width / 2 - textWidth / 2 - margin / 2, canvas.height / 2 - size / 2 - +margin / 2, textWidth + margin, size + margin);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height, 10, 10), material);
    mesh.overdraw = true;
    // mesh.doubleSided = true;
    mesh.position.x = x - canvas.width / 2;
    mesh.position.y = y - canvas.height / 2;
    return mesh;
}

var width = 600;
var height = 300;
const data = jsonGet('/replays/parsed/view/' + REPLAY_HASH + '/positions');
const num_players = data['players'].length;
console.log(data);


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
camera.position.set(0, 0, 150);
camera.rotation.set(Math.PI, 0, 0);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// window.innerHeight
renderer.setSize(width, height);
document.getElementById('viewer').appendChild(renderer.domElement);

// orbit controls setup
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', animate);
controls.minDistance = 100;
controls.maxDistance = 500;
// this is the angle for the weird horizontal rotation TODO: figure out how to get it to rotate around the center of the field
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = 0;
// setting to zero locks it in place

// prevents panning with right click
controls.enablePan = false;
// controls.screenSpacePanning = true;


// OBJECTS //

// materials
const transparent_material = new THREE.MeshLambertMaterial({
    color: '#000000',
    transparent: true,
    opacity: 0.6
});
const field_material = new THREE.MeshLambertMaterial({color: 0x007B0C});
const car_material_blue = new THREE.MeshLambertMaterial({color: 0x0000ff});
const car_material_orange = new THREE.MeshLambertMaterial({color: 0xff4500});
const car_wheel_material = new THREE.MeshLambertMaterial({color: 0x555555});
const yellow_toon = new THREE.MeshBasicMaterial({color: 0xffff00});
const ball_material = new THREE.MeshLambertMaterial({color: 0xcccccc});

// Geometry
const field = new THREE.PlaneGeometry(200, 200);
const car = new THREE.BoxGeometry(6, 3, 2);
const wheel = new THREE.CylinderGeometry(1, 1, 1, 16);
const front_mesh = new THREE.SphereGeometry(2, 16);
const ball = new THREE.SphereGeometry(5, 32);


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

// Car creation
const cars = [];
const names = [];
for (let x = 0; x < num_players; x++) {
    var group = new THREE.Group();
    let body_mat = data['colors'][x] ? car_material_orange : car_material_blue;
    let body = new THREE.Mesh(car, body_mat);

    body.castShadow = true;
    body.position.set(0, 0, 1.5);
    let wheel_pos = [
        [1.5, -1.5, 0],
        [1.5, 1.5, 0],
        [-1.5, -1.5, 0],
        [-1.5, 1.5, 0],
    ];
    wheel_pos.forEach(function (w) {
        let wh = new THREE.Mesh(wheel, car_wheel_material);
        wh.position.set(w[0], w[1], w[2]);
        group.add(wh);
    });
    // let front = new THREE.Mesh(front_mesh, yellow_toon);
    // front.position.set(3, 0, 0);
    // group.add(front);

    group.add(body);
    cars[x] = group;
    group.castShadow = true;
    group.receiveShadow = true;
    scene.add(group);

    // // TEXT
    // text = createLabel(x.toString(), 0, 0, 0, 3, '');
    // names[x] = text;
    // scene.add(text);
}

const field_obj = new THREE.Mesh(field, field_material);
field_obj.receiveShadow = true;
// field_obj.castShadow = true;
scene.add(field_obj);
//
const ball_obj = new THREE.Mesh(ball, ball_material);
ball_obj.receiveShadow = true;
ball_obj.castShadow = true;
scene.add(ball_obj);


// LIGHTS //
var ambient = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambient);

createLight();

function createLight() {
    var light = new THREE.DirectionalLight(0xffffff, 1.5);
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
    scene.add(light);
    let lightHelper = new THREE.DirectionalLightHelper(light); // this shows where the light is pointing (good for debug)
    // scene.add(lightHelper);

// Create a helper for the shadow camera (optional)
    let helper = new THREE.CameraHelper(light.shadow.camera);
//     scene.add(helper);
}


// ANIMATION
let frame = 0;
var clock = new THREE.Clock(true);
const ratio = 0.5;
clock.start();
console.log(clock);
animate();


function animate() {
    requestAnimationFrame(animate);
    // lightHelper.update();
    // console.log(camera.position, camera.rotation);
    let elapsed = clock.getElapsedTime();
    let actual_frame = Math.floor(elapsed * 30);
    for (let i = 0; i < num_players; i++) {
        let d = data['players'][i][actual_frame];
        let d_next = data['players'][i][actual_frame + 1];
        let x = d[0];
        let y = d[1];
        let z = d[2];


        // let rot_x = d[5];
        // let rot_y = d[3];
        // let rot_z = d[4];
        let rot = [d[5], d[3], d[4]];
        let rot_next = [d_next[5], d_next[3], d_next[4]];
        let r_f = function (rot, next, idx) {
            if (Math.abs(rot[idx] - next[idx]) > Math.PI / 4) {
                return rot[idx]
            }
            return rot[idx] + (next[idx] - rot[idx]) * ratio;
        };
        cars[i].position.set(x, y, z);
        cars[i].rotation.set(0, 0, 0);
        cars[i].rotateX(r_f(rot, rot_next, 0));
        cars[i].rotateY(r_f(rot, rot_next, 1));
        cars[i].rotateZ(r_f(rot, rot_next, 2));
        // TODO: y rotation is broken (seems like there is some sort of relationship between them that is not working)
        // cars[i].rotation.set(rot_x, rot_y, rot_z);
        // names[i].position.set(x, y, z + 5);
    }

    let x = data['ball'][actual_frame][0];
    let y = data['ball'][actual_frame][1];
    let z = data['ball'][actual_frame][2];
    ball_obj.position.set(x, y, z);
    renderer.render(scene, camera);
}
