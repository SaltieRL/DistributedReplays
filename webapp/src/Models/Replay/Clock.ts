
/**
 * This clock provides a simple callback system that keeps track of elapsed and delta time
 * transformations. This makes it extremely easy to parse the deltas of a replay by their frame
 * count, and maintain a real-time comparison against those frames. Primarily to be used by the
 * THREE.js animation system and communicate changes back to the parent container of animations so
 * that we can display data which is recorded at a frame and not at a time.
 *
 * When constructing this object, you should provide an array of elapsed durations, where each
 * index in the array represents the time since the beginning of the animation. The first index, 0,
 * should be set to 0 (the elapsed time since the start), followed by these times. For example:
 * 0: 0
 * 1: 0.0483877919614315
 * 2: 0.08385848999023438
 * 3: 0.13224628567695618
 * 4: 0.18096305429935455
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
            const delta = frameInfo[0]
            elapsedTime += delta
            return retValue
        })
        return new FPSClock(frames)
    }

    // Represented as an index in the array to the elapsed time at that frame
    private readonly frameToDuration: number[]

    // Used to play "catch-up" in the delta function
    private lastFrame: number
    private currentFrame: number
    private started: number

    private paused: boolean
    private animation: NodeJS.Timer
    private readonly callback: ((frame: number) => void)[]

    constructor(frameToDuration: number[]) {
        this.frameToDuration = frameToDuration
        this.paused = true
        this.started = performance.now()
        this.lastFrame = this.currentFrame = 0
        this.callback = []
        this.timeout()
    }

    public addCallback(callback: (frame: number) => void) {
        this.callback.push(callback)
    }

    public setFrame(frame: number) {
        this.currentFrame = frame
        this.started = performance.now() - (this.frameToDuration[this.currentFrame] * 1000)
        for (const callback of this.callback) {
            callback(frame)
        }
    }

    public play() {
        if (this.paused) {
            this.started = performance.now() - (this.frameToDuration[this.currentFrame] * 1000)
            this.paused = false
            this.timeout()
        }
    }

    public pause() {
        this.paused = true
        this.timeout(false)
    }

    /**
     * Returns the number of millseconds elapsed since the last time getDelta was called. Note that
     * this may not be the true time since getDelta was called but this is the elapsed "frame time",
     * that is, the elapsed time relative to the number of frames that have passed since last
     * calling this method.
     *
     * @returns {number} milliseconds
     */
    public getDelta(): number {
        const now = this.frameToDuration[this.currentFrame]
        const last = this.frameToDuration[this.lastFrame]
        this.lastFrame = this.currentFrame
        return now - last
    }

    private readonly update = () => {
        if (!this.paused) {
            this.getElapsedFrames()
            for (const callback of this.callback) {
                callback(this.currentFrame)
            }
        }
    }

    private getElapsedFrames() {
        const now = performance.now()
        const elapsed = (now - this.started) / 1000
        while (this.frameToDuration[this.currentFrame + 1] < elapsed) {
            this.currentFrame += 1
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
