export class FPSClock {
    private readonly fps: number
    private lastDelta: number
    private startTime: number
    private stopped: number | null

    private lastFrame: number
    private callback?: (frame: number) => void

    constructor(framesPerSecond: number) {
        this.fps = framesPerSecond
        this.lastDelta = Date.now()
        this.startTime = Date.now()
        this.stopped = null
        this.lastFrame = 0
        requestAnimationFrame(this.update)
    }

    public setCallback(callback: (frame: number) => void) {
        this.callback = callback
    }

    public setFrame(frame: number) {
        this.startTime = Date.now() - (this.fps * frame)
        this.lastDelta = Date.now()
        this.lastFrame = frame
        if (this.callback) {
            this.callback(frame)
        }
    }

    public start() {
        this.resume()
        this.startTime = Date.now()
    }

    public resume() {
        if (this.stopped) {
            this.startTime = Date.now() - (this.fps * this.lastFrame)
        }
        requestAnimationFrame(this.update)
        this.stopped = null
    }

    public pause() {
        this.stop()
    }

    public stop() {
        cancelAnimationFrame(this.lastFrame)
        this.stopped = Date.now()
    }

    public getElapsedFrames() {
        const eTime = this.stopped || Date.now()
        return Math.round((eTime - this.startTime) / this.fps)
    }

    public getDelta() {
        const now = this.stopped || Date.now()
        const diff = now - this.lastDelta
        this.lastDelta = now
        return Math.round(diff / this.fps)
    }

    private readonly update = () => {
        if (this.callback && !this.stopped) {
            const now = Date.now()
            const diff = now - this.startTime
            const frames = Math.round(diff / this.fps)
            if (frames !== this.lastFrame) {
                this.callback(frames)
                this.lastFrame = frames
            }
        }
        requestAnimationFrame(this.update)
    }
}
