
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
    // Used only to keep track of the elapsed time between getDelta calls
    private lastDelta: number
    // Stores a queue of deltas that get applied and returned by getDelta. See getDelta for why
    private readonly deltaQueue: number[]
    // Used only to determine which frame we should be on during updates
    private elapsedTime: number

    // Represented as an index in the array to the elapsed time at that frame
    private readonly frameToDuration: number[]

    private paused: boolean
    private animation: NodeJS.Timer
    private readonly callback: ((frame: number) => void)[]

    constructor(frameToDuration: number[]) {
        this.frameToDuration = frameToDuration
        this.paused = true
        this.callback = []
        this.deltaQueue = []
        this.elapsedTime = 0
        this.currentFrame = 0
        this.timeout()
    }

    public addCallback(callback: (frame: number) => void) {
        this.callback.push(callback)
    }

    public setFrame(frame: number) {
        // Prevent negative frames
        frame = frame < 0 ? 0 : frame
        const diff = this.frameToDuration[frame] - this.frameToDuration[this.currentFrame]
        this.deltaQueue.push(diff)
        this.currentFrame = frame
        this.doCallbacks()
    }

    public play() {
        if (this.paused) {
            this.lastDelta = performance.now()
            this.paused = false
            this.timeout()
        }
    }

    public pause() {
        this.paused = true
        this.timeout(false)
    }

    /**
     * Returns the number of seconds elapsed since the last time getDelta was called. This function
     * uses a combination of the performance.now() functionality when animations are rolling,
     * combined with a small queue of delta modifications made by the setFrame function. This will
     * allow us to apply delta factors quite easily and in one spot (i.e. 2x speed) as opposed to
     * scattering arithmetic throughout the code.
     *
     * @returns {number} seconds
     */
    public getDelta(): number {
        const now = performance.now()
        // Initialize empty delta
        if (!this.lastDelta) {
            this.lastDelta = now
        }
        // Only apply "now" when not paused
        if (!this.paused) {
            this.deltaQueue.push(now - this.lastDelta)
        }
        this.lastDelta = now
        // Process every delta contributer
        let delta = 0
        while (this.deltaQueue.length) {
            const time = this.deltaQueue.pop()
            if (time) {
                delta += time
            }
        }
        // Use the elapsed deltas for bookkeeping
        this.elapsedTime += delta
        return delta / 1000
    }

    private readonly update = () => {
        if (!this.paused) {
            this.getElapsedFrames()
            this.doCallbacks()
        }
    }

    private getElapsedFrames() {
        if (this.frameToDuration[this.currentFrame] >= this.elapsedTime) {
            this.currentFrame = 0
        }
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
