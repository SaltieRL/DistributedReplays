// import * as THREE from "./three";

define(['server', 'three', 'viewerSetup',
    'viewerObjectCreation', 'viewerCamera', 'viewerAnimation'], function (server, THREE, setup,
                                                                          objects, camera, animation) {

    function addDebug(container) {
        window.debug = true;
        let div = document.createElement("div");
        div.style.display = 'inline-block';
        div.style.position = 'absolute';
        div.style.color = 'white';
        div.style.borderRadius = '10px';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        div.style.padding = '0 5px';
        div.style.fontSize = '0.3em';
        container.appendChild(div);
        return div;
    }

    function createDebugObject(container) {
        let stats = new Stats();
        stats.dom.style.position = 'relative';
        container.appendChild(stats.dom);

        return {
            fps: addDebug(container),
            stats: stats,
            isDebugging: true
        }
    }

    function createStateObject() {
        return {
            playing: true
        }
    }

    function start(replayHash, containerId='viewer') {
        console.debug('initializing viewer');
        let core = setup.getCore(containerId);

        console.debug('Adding initial objects');
        let staticObjects = objects.createStaticObjects();
        objects.addStaticObjectsToScene(staticObjects.objects, core.scene);

        console.debug('Setting up the camera');
        let cameraFunctions = camera.createCameraFunctions(core.camera);

        let debug = createDebugObject(core.container);
        let state = createStateObject();

        console.debug('loading data');
        server.asyncJsonGet('/replays/parsed/view/' + replayHash + '/positions', function (data) {
            console.debug('data has been loaded');
            let cars = objects.createCars(staticObjects.geometry, staticObjects.materials, data);
            // Adding cars
            for (let i = 0; i < cars.cars.length; i++) {
                core.scene.add(cars.cars[i])
            }
            for (let i = 0; i < cars.boosts.length; i++) {
                core.scene.add(cars.boosts[i])
            }

            let labels = objects.createLabels(data['names'], core.container);
            let startFunction = animation.startAnimation({
                cars: cars.cars,
                boosts: cars.boosts,
                names: labels,
                ball: staticObjects.objects.ball
            }, core, data, debug, state);

            console.debug('starting the viewer');
            startFunction();
        }, debug.isDebugging);

        console.debug('first render');
        // Do a first render of just static objects while waiting on server.
        cameraFunctions.startCamera();
        core.renderer.render(core.scene, core.camera);
    }

    return {
        startViewer: start
    }

// axis = new THREE.AxisHelper()
// scene.add(axis);
// orbit controls getCore
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

// OBJECTS //


// Car creation

// PARTICLE BOOST OPTIONS

});
