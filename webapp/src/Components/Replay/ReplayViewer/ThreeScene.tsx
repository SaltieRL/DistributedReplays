import * as React from "react"
import { MTLLoader, OBJLoader, Stats } from "src/lib"
import { FPSClock } from "src/Models"
import { isDevelopment } from "src/Utils"
import {
    AmbientLight,
    AxesHelper,
    BackSide,
    BoxBufferGeometry,
    DoubleSide,
    Group,
    HemisphereLight,
    LinearMipMapLinearFilter,
    LoadingManager,
    Mesh,
    MeshNormalMaterial,
    MeshPhongMaterial,
    NearestFilter,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Scene,
    Sprite,
    SpriteMaterial,
    Texture,
    WebGLRenderer
} from "three"
import { BALL_NAME, CAR_SUFFIX, ThreeHelper } from "./ThreeHelper"

export interface Props {
    replayData: ReplayDataResponse
    clock: FPSClock
}

interface FieldScene {
    scene: Scene
    camera: PerspectiveCamera
    ball: Object3D
    ground: Object3D
    players: Object3D[]
}

export class ThreeScene extends React.PureComponent<Props> {
    private loadingManager: LoadingManager
    private renderer: WebGLRenderer
    private mount: HTMLDivElement
    private stats: Stats | null
    private hasStarted: boolean
    private readonly helper: ThreeHelper
    private readonly threeField: FieldScene

    constructor(props: Props) {
        super(props)
        this.helper = new ThreeHelper(props.replayData)
        this.threeField = {} as any
        this.addToWindow(this.threeField, "field")
    }

    public componentDidMount() {
        this.loadingManager = new LoadingManager(this.start)
        this.loadingManager.onProgress = (item, loaded, total) => {
            // TODO: Show loader animation that prints what is getting loaded and progress
            // console.log(item, loaded, total)
        }

        // Generate the lighting
        this.generateScene()
        window.addEventListener("resize", this.updateSize)

        // Add field
        this.generatePlayfield()

        // Add ball
        this.generateBall()

        // Add players
        this.generatePlayers(this.props.replayData.names)

        // Logs framerate
        if (isDevelopment()) {
            this.stats = new Stats()
            this.stats.showPanel(0)
            this.mount.appendChild(this.stats.dom)
        }
    }

    public componentWillUnmount() {
        this.stop()
        if (this.stats) {
            this.mount.removeChild(this.stats.dom)
        }
        this.mount.removeChild(this.renderer.domElement)
        window.removeEventListener("resize", this.updateSize)
    }

    public render() {
        return (
            <div style={{ position: "relative" }}>
                <div
                    style={{ width: "100%", height: "600px", margin: "auto" }}
                    ref={(mount) => {
                        if (mount) {
                            this.mount = mount
                        }
                    }}
                />
                <div style={{ position: "absolute", top: "0", left: "0", margin: ".5rem" }}>
                    <button onClick={() => this.setCameraView(0)}>Orange Goal</button>
                    <button onClick={() => this.setCameraView(2)}>Mid Field</button>
                    <button onClick={() => this.setCameraView(1)}>Blue Goal</button>
                </div>
            </div>
        )
    }

    public readonly start = () => {
        if (!this.hasStarted) {
            this.hasStarted = true
            this.helper.playAnimationClips()
            // Store the updater function as a callback
            this.props.clock.addCallback(this.animate)
        }
        // Render the field
        this.animate(0)
    }

    private readonly stop = () => {
        this.props.clock.pause()
    }

    /**
     * Called with a frame number from the FPSClock.
     */
    private readonly animate = (_: number) => {
        if (this.stats) {
            this.stats.begin()
        }
        // Send delta to the helper for clip position updates
        const delta = this.props.clock.getDelta()
        this.helper.updateAnimationClips(delta)
        // Point the camera
        this.updateCamera()
        // Paints the new scene
        this.renderScene()
        if (this.stats) {
            this.stats.end()
        }
    }

    private readonly renderScene = () => {
        this.renderer.render(this.threeField.scene, this.threeField.camera)
    }

    /**
     * Should be called whenever the canvas dimensions are changed (i.e. window resize).
     */
    private readonly updateSize = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        this.threeField.camera.aspect = width / height
        this.threeField.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.renderScene()
    }

    private readonly generateScene = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        // Add scene
        this.threeField.scene = new Scene()

        // Add camera
        this.threeField.camera = new PerspectiveCamera(75, width / height, 0.1, 20000)
        this.setCameraView(0)
        this.addToWindow(this.threeField.camera, "camera")
        this.threeField.camera.rotation.x -= (7 * Math.PI) / 180

        // Add renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setClearColor("#000000")
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
    }

    private readonly generatePlayfield = () => {
        const field = this.threeField

        // Add green ground. TODO: Replace with field model
        const geometry = new PlaneBufferGeometry(8192, 10240, 1, 1)
        const material = new MeshPhongMaterial({ color: "#4CAF50" })
        field.ground = new Mesh(geometry, material)
        field.ground.rotation.x = -Math.PI / 2
        field.scene.add(field.ground)

        // Add goals. TODO: Replace with field model
        const goalPlane = new PlaneBufferGeometry(2000, 1284.5, 1, 1)
        const blueGoalMaterial = new MeshPhongMaterial({
            color: "#2196f3",
            side: DoubleSide,
            opacity: 0.3,
            transparent: true
        })
        const orangeGoalMaterial = new MeshPhongMaterial({
            color: "#ff9800",
            side: DoubleSide,
            opacity: 0.3,
            transparent: true
        })
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
        field.scene.add(new HemisphereLight(0xffffbb, 0x080820, 1))

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
        const materialLoader = new MTLLoader(this.loadingManager)
        materialLoader.setPath("/assets/")
        materialLoader.setMaterialOptions({side: BackSide})
        materialLoader.load("Ball.mtl", (mtlc) => {
            const objectLoader = new OBJLoader(this.loadingManager)
            objectLoader.setMaterials(mtlc)
            objectLoader.load("/assets/Ball.obj", (ball: Object3D) => {
                ball.name = BALL_NAME
                ball.scale.setScalar(92.75)
                ball.add(new AxesHelper(5))
                this.helper.addBallMixer(ball)
                field.ball = ball
                field.scene.add(ball)
            })
        })
    }

    private readonly generatePlayers = (players: string[]) => {
        const field = this.threeField
        field.players = []

        const generatePlayernameSprite = (name: string, orangeTeam: boolean) => {
            // All nametag names are uppercase
            name = name.toUpperCase()

            const border = 10
            const fontSize = 60
            const canvasSize = 480
            const canvas = document.createElement("canvas")
            canvas.width = 512
            canvas.height = canvas.width
            const context = canvas.getContext("2d")

            // Rectangle prototyping
            const roundRect = (
                ct: CanvasRenderingContext2D,
                x: number,
                y: number,
                w: number,
                h: number,
                radius: number
            ) => {
                if (w > h) {
                    radius = h / 2
                } else {
                    radius = w / 2
                }
                ct.beginPath()
                ct.moveTo(x + radius, y)
                ct.arcTo(x + w, y, x + w, y + h, radius)
                ct.arcTo(x + w, y + h, x, y + h, radius)
                ct.arcTo(x, y + h, x, y, radius)
                ct.arcTo(x, y, x + w, y, radius)
                ct.closePath()
                return ct
            }

            if (context) {
                context.font = `bold ${fontSize}px Arial`
                context.fillStyle = orangeTeam ? "#ff9800" : "#2196f3"
                roundRect(context, border, border, canvasSize, fontSize + border * 2, fontSize * 2).fill()
                context.strokeStyle = "#eee"
                context.lineWidth = border
                roundRect(context, border, border, canvasSize, fontSize + border * 2, fontSize * 2).stroke()
                context.fillStyle = "#fff"
                const measure = context.measureText(name)
                const padding = border / 2 + fontSize / 2
                const maxWidth = canvasSize - padding * 2
                const width = maxWidth > measure.width ? measure.width : maxWidth
                const x = canvasSize / 2 + border / 2 - width / 2
                context.fillText(name, x, fontSize + border, maxWidth)
            }

            const texture = new Texture(canvas)
            texture.needsUpdate = true
            texture.magFilter = NearestFilter
            texture.minFilter = LinearMipMapLinearFilter
            const spriteMaterial = new SpriteMaterial({
                map: texture
            })
            const sprite = new Sprite(spriteMaterial)
            return sprite
        }

        const materialLoader = new MTLLoader(this.loadingManager)
        materialLoader.load("/assets/Octane.mtl", (mtlc) => {
            const objectLoader = new OBJLoader(this.loadingManager)
            objectLoader.setMaterials(mtlc)
            objectLoader.load("/assets/Octane.obj", (octane: Group) => {
                this.addToWindow(octane, "car")
                octane.scale.setScalar(40) // TODO: This size is 20
                const chassis = (octane.children[0] as Mesh).material[1] as MeshPhongMaterial
                chassis.color.setHex(0x555555)

                for (let i = 0; i < players.length; i++) {
                    // Clone the octane and rename it to the player
                    const playerMesh = octane.clone(true)
                    playerMesh.name = `${players[i]}${CAR_SUFFIX}`
                    // Grab the existing car mesh
                    const mesh = playerMesh.children[0] as Mesh
                    // Clone all materials
                    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                    mesh.material = materials.map((material) => material.clone())
                    mesh.name = `${players[i]}-main-mesh`
                    // The top half of the car
                    const body = mesh.material[0] as MeshPhongMaterial
                    body.name = `${players[i]}-body`
                    // 0xff9800 is orange, 0x2196f3 is blue
                    const carColor = this.props.replayData.colors[i] ? 0xff9800 : 0x2196f3
                    body.color.setHex(carColor)

                    const player = new Group()
                    player.name = players[i]
                    player.add(playerMesh)

                    const indicator = new Mesh(
                        new BoxBufferGeometry(30, 30, 100),
                        new MeshNormalMaterial()
                    )
                    indicator.position.y = -200
                    player.add(indicator)
                    // Add nametag
                    const nametag = generatePlayernameSprite(players[i], this.props.replayData.colors[i])
                    nametag.scale.setScalar(600)
                    player.add(nametag)

                    // Debugging
                    player.add(new AxesHelper(5))
                    if (this.props.replayData.names[i] === "Sciguymjm") {
                        this.addToWindow(player, "player")
                    }

                    field.scene.add(player)
                    field.players.push(player)
                    this.helper.addPlayerMixer(player)
                }
            })
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

    private readonly addToWindow = (object: any, name: string) => {
        const w = window as any
        w[name] = object
    }
}
