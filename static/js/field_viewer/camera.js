define(['three', 'viewerConstants'], function (THREE, constants) {

    const ASPECT_RATIO = 1.4;
    const CAMERA_DISTANCE = 5000.0;
    let angle = 50;
    let height_multiplier = 2;
    let multiplier = 2.5;

    function createCameraFunctions(camera) {
        function setOrthoView(camera) {
            // let w = FIELD_LENGTH * Math.cos(Math.PI / 4) + FIELD_WIDTH * Math.cos(Math.PI / 4);
            let h = constants.FIELD_LENGTH * Math.cos(Math.PI / 8) + constants.FIELD_HEIGHT;
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
            camera.position.set(0, 0, constants.FIELD_HEIGHT * 3);
            camera.lookAt(0, 0, 0)
        }

        function cameraSide() {
            camera.up = new THREE.Vector3(0, 0, 1);
            let x_multiplier = Math.cos(angle * Math.PI / 180);
            let y_multiplier = Math.sin(angle * Math.PI / 180);
            camera.position.set(CAMERA_DISTANCE * multiplier * x_multiplier, CAMERA_DISTANCE * multiplier * y_multiplier, CAMERA_DISTANCE * height_multiplier);
            camera.lookAt(-constants.FIELD_HEIGHT / 2 * x_multiplier, -constants.FIELD_HEIGHT / 2 * y_multiplier, 0);
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
            height_multiplier += .2;
            cameraSide();
        }

        function lowerCamera() {
            height_multiplier -= .2;
            cameraSide();
        }

        return {
            startCamera: function () {
                setOrthoView(camera);
                cameraSide();
            },
            setOrthoView: setOrthoView,
            cameraTop: cameraTop,
            cameraSide: cameraSide,
            rotateLeft: rotateLeft,
            rotateRight: rotateRight,
            raiseCamera: raiseCamera,
            lowerCamera: lowerCamera
        }
    }
    return {
        createCameraFunctions: createCameraFunctions
    }
});
