
/**
 * This clock provides a simple callback system that keeps track of elapsed and delta time
 * transformations. This makes it extremely easy to parse the deltas of a replay by their frame
 * count, and maintain a real-time comparison against those frames. Primarily to be used by the
 * THREE.js animation system and communicate changes back to the parent container of animations so
 * that we can display data which is recorded at a frame and not at a time.
 *
 * When constructing this object, you should provide an array of elapsed durations*1000, where each
 * index in the array represents the time in milliseconds since the beginning of the animation. The
 * first index, 0, should be set to 0 (the elapsed time since the start), followed by these times.
 *
 * For example:
 * 0: 0
 * 1: 483.877919614315
 * 2: 838.5848999023438
 * 3: 1322.4628567695618
 * 4: 1809.6305429935455
 */
export class FPSClock {
    /**
     * Note that the final frame is ignored when considering the elapsed time per frame. If we
     * considered this final delta, we would need a frame to "animate to".
     *
     * @param data Contains frame delta information
     */
    public static convertReplayToClock(data: ReplayDataResponse) {
        let elapsedTime = 0
        const frames = data.frames.map((frameInfo: number[]) => {
            const retValue = elapsedTime
            const delta = frameInfo[0] * 1000
            elapsedTime += delta
            return retValue
        })
        return new FPSClock(frames)
    }

    // Used to play "catch-up" in the delta function
    public currentFrame: number
    // private lastFrame: number

    private lastTime: number
    private started: number

    // Represented as an index in the array to the elapsed time at that frame
    private readonly frameToDuration: number[]

    private paused: boolean
    private animation: NodeJS.Timer
    private readonly callback: ((frame: number) => void)[]

    constructor(frameToDuration: number[]) {
        this.frameToDuration = frameToDuration
        this.paused = true
        this.currentFrame = 0
        this.lastTime = 0
        this.callback = []
        this.timeout(!this.paused)
    }

    public addCallback(callback: (frame: number) => void) {
        this.callback.push(callback)
    }

    public setFrame(frame: number) {
        // Prevent negative frames
        frame = frame < 0 ? 0 : frame
        // Get that "little bit" of real time beyond the frame's saved time
        const littleDiff = this.lastTime - this.started - (this.frameToDuration[this.currentFrame])
        const frameDiff = this.frameToDuration[this.currentFrame] - this.frameToDuration[frame]
        console.log(littleDiff)
        // A lower frame means the animation needs to roll back, so the last time will become
        // greater than current time, and thus the delta is negative
        this.lastTime = performance.now() + frameDiff
        this.started = this.lastTime - this.frameToDuration[frame] - littleDiff
        this.currentFrame = frame
        this.doCallbacks()
    }

    public play() {
        if (this.paused) {
            // First, find out how much "true time" has elapsed while paused
            const now = performance.now()
            const diff = this.lastTime - this.started
            this.lastTime = now
            this.started = now - diff
            this.paused = false
            this.timeout()
        }
    }

    public pause() {
        this.paused = true
        this.timeout(false)
    }

    public getElapsedTime() {
        return (this.lastTime - this.started) / 1000
    }

    /**
     * Returns the number of seconds elapsed since the last time getDelta was called. Note that
     * this may not be the true time since getDelta was called but this is the elapsed "frame time",
     * that is, the elapsed time relative to the number of frames that have passed since last
     * calling this method.
     *
     * @returns {number} seconds
     */
    public getDelta(): number {
        const now = performance.now()
        if (!this.lastTime) {
            this.lastTime = now
        }
        const last = this.lastTime
        this.lastTime = now
        console.log("delta:", (now - last) / 1000)
        return (now - last) / 1000
    }

    private readonly update = () => {
        if (!this.paused) {
            if (!this.started) {
                this.started = this.lastTime
            }
            this.getElapsedFrames()
            this.doCallbacks()
        }
    }

    private getElapsedFrames() {
        const now = performance.now()
        const secondsElapsed = (now - this.started)
        while (this.frameToDuration[this.currentFrame + 1] < secondsElapsed) {
            this.currentFrame += 1
        }
    }

    private doCallbacks() {
        for (const callback of this.callback) {
            callback(this.currentFrame)
        }
    }

    private timeout(enable: boolean = true) {
        if (enable) {
            this.animation = setInterval(this.update, 1000 / 60)
        } else {
            clearInterval(this.animation)
        }
    }
}
