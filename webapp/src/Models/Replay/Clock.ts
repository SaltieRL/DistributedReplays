
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

    private lastDelta: number
    private startTime: number
    private stopped: number | null
    private animation: NodeJS.Timer | null
    private lastFrame: number
    private callback: ((frame: number) => void)[]

    constructor(frameToDuration: number[]) {
        this.frameToDuration = frameToDuration
        console.log(frameToDuration)
        this.lastDelta = this.getNow()
        this.startTime = this.getNow()
        this.stopped = null
        this.lastFrame = 0
        this.callback = []
        this.timeout()
    }

    public addCallback(callback: (frame: number) => void) {
        this.callback.push(callback)
    }

    public setFrame(frame: number) {
        const now = this.getNow()
        this.startTime = now - (this.frameToDuration[frame] * 1000)
        this.lastDelta = now - (this.frameToDuration[frame] - this.frameToDuration[this.lastFrame]) * 1000
        console.log(this.lastFrame, this.lastDelta)
        if (this.stopped) {
            this.stopped = now
        }
        this.lastFrame = frame
        for (const callback of this.callback) {
            callback(frame)
        }
    }

    public start() {
        this.resume()
        this.startTime = this.getNow()
    }

    public resume() {
        if (this.stopped) {
            const now = this.getNow()
            this.startTime = now - (this.frameToDuration[this.lastFrame] * 1000)
            this.lastDelta = now
        }
        this.stopped = null
        if (!this.timeout) {
            this.timeout()
        }
    }

    public pause() {
        if (!this.stopped) {
            this.stop()
        }
    }

    public stop() {
        if (this.animation) {
            clearTimeout(this.animation)
            this.animation = null
        }
        this.stopped = this.getNow()
    }

    public getElapsedTime() {
        const now = this.getNow()
        return now - this.startTime
    }

    public getElapsedFrames() {
        const eTime = this.stopped || this.getNow()
        // Time since beginning in seconds
        const diff = (eTime - this.startTime) / 1000
        let curFrame = this.frameToDuration[this.lastFrame] < diff ? this.lastFrame : 0
        while (this.frameToDuration[curFrame] < diff) {
            curFrame += 1
            if (curFrame >= this.frameToDuration.length - 1) {
                break
            }
        }
        return curFrame
    }

    /**
     * Returns the number of millseconds elapsed since the last time getDelta was called.
     *
     * @returns {number} milliseconds
     */
    public getDelta() {
        const now = this.stopped || this.getNow()
        const diff = now - this.lastDelta
        this.lastDelta = now
        return diff / 1000
    }

    private readonly update = () => {
        if (this.callback && !this.stopped) {
            const frames = this.getElapsedFrames()
            if (frames !== this.lastFrame) {
                for (const callback of this.callback) {
                    callback(frames)
                }
                this.lastFrame = frames
            }
        }
        this.timeout()
    }

    private getNow() {
        return performance.now()
    }

    private timeout() {
        this.animation = setTimeout(this.update, this.frameToDuration[this.lastFrame])
    }
}
