define(['three'], function (THREE) {
    let options = {
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

    let spawnerOptions = {
        spawnRate: 2000,
        horizontalSpeed: 1.5,
        verticalSpeed: 0,
        timeScale: 1
    };

    function project(camera, size, x, y, z) {
        let wh = size.width / 2;
        let hh = size.height / 2;
        let pos = new THREE.Vector3(x, y, z);
        pos.project(camera);
        return [pos.x * wh + wh - 10, -(pos.y * hh) + hh];
    }

    function startAnimation(objects, core, data, debug, state) {

        // CONSTANTS
        const ball = data['ball'];
        const players = data['players'];
        const frames = data['frames'];
        const num_players = players.length;
        const cars = objects.cars;
        const boosts = objects.boosts;
        const names = objects.names;
        const ball_obj = objects.ball;

        const clock = new THREE.Clock(true);
        let current_frame = 0;
        const clock_offset = frames[current_frame][2];
        const ratio = 0.5;
        let xs = {};
        let tick = 0;

        function animate() {
           debug.stats.begin();
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
               // console.log(pitch.toFixed(5), yaw.toFixed(5), roll.toFixed(5))
               let zyx = new THREE.Euler(roll, pitch, yaw, "ZYX");
               cars[i].setRotationFromEuler(zyx);
               // cars[i].rotateX(r_f(rot, rot_next, 0));
               // cars[i].rotateY(r_f(rot, rot_next, 1));
               // cars[i].rotateZ(r_f(rot, rot_next, 2));
               // TODO: y rotation is broken (seems like there is some sort of relationship between them that is not working)
               // cars[i].rotation.set(rot_x, rot_y, rot_z);
               let pos = project(core.camera, core.getSize(), x_t, y_t, z_t + 40);
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
                   options.position.x = 0; //-3 - Math.sin(tick * spawnerOptions.horizontalSpeed);
                   options.position.y = 0; //Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
                   options.position.z = 0; //Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
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

           core.renderer.render(core.scene, core.camera);

           debug.stats.end();
           if (debug.isDebugging) {
               debug.fps.innerText = current_frame.toString();
           }
           if (state.playing) {
               requestAnimationFrame(animate);
           }
       }

        return function () {
            clock.start();
            animate();
        }
   }
   return {
        startAnimation: startAnimation
   }
});
