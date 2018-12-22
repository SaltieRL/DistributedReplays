import * as React from "react"
import { OBJLoader, Stats } from "src/lib"
import { FPSClock } from "src/Models"
import {
    AmbientLight,
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    AxesHelper,
    BoxBufferGeometry,
    DoubleSide,
    Euler,
    Group,
    HemisphereLight,
    LoadingManager,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Quaternion,
    QuaternionKeyframeTrack,
    Scene,
    SphereBufferGeometry,
    TextureLoader,
    Vector3,
    VectorKeyframeTrack,
    WebGLRenderer
} from "three"

export interface Props {
    replayData: ReplayDataResponse
    clock: FPSClock
}

interface FieldScene {
    scene: Scene
    camera: PerspectiveCamera
    ball: Mesh
    ground: Object3D
    players: Object3D[]
}

interface Animator {
    playerMixers: AnimationMixer[]
    playerActions: AnimationAction[]
    playerClips: AnimationClip[]
}

export class ThreeScene extends React.PureComponent<Props> {
    private loadingManager: LoadingManager
    private renderer: WebGLRenderer
    private mount: HTMLDivElement
    private hasStarted: boolean
    private readonly animator: Animator
    private readonly stats: Stats

    private readonly threeField: FieldScene

    constructor(props: Props) {
        super(props)
        this.threeField = {} as any
        const w = window as any
        w.field = this.threeField
        this.animator = {
            playerActions: [],
            playerClips: [],
            playerMixers: []
        }
        // TODO: REMOVE THIS IN PROD. DOCUMENT APPEND = BAD
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)
    }

    public componentDidMount() {
        this.loadingManager = new LoadingManager(this.start)
        this.loadingManager.onProgress = (item, loaded, total) => {
            console.log(item, loaded, total)
        }

        // Generate the lighting
        this.generateScene()

        // Add field
        this.generatePlayfield()

        // Add ball
        this.generateBall()

        // Add players
        this.generatePlayers(this.props.replayData.names)
        this.createAnimationClips()
    }

    public componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    public render() {
        return (
            <div style={{position: "relative"}}>
                <div
                    style={{width: "100%", height: "600px", margin: "auto"}}
                    ref={(mount) => {
                        if (mount) {
                            this.mount = mount
                        }
                    }}
                />
                <div style={{position: "absolute", top: "0", left: "0", margin: ".5rem"}}>
                    <button onClick={() => this.setCameraView(0)}>Orange Goal</button>
                    <button onClick={() => this.setCameraView(2)}>Mid Field</button>
                    <button onClick={() => this.setCameraView(1)}>Blue Goal</button>
                </div>
            </div>
        )
    }

    public readonly start = () => {
        console.log("Starting...")
        if (!this.hasStarted) {
            this.hasStarted = true
            for (let player = 0; player < this.animator.playerClips.length; player++) {
                const clip = this.animator.playerClips[player]
                const mixer = this.animator.playerMixers[player]
                const action = mixer.clipAction(clip)
                this.animator.playerActions[player] = action
                action.play()
            }
            (window as any).animator = this.animator
            this.props.clock.addCallback(this.animate)
        }
    }

    private readonly stop = () => {
        this.props.clock.pause()
    }

    private readonly animate = (frame: number) => {
        // console.log(frame)
        this.stats.begin()
        const delta = this.props.clock.getDelta()
        for (let player = 0; player < this.animator.playerClips.length; player++) {
            this.animator.playerMixers[player].update(delta)
        }
        this.updateCamera()
        // Paints the new scene
        this.renderScene()
        this.stats.end()
    }

    private readonly renderScene = () => {
        this.renderer.render(this.threeField.scene, this.threeField.camera)
    }

    private readonly generateScene = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        // Add scene
        this.threeField.scene = new Scene()

        // Add camera
        this.threeField.camera = new PerspectiveCamera(
            75,
            width / height,
            0.1,
            20000
        )

        // TODO: We are keeping these in window to discover better camera angles. This allows us to edit offsets
        // without reloading the page every time.
        this.setCameraView(0)
        const w = window as any
        w.camera = this.threeField.camera

        this.threeField.camera.rotation.x -= 7 * Math.PI / 180

        // Add renderer
        this.renderer = new WebGLRenderer({antialias: true})
        this.renderer.setClearColor("#000000")
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
    }

    private readonly generatePlayfield = () => {
        const field = this.threeField

        const geometry = new PlaneBufferGeometry(8192, 10240, 1, 1)
        const material = new MeshPhongMaterial({color: "#4CAF50"})
        field.ground = new Mesh(geometry, material)
        field.ground.rotation.x = -Math.PI / 2
        field.scene.add(field.ground)

        const goalPlane = new PlaneBufferGeometry(2000, 1284.5, 1, 1)
        const blueGoalMaterial = new MeshPhongMaterial({color: "#2196f3", side: DoubleSide,
            opacity: 0.3, transparent: true})
        const orangeGoalMaterial = new MeshPhongMaterial({color: "#ff9800", side: DoubleSide,
            opacity: 0.3, transparent: true})
        const blueGoal = new Mesh(goalPlane, blueGoalMaterial)
        blueGoal.position.z = -5120
        field.scene.add(blueGoal)
        const orangeGoal = new Mesh(goalPlane, orangeGoalMaterial)
        orangeGoal.position.z = 5120
        orangeGoal.rotation.y = Math.PI
        field.scene.add(orangeGoal)

        // Ambient light
        field.scene.add(new AmbientLight(0x444444))

        // Hemisphere light
        field.scene.add( new HemisphereLight( 0xffffbb, 0x080820, 1 ) )

        // const objLoader = new OBJLoader(this.loadingManager)
        // objLoader.load("/assets/Field2.obj", (arena: Group) => {
        //     const w = window as any
        //     w.arena = arena
        //     arena.scale.setScalar(1000)
        //     arena.rotation.set(0, Math.PI / 2, 0)
        //     this.threeField.scene.add(arena)
        // })

        // mtlLoader.load("/assets/Field2.mtl", (materials: any) => {
        //     const w = window as any
        //     w.materials = materials
        //     // materials.preload()
        //     // objLoader.setMaterials(materials)
        //     objLoader.load("/assets/Field2.obj", (field: Group) => {
        //             w.field = field
        //             this.scene.add(field)
        //         })
        // })
    }

    private readonly generateBall = () => {
        const field = this.threeField

        const ballGeometry = new SphereBufferGeometry(92.75, 32, 32)
        const ballMaterial = new MeshPhongMaterial()
        field.ball = new Mesh(ballGeometry, ballMaterial)
        field.ball.add(new AxesHelper(150))
        field.scene.add(field.ball)

        const loader = new TextureLoader(this.loadingManager)
        loader.load("/assets/test.jpg", (texture) => {
            ballMaterial.map = texture
        })
    }

    private readonly generatePlayers = (players: string[]) => {
        const field = this.threeField

        const loader = new OBJLoader(this.loadingManager)
        field.players = []
        loader.load("/assets/Octane2.obj", (octane: Group) => {
            const w = window as any
            w.car = octane
            octane.scale.setScalar(40) // TODO: This size is 20

            for (let i = 0; i < players.length; i++) {
                // const playerName = players[i]
                const carGeometry = new BoxBufferGeometry(84.2, 117, 36.16)
                const carColor = this.props.replayData.colors[i] ? "#ff9800" : "#2196f3"
                const carMaterial = new MeshPhongMaterial({color: i ? carColor : "#333333"})
                const player = i > 2 ? new Mesh(carGeometry, carMaterial) : octane.clone()
                // const player = octane.clone()
                player.name = players[i]
                player.add(new AxesHelper(20))

                if (this.props.replayData.names[i] === "Sciguymjm") {
                    w.player = player
                }

                field.scene.add(player)
                field.players.push(player)
                this.animator.playerMixers.push(new AnimationMixer(player))
            }
        })
    }

    private readonly createAnimationClips = () => {
        const dataToVector = (data: any[]) => {
            const x = data[0]
            const y = data[2]
            const z = data[1]
            return new Vector3(x, y, z)
        }
        const dataToQuaternion = (data: any[]) => {
            const q = new Quaternion()
            const x = -data[3]
            const y = -data[5]
            const z = -data[4]
            q.setFromEuler(new Euler(y, z, x, "YZX"))
            return q
        }

        for (let player = 0; player < this.props.replayData.players.length; player++) {
            const playerData = this.props.replayData.players[player]
            const positions: number[] = []
            const angles: number[] = []
            /**
             * We are calculating vector and quaternion times independently because there are often
             * cases where the data of a frame might coincide with the data of the next frame. The
             * replays may not contain data for every frame, so carball inserts the previous frame
             * data into the following frame as to avoid any missing frames. Here, we assume the
             * entire duration of that missing frame must be animated.
             *
             * For example, if a car's position at 1.1 seconds reads (45, 100, 500), at 1.2 seconds
             * reads (45, 100, 500), and at 1.3 seconds reads (50, 110, 400), we can assume the
             * middle frame was skipped and so we need to perform animation between 1.1 seconds and
             * 1.3 seconds instead of including the jitter of the car remaining in position from 1.1
             * seconds to 1.2 seconds.
             *
             * We perform the second duration vs. last frame calculation check because we considers
             * kickoffs as a valid reason to not treat the first position traveled to as a valid
             * three second animation. Otherwise, the car will slowly creep forward during kickoff.
             * A kickoff occurs for about three seconds, so 2.9 ensures we break off just before a
             * kickoff occurs.
             */
            let totalDuration = 0
            const vectorTimes: number[] = []
            const quatTimes: number[] = []
            let prevVector = new Vector3(0, 0, 0)
            let prevQuat = new Quaternion(0, 0, 0)
            playerData.forEach((data, index) => {
                const newVector = dataToVector(data)
                const lastVectorFrame = vectorTimes.length ? vectorTimes[vectorTimes.length - 1] : 0
                if (!newVector.equals(prevVector) || totalDuration - lastVectorFrame > 2.9) {
                    newVector.toArray(positions, positions.length)
                    vectorTimes.push(totalDuration)
                    prevVector = newVector
                }
                const newQuat = dataToQuaternion(data)
                const lastQuatFrame = quatTimes.length ? quatTimes[quatTimes.length - 1] : 0
                if (!newQuat.equals(prevQuat) || totalDuration - lastQuatFrame > 2.9) {
                    newQuat.toArray(angles, angles.length)
                    quatTimes.push(totalDuration)
                    prevQuat = newQuat
                }
                // Add the delta
                totalDuration += this.props.replayData.frames[index][0]
            })

            const playerName = `${this.props.replayData.names[player]}`

            const positionKeyframes = new VectorKeyframeTrack(`${playerName}.position`, vectorTimes, positions)
            const rotationKeyframes = new QuaternionKeyframeTrack(`${playerName}.quaternion`, quatTimes, angles)

            const clip = new AnimationClip(`${playerName}Action`, totalDuration, [positionKeyframes, rotationKeyframes])
            this.animator.playerClips.push(clip)
        }

    }

    // private readonly updateBall = () => {
    //     const ballPosition = this.props.replayData.ball[this.props.frame]
    //     this.setPositionAndRotation(ballPosition, this.threeField.ball as Object3D)
    // }

    // private readonly updatePlayers = () => {
    //     this.threeField.players.forEach((player: Group, i: number) => {
    //         const playerPosition = this.props.replayData.players[i][this.props.frame]
    //         this.setPositionAndRotation(playerPosition, player)
    //     })
    // }

    /**
     * Replay data is of this form:
     * [posX, posZ, posY, rotX, rotZ, royY]
     *
     * For parsed data information, see:
     * https://github.com/SaltieRL/carball/blob/master/carball/json_parser/actor_parsing.py#L107
     *
     * @param {ReplayDataResponse} data The [posX, posZ, posY, rotX, rotZ, royY] data to set the
     *                                  given object
     * @param {Object3D} object Three.JS object group to modify
     */
    // private readonly setPositionAndRotation = (data: number[], object: Object3D) => {
    //     object.position.x = data[0]
    //     object.position.y = data[2]
    //     object.position.z = data[1]

    //     // Three is RH as opposed to Unreal/Unity's LH axes and uses y as the up axis. All angles
    //     // are in the range -PI to PI.

    //     // On the AxesHelper:
    //     // X is red -- forward
    //     // Y is green -- up
    //     // Z is blue -- right

    //     const x = -data[3]
    //     const y = -data[5]
    //     const z = -data[4]
    //     object.setRotationFromEuler(new Euler(y, z, x, "YZX"))
    // }

    private readonly updateCamera = () => {
        this.threeField.camera.lookAt(this.threeField.ball.position)
    }

    private readonly setCameraView = (viewId: number) => {
        const field = this.threeField
        switch (viewId) {
            case 0:
                field.camera.position.z = 5750
                field.camera.position.y = 750
                break
            case 1:
                field.camera.position.z = -5750
                field.camera.position.y = 750
                break
            case 2:
                field.camera.position.z = 0
                field.camera.position.y = 750
                break
            default:
                throw new Error(`Unknown viewId: ${viewId}`)
        }
    }
}
