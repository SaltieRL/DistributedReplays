import * as React from "react"
import {
    AmbientLight,
    AxesHelper,
    BoxBufferGeometry,
    DoubleSide,
    HemisphereLight,
    LoadingManager,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Scene,
    SphereBufferGeometry,
    TextureLoader,
    WebGLRenderer,
  } from "three"

export interface Props {
    replayData: any
    frame: any
}

export class ThreeScene extends React.PureComponent<Props> {
    private loadingManager: LoadingManager
    private renderer: any
    private mount: any
    private frameId: any
    private scene: any
    private camera: any
    private ball: any
    private cube: any
    private players: any

    constructor(props: any) {
        super(props)  // Don't think this is needed if not using state.
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
                        this.mount = mount
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
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    public readonly stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    public readonly animate = () => {
        this.updateBall()
        this.updatePlayers()
        this.updateCamera()

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    private readonly renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }

    private readonly generateScene = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        // Add scene
        this.scene = new Scene()

        // Add camera
        this.camera = new PerspectiveCamera(
            75,
            width / height,
            0.1,
            20000
        )
        // TODO: Fix
        this.setCameraView(0)

        this.camera.rotation.x -= 7 * Math.PI / 180

        // Add renderer
        this.renderer = new WebGLRenderer({antialias: true})
        this.renderer.setClearColor("#000000")
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
    }

    private readonly generatePlayfield = () => {
        const geometry = new PlaneBufferGeometry(8192, 10240, 1, 1)
        const material = new MeshBasicMaterial({color: "#4CAF50"})
        this.cube = new Mesh(geometry, material)
        this.cube.rotation.x = -Math.PI / 2
        this.scene.add(this.cube)

        const goalPlane = new PlaneBufferGeometry(1786, 642.775, 1, 1)
        const blueGoalMaterial = new MeshBasicMaterial({color: "#2196f3", side: DoubleSide})
        const orangeGoalMaterial = new MeshBasicMaterial({color: "#ff9800", side: DoubleSide})
        const blueGoal = new Mesh(goalPlane, blueGoalMaterial)
        blueGoal.position.z = -5120
        this.scene.add(blueGoal)
        const orangeGoal = new Mesh(goalPlane, orangeGoalMaterial)
        orangeGoal.position.z = 5120
        orangeGoal.rotation.y = Math.PI
        this.scene.add(orangeGoal)

        // Ambient light
        this.scene.add(new AmbientLight(0x444444))

        // Hemisphere light
        this.scene.add( new HemisphereLight( 0xffffbb, 0x080820, 1 ) )
    }

    private readonly generateBall = () => {
        const ballGeometry = new SphereBufferGeometry(92.75, 32, 32)
        const ballMaterial = new MeshBasicMaterial()
        this.ball = new Mesh(ballGeometry, ballMaterial)
        this.ball.add(new AxesHelper(150))
        this.scene.add(this.ball)

        const loader = new TextureLoader(this.loadingManager)
        loader.load("/assets/test.jpg", (texture) => {
            ballMaterial.map = texture
        })
    }

    private readonly generatePlayers = (players: string[]) => {
        this.players = []
        for (let i = 0; i < players.length; i++) {
            // const playerName = players[i]

            const carGeometry = new BoxBufferGeometry(84.2, 117, 36.16)
            const carColor = this.props.replayData.colors[i] ? "#ff9800": "#2196f3"
            const carMaterial = new MeshBasicMaterial({color: carColor})
            const player = new Mesh(carGeometry, carMaterial)
            player.add(new AxesHelper(150))

            this.scene.add(player)
            this.players.push(player)
        }
    }

    private readonly updateBall = () => {
        const ballPosition = this.props.replayData.ball[this.props.frame]
        this.ball.position.x = ballPosition[0]
        this.ball.position.y = ballPosition[2]
        this.ball.position.z = ballPosition[1]

        this.ball.rotation.x = ballPosition[3]
        this.ball.rotation.y = ballPosition[4]
        this.ball.rotation.z = ballPosition[5]
    }

    private readonly updatePlayers = () => {
        this.players.forEach((player: any, i: number) => {
            const playerPosition = this.props.replayData.players[i][this.props.frame]

            player.position.x = playerPosition[0]
            player.position.y = playerPosition[2]
            player.position.z = playerPosition[1]

            player.rotation.x = playerPosition[3]
            player.rotation.y = playerPosition[4]
            player.rotation.z = playerPosition[5]
        })
    }

    private readonly updateCamera = () => {
        this.camera.lookAt(this.ball.position)
    }

    private readonly setCameraView = (viewId: number) => {
        switch (viewId) {
            case 0:
                this.camera.position.z = 4200
                this.camera.position.y = 300
                break
            case 1:
                this.camera.position.z = -4200
                this.camera.position.y = 300
                break
            case 2:
                this.camera.position.z = 0
                this.camera.position.y = 750
                break
            default:
                throw new Error(`Unknown viewId: ${viewId}`)
        }
    }
}
