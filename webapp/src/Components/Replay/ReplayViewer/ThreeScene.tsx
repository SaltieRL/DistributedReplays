import * as React from "react"

import {
    AmbientLight,
    AxesHelper,
    BoxBufferGeometry,
    DoubleSide,
    Group,
    HemisphereLight,
    LoadingManager,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Scene,
    SphereBufferGeometry,
    TextureLoader,
    WebGLRenderer
} from "three"

import { OBJLoader } from "../../../lib/OBJLoader"

export interface Props {
    replayData: ReplayDataResponse
    frame: number
    play: boolean
}

interface FieldScene {
    scene: Scene
    camera: PerspectiveCamera
    ball: Mesh
    ground: Object3D
    players: Object3D[]
}

export class ThreeScene extends React.PureComponent<Props> {
    private loadingManager: LoadingManager
    private renderer: WebGLRenderer
    private mount: HTMLDivElement
    private hasStarted: boolean

    private readonly threeField: FieldScene

    constructor(props: Props) {
        super(props)
        this.threeField = {} as any
        const w = window as any
        w.field = this.threeField
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
            requestAnimationFrame(this.animate)
        }
    }

    private readonly stop = () => {
        cancelAnimationFrame(0)
    }

    private readonly animate = () => {
        this.updateBall()
        this.updatePlayers()
        this.updateCamera()
        // Paints the new scene
        this.renderScene()
        // This callback similar to using a setTimeout function
        requestAnimationFrame(this.animate)
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
            octane.scale.setScalar(80) // TODO: This size is 20

            for (let i = 0; i < players.length; i++) {
                // const playerName = players[i]
                const carGeometry = new BoxBufferGeometry(84.2, 117, 36.16)
                const carColor = this.props.replayData.colors[i] ? "#ff9800" : "#2196f3"
                const carMaterial = new MeshPhongMaterial({color: i ? carColor : "#333333"})
                const player = i > 2 ? new Mesh(carGeometry, carMaterial) : octane.clone()
                // const player = octane.clone()
                player.name = players[i]
                player.add(new AxesHelper(2))

                field.scene.add(player)
                field.players.push(player)
            }
        })
    }

    private readonly updateBall = () => {
        const field = this.threeField

        const ballPosition = this.props.replayData.ball[this.props.frame]
        field.ball.position.x = ballPosition[0]
        field.ball.position.y = ballPosition[2]
        field.ball.position.z = ballPosition[1]

        field.ball.rotation.x = ballPosition[3]
        field.ball.rotation.y = ballPosition[4]
        field.ball.rotation.z = ballPosition[5]
    }

    private readonly updatePlayers = () => {
        this.threeField.players.forEach((player: any, i: number) => {
            const playerPosition = this.props.replayData.players[i][this.props.frame]
            if (i === 1) {
                console.log(playerPosition)
            }

            player.position.x = playerPosition[0]
            player.position.y = playerPosition[2]
            player.position.z = playerPosition[1]

            player.rotation.x = -playerPosition[5]
            player.rotation.y = -playerPosition[4]
            player.rotation.z = playerPosition[3]
        })
    }

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
