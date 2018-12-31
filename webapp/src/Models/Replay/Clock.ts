
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

    public currentFrame: number
    private startTime: number
    // Both represent the elapsed amount of time. The lastDelta field follows the elapsedTime field
    // so that each call to getDelta is always accurate
    private elapsedTime: number
    private lastDelta: number

    // Represented as an index in the array to the elapsed time at that frame
    private readonly frameToDuration: number[]

    private paused: boolean
    private animation: NodeJS.Timer
    private readonly callback: ((frame: number) => void)[]

    constructor(frameToDuration: number[]) {
        this.frameToDuration = frameToDuration
        this.paused = true
        this.callback = []
        this.currentFrame = 0
        this.elapsedTime = this.lastDelta = 0
        this.timeout()
    }

    public addCallback(callback: (frame: number) => void) {
        this.callback.push(callback)
    }

    public setFrame(frame: number) {
        // Prevent negative frames
        frame = frame < 0 ? 0 : frame
        const diff = this.frameToDuration[frame] - this.frameToDuration[this.currentFrame]
        this.startTime += diff
        this.elapsedTime = (performance.now() - this.startTime)
        this.currentFrame = frame
        this.doCallbacks()
    }

    public play() {
        if (this.paused) {
            this.startTime = performance.now() - this.elapsedTime
            this.paused = false
            this.timeout()
        }
    }

    public pause() {
        this.paused = true
        this.timeout(false)
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
        const now = this.elapsedTime
        const last = this.lastDelta
        this.lastDelta = now
        const delta = now - last
        console.log("delta:", delta)
        return delta / 1000
    }

    private readonly update = () => {
        if (!this.paused) {
            this.getElapsedFrames()
            this.doCallbacks()
        }
    }

    private getElapsedFrames() {
        this.elapsedTime = (performance.now() - this.startTime)
        while (this.frameToDuration[this.currentFrame + 1] < this.elapsedTime) {
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
