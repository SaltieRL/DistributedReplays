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

var data = jsonGet('/replays/parsed/view/' + REPLAY_HASH + '/positions');
const num_players = data['players'].length;
console.log(data);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;


// window.innerHeight
renderer.setSize(500, 500);
document.getElementById('viewer').appendChild(renderer.domElement);

const field = new THREE.BoxGeometry(100, 100, 1);
const field_material = new THREE.MeshBasicMaterial({color: 0x007B0C});
const car = new THREE.BoxGeometry(6, 3, 2);
const wheel = new THREE.CylinderGeometry(1, 1, 1, 16);
const front_mesh = new THREE.SphereGeometry(2, 16);
const car_material_blue = new THREE.MeshBasicMaterial({color: 0x0000ff});
const car_material_orange = new THREE.MeshBasicMaterial({color: 0xff4500});
const yellow = new THREE.MeshBasicMaterial({color: 0xffff00});
const ball = new THREE.SphereGeometry(3, 32);
const ball_material = new THREE.MeshBasicMaterial({color: 0xff0000});
const cars = [];
const names = [];
for (let x = 0; x < num_players; x++) {
    var group = new THREE.Group();
    let body_mat = data['colors'][x] ? car_material_orange : car_material_blue;
    let body = new THREE.Mesh(car, body_mat);
    body.position.set(0, 0, 1.5);
    let wheel_pos = [
        [1.5, -1.5, 0],
        [1.5, 1.5, 0],
        [-1.5, -1.5, 0],
        [-1.5, 1.5, 0],
    ];
    wheel_pos.forEach(function (w) {
        let wh = new THREE.Mesh(wheel, ball_material);
        wh.position.set(w[0], w[1], w[2]);
        group.add(wh);
    });
    let front = new THREE.Mesh(front_mesh, yellow);
    front.position.set(3, 0, 0);
    group.add(front);
    group.add(body);
    cars[x] = group;
    scene.add(group);

    // // TEXT
    // text = createLabel(x.toString(), 0, 0, 0, 3, '');
    // names[x] = text;
    // scene.add(text);
}

const field_obj = new THREE.Mesh(field, field_material);

scene.add(field_obj);

const ball_obj = new THREE.Mesh(ball, ball_material);

scene.add(ball_obj);


var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', animate);
controls.minDistance = 100;
controls.maxDistance = 500;
controls.enablePan = true;
controls.screenSpacePanning = false;
// white spotlight shining from the side, casting a shadow
//
// var spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(100, 1000, 100);
//
// spotLight.castShadow = true;
//
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
//
// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;
//
// scene.add(spotLight);
// var lightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(lightHelper);

camera.position.z = 5;
let frame = 0;
const divider = 100;
var clock = new THREE.Clock(true);
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
        let x = d[0] / 100.0;
        let y = d[1] / 100.0;
        let z = d[2] / 30.0;
        let rot_x = d[3] / 65536.0 * 2 * 3.14159265;
        let rot_y = d[5] / 65536.0 * 2 * 3.14159265;
        let rot_z = d[4] / 65536.0 * 2 * 3.14159265;
        cars[i].position.set(x, y, z);
        cars[i].rotation.set(rot_x, rot_y, rot_z);
        // names[i].position.set(x, y, z + 5);
    }

    let x = data['ball'][actual_frame][0] / 100.0;
    let y = data['ball'][actual_frame][1] / 100.0;
    let z = data['ball'][actual_frame][2] / 30.0;
    ball_obj.position.set(x, y, z);
    renderer.render(scene, camera);
}
