import * as React from "react"
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
import { OBJLoader } from "../../../lib/OBJLoader"

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
    private animator: Animator

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
        const delta = this.props.clock.getDelta()
        for (let player = 0; player < this.animator.playerClips.length; player++) {
            this.animator.playerMixers[player].update(delta)
        }
        this.updateCamera()
        // Paints the new scene
        this.renderScene()
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
        const dataToVector = (data: number[]) => {
            const x = data[0]
            const y = data[2]
            const z = data[1]
            return new Vector3(x, y, z)
        }
        const dataToQuaternion = (data: number[]) => {
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
            playerData.forEach((data: number[]) => {
                dataToVector(data).toArray(positions, positions.length)
                dataToQuaternion(data).toArray(angles, angles.length)
            })

            // Calculates the elapsed duration of each frame as an array
            let totalDuration = 0
            const times = this.props.replayData.frames.map((frameData: number[]) => {
                const dur = totalDuration
                // Add the delta
                totalDuration += frameData[0]
                return dur
            })

            const playerName = `${this.props.replayData.names[player]}`

            const positionKeyframes = new VectorKeyframeTrack(`${playerName}.position`, times, positions)
            const rotationKeyframes = new QuaternionKeyframeTrack(`${playerName}.quaternion`, times, angles)

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
