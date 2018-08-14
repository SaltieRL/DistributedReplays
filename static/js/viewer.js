// import * as THREE from "./three";

var container = document.getElementById('viewer');
window.playing = true;

function jsonGet(yourUrl) {
    let req = new XMLHttpRequest(); // a new request
    req.open("GET", yourUrl, false);
    req.send(null);
    return JSON.parse(req.responseText);
}

function createLabel(text, x, y, z, size, color) {
    var div = document.createElement("div");
    div.innerText = text;
    let pos = project(x, y, z);
    div.style.display = 'inline-block';
    div.style.position = 'absolute';
    div.style.top = pos[1].toString() + 'px';
    div.style.left = pos[0].toString() + 'px';
    div.style.color = 'white';
    div.style.borderRadius = '10px';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    div.style.padding = '0 5px';
    div.style.fontSize = '0.6em';
    container.appendChild(div);
    return div
}

function project(x, y, z) {
    let wh = width / 2;
    let hh = height / 2;
    let pos = new THREE.Vector3(x, y, z);
    pos.project(camera);
    return [pos.x * wh + wh - 10, -(pos.y * hh) + hh];
}

window.debug = false;

function addDebug() {
    window.debug = true;
    var div = document.createElement("div");
    div.style.display = 'inline-block';
    div.style.position = 'absolute';
    div.style.color = 'white';
    div.style.borderRadius = '10px';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    div.style.padding = '0 5px';
    div.style.fontSize = '0.3em';
    container.appendChild(div);
    window.fps = div;
}

addDebug();
var width = 800;
var height = 450;
const data = jsonGet('/replays/parsed/view/' + REPLAY_HASH + '/positions');
const num_players = data['players'].length;
const frames = data['frames'];
const goals = data['goals'];
const ball = data['ball'];
const players = data['players'];
console.log(data);


let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
let camera = new THREE.OrthographicCamera(200, -200, 200, -200, 1, 100000);
camera.position.set(0, 0, 250);
// camera.rotation.set(Math.PI, 0, 0);
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// window.innerHeight
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

var stats = new Stats();
stats.dom.style.position = 'relative';
container.appendChild(stats.dom);

// axis = new THREE.AxisHelper()
// scene.add(axis);
// orbit controls setup
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.addEventListener('change', animate);
// controls.minDistance = 100;
// controls.maxDistance = 500;
// // this is the angle for the weird horizontal rotation TODO: figure out how to get it to rotate around the center of the field
// controls.minAzimuthAngle = 0;
// controls.maxAzimuthAngle = 0;
// // setting to zero locks it in place
//
// // prevents panning with right click
// controls.enablePan = false;
// controls.screenSpacePanning = true;
// CONSTANTS

const CAR_LENGTH = 240;
const CAR_WIDTH = 160;
const CAR_HEIGHT = 80;
const FIELD_RATIO = 5140.0 / 4120;
const FIELD_WIDTH = 4120.0 * 2;
const FIELD_HEIGHT = 2000.0;
const FIELD_LENGTH = FIELD_WIDTH * FIELD_RATIO;
const ASPECT_RATIO = 1.4;
const CAMERA_DISTANCE = 5000.0;

// OBJECTS //
function setOrthoView(camera) {
    var w = FIELD_LENGTH * Math.cos(Math.PI / 4) + FIELD_WIDTH * Math.cos(Math.PI / 4);
    var h = FIELD_LENGTH * Math.cos(Math.PI / 8) + FIELD_HEIGHT;
    camera.left = -h / 2 * ASPECT_RATIO;
    camera.right = h / 2 * ASPECT_RATIO;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.near = 0;
    camera.far = 100000;
    camera.updateProjectionMatrix()
}

function cameraTop() {
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(0, 0, FIELD_HEIGHT * 3);
    camera.lookAt(0, 0, 0)
}

var angle = 50;
var height_multiplier = 2;
var multiplier = 2.5;

function cameraSide() {
    camera.up = new THREE.Vector3(0, 0, 1);
    let x_multiplier = Math.cos(angle * Math.PI / 180);
    let y_multiplier = Math.sin(angle * Math.PI / 180);
    camera.position.set(CAMERA_DISTANCE * multiplier * x_multiplier, CAMERA_DISTANCE * multiplier * y_multiplier, CAMERA_DISTANCE * height_multiplier);
    camera.lookAt(-FIELD_HEIGHT / 2 * x_multiplier, -FIELD_HEIGHT / 2 * y_multiplier, 0);
}

// TODO: save camera settings in browser using cookie
function rotateLeft() {
    angle -= 10;
    console.log(angle);
    cameraSide();
}

function rotateRight() {
    angle += 10;
    console.log(angle);
    cameraSide();
}

function raiseCamera() {
    height_multiplier += .2
    cameraSide();
}

function lowerCamera() {
    height_multiplier -= .2
    cameraSide();
}

setOrthoView(camera);
cameraSide();

// materials
const transparent_material = new THREE.MeshLambertMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.3
});
const field_material = new THREE.MeshLambertMaterial({color: 0x007B0C});
const car_material_blue = new THREE.MeshLambertMaterial({color: 0x0000ff});
const car_material_orange = new THREE.MeshLambertMaterial({color: 0xff4500});
const car_wheel_material = new THREE.MeshLambertMaterial({color: 0x555555});
const yellow_toon = new THREE.MeshBasicMaterial({color: 0xffff00});
const ball_material = new THREE.MeshBasicMaterial({color: 0xcccccc});

// Geometry
const backboard = new THREE.BoxGeometry(FIELD_WIDTH, FIELD_HEIGHT, 5);
const wall = new THREE.BoxGeometry(FIELD_LENGTH, FIELD_HEIGHT, 5);
const field = new THREE.PlaneGeometry(FIELD_WIDTH, FIELD_LENGTH);
const car = new THREE.BoxGeometry(CAR_LENGTH, CAR_WIDTH, CAR_HEIGHT);
const wheel = new THREE.CylinderGeometry(50, 50, 50, 16);
const front_mesh = new THREE.SphereGeometry(2, 16);
const ball_geo = new THREE.SphereGeometry(120, 32);
const car_top = new THREE.BoxGeometry(CAR_LENGTH * 2 / 3, CAR_WIDTH, CAR_HEIGHT);

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

const field_obj = new THREE.Mesh(field, field_material);
field_obj.receiveShadow = true;
// field_obj.castShadow = true;
scene.add(field_obj);

let blue_bb = new THREE.Mesh(backboard, transparent_material);
blue_bb.receiveShadow = true;
blue_bb.position.set(0, FIELD_LENGTH / 2, FIELD_HEIGHT / 2)
blue_bb.rotation.set(Math.PI / 2, 0, 0);
scene.add(blue_bb);
let orange_bb = new THREE.Mesh(backboard, transparent_material);
orange_bb.receiveShadow = true;
orange_bb.position.set(0, -FIELD_LENGTH / 2, FIELD_HEIGHT / 2)
orange_bb.rotation.set(Math.PI / 2, 0, 0);
scene.add(orange_bb);

let wall1 = new THREE.Mesh(wall, transparent_material);
wall1.receiveShadow = true;
wall1.position.set(-FIELD_WIDTH / 2, 0, FIELD_HEIGHT / 2)
wall1.rotation.set(Math.PI / 2, Math.PI / 2, 0);
scene.add(wall1);

let wall2 = new THREE.Mesh(wall, transparent_material);
wall2.receiveShadow = true;
wall2.position.set(FIELD_WIDTH / 2, 0, FIELD_HEIGHT / 2)
wall2.rotation.set(Math.PI / 2, Math.PI / 2, 0);
scene.add(wall2);

// Ball creation
const ball_obj = new THREE.Mesh(ball_geo, ball_material);
ball_obj.receiveShadow = true;
ball_obj.castShadow = true;
scene.add(ball_obj);


// Car creation
const cars = [];
const names = [];
const name_arr = data['names'];
const boosts = [];
for (let x = 0; x < num_players; x++) {
    var group = new THREE.Group();
    let body_mat = data['colors'][x] ? car_material_orange : car_material_blue;
    let body = new THREE.Mesh(car, body_mat);

    body.castShadow = true;
    body.position.set(0, 0, 1.5);

    // let top = new THREE.Mesh(car_top, body_mat);
    // top.castShadow = true;
    // top.position.set(0, 0, CAR_HEIGHT * 1.5);
    let wheel_pos = [
        [CAR_WIDTH / 2, -CAR_LENGTH / 3, 0],
        [CAR_WIDTH / 2, CAR_LENGTH / 3, 0],
        [-CAR_WIDTH / 2, -CAR_LENGTH / 3, 0],
        [-CAR_WIDTH / 2, CAR_LENGTH / 3, 0],
    ];
    wheel_pos.forEach(function (w) {
        let wh = new THREE.Mesh(wheel, car_wheel_material);
        wh.position.set(w[0], w[1], w[2]);
        group.add(wh);
    });
    let front = new THREE.Mesh(front_mesh, yellow_toon);
    front.position.set(3, 0, 0);
    group.add(front);

    group.add(body);
    // group.add(top);
    // PARTICLE BOOST
    let particleSystem = new THREE.GPUParticleSystem({
        maxParticles: 2000
    });
    ;
    group.add(particleSystem)
    boosts[x] = particleSystem;
    cars[x] = group;
    group.castShadow = true;
    group.receiveShadow = true;
    scene.add(group);

    // // TEXT
    names[x] = createLabel(name_arr[x].toString(), 0, 0, 0, 3, '');
    // scene.add(text);
}
// PARTICLE BOOST OPTIONS

var options = {
    position: new THREE.Vector3(-3, 0, 0),
    positionRandomness: .05,
    velocity: new THREE.Vector3(),
    velocityRandomness: .2,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: .5,
    lifetime: 2,
    size: 5,
    sizeRandomness: 1
};
var spawnerOptions = {
    spawnRate: 2000,
    horizontalSpeed: 1.5,
    verticalSpeed: 0,
    timeScale: 1
};


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
const clock = new THREE.Clock(true);
var current_frame = 0;
const clock_offset = frames[current_frame][2];
const ratio = 0.5;
clock.start();
let xs = {};
console.log(clock);
var tick = 0;
animate();

function animate() {
    stats.begin();
    let elapsed = clock_offset + clock.getElapsedTime();
    let current_time = frames[current_frame][2];
    let next_time = frames[current_frame + 1][2];
    // if we should go onto the next frame or our frame time is > 1s (prevents weird interp artifacts)
    if ((elapsed > next_time) || (next_time - current_time > 1)) {
        current_frame += 1;
        current_time = next_time;
        next_time = frames[current_frame + 1][2];
    }
    let delta = (elapsed - current_time) / (next_time - current_time);
    for (let i = 0; i < num_players; i++) {
        let d = players[i][current_frame];
        let d_next = players[i][current_frame + 1];
        let x = d[0];
        let y = d[1];
        let z = d[2];
        let x_n = d_next[0];
        let y_n = d_next[1];
        let z_n = d_next[2];
        let x_t = x + (x_n - x) * delta;
        let y_t = y + (y_n - y) * delta;
        let z_t = z + (z_n - z) * delta;
        cars[i].position.set(x_t, y_t, z_t);
        let rot = [d[3], d[5], d[4]];
        // let rot = [0, 0, d[4]];
        // let rot = [0, d[5], d[4]];
        // let rot_next = [0, 0, d_next[4]];
        let rot_next = [d_next[3], d_next[5], d_next[4]];
        let r_f = function (rot, next, idx) {
            if (Math.abs(rot[idx] - rot_next[idx]) > Math.PI / 4) {
                return rot[idx]
            }
            return rot[idx] + (rot_next[idx] - rot[idx]) * delta;
        };
        // cars[i].rotation.set(rot[0], rot[1], rot[2]);
		let pitch = d[3];
		let yaw = d[4];
		let roll = d[5];
		
		pitch = pitch / 65536 * Math.PI;
		yaw = yaw / 65536 * 2 * Math.PI;
		roll = roll / 65536 * 2 * Math.PI;
		console.log(pitch.toFixed(5), yaw.toFixed(5), roll.toFixed(5))
        let zyx = new THREE.Euler(roll, pitch, yaw, "ZYX");
        cars[i].setRotationFromEuler(zyx);
        // cars[i].rotateX(r_f(rot, rot_next, 0));
        // cars[i].rotateY(r_f(rot, rot_next, 1));
        // cars[i].rotateZ(r_f(rot, rot_next, 2));
        // TODO: y rotation is broken (seems like there is some sort of relationship between them that is not working)
        // cars[i].rotation.set(rot_x, rot_y, rot_z);
        let pos = project(x_t, y_t, z_t + 40);
        if (pos[0] < 0) {
            console.log(pos);
        }
        for (let idx = 0; idx < 3; idx++) {
            if (Math.abs(Math.sin(rot[idx]) - Math.sin(rot_next[idx])) > 1) {
                // console.log(i, current_frame, idx, rot[idx], rot_next[idx])
            }
        }
        if (i === 0 && current_frame > 0) {
            xs[elapsed] = rot[1];
        }

        if (d[6]) {
            var clock_delta = clock.getDelta() * spawnerOptions.timeScale;
            tick += clock_delta;
            if (tick < 0) tick = 0;
            // console.log('boosting');
            // player is boosting
            options.position.x = 0;//-3 - Math.sin(tick * spawnerOptions.horizontalSpeed);
            options.position.y = 0; //Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
            options.position.z = 0;//Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
            for (let x = 0; x < spawnerOptions.spawnRate * clock_delta; x++) {
                // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
                // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
                boosts[i].spawnParticle(options);
            }
            boosts[i].update(tick);
        }


        names[i].style.top = pos[1].toString() + 'px';
        names[i].style.left = pos[0].toString() + 'px';
    }
    let d = ball[current_frame];
    let d_next = ball[current_frame + 1];
    let x = d[0];
    let y = d[1];
    let z = d[2];
    let x_n = d_next[0];
    let y_n = d_next[1];
    let z_n = d_next[2];
    let x_t = x + (x_n - x) * delta;
    let y_t = y + (y_n - y) * delta;
    let z_t = z + (z_n - z) * delta;
    // ball_obj.position.set(x, y, z + 2);
    ball_obj.position.set(x_t, y_t, z_t + 2);

    renderer.render(scene, camera);

    stats.end();
    if (window.debug) {
        window.fps.innerText = current_frame.toString();
    }
    if (playing) {
        requestAnimationFrame(animate);
    }
}

function graph() {
    var config = {
        type: 'line',
        data: {
            labels: Object.keys(xs),
            datasets: [{
                label: 'My First dataset',
                data: Object.values(xs),
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById('chart').getContext('2d');
    window.myLine = new Chart(ctx, config);
}