define(['three'], function (THREE) {
    function getCore(containerId) {
        let width = 800;
        let height = 450;
        let container = document.getElementById(containerId);

        let scene = new THREE.Scene();
        // let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
        let camera = new THREE.OrthographicCamera(200, -200, 200, -200, 1, 100000);
        camera.position.set(0, 0, 250);
        // 23, 15, 1
        // camera.rotation.set(Math.PI, 0, 0);
        let renderer = new THREE.WebGLRenderer({antialias: true});

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // window.innerHeight
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        function setSize(newWidth, newHeight) {
            width = newWidth;
            height = newHeight;
        }

        function getSize() {
            return {
                width: width,
                height: height
            };
        }

        return {
            scene: scene,
            camera: camera,
            renderer: renderer,
            container: container,
            setSize: setSize,
            getSize: getSize
        }
    }

    return {
        getCore: getCore
    }
});
