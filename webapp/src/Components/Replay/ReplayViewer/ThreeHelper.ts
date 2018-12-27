import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    Euler,
    Quaternion,
    QuaternionKeyframeTrack,
    Vector3,
    VectorKeyframeTrack
} from "three"

interface Animator {
    playerMixers: AnimationMixer[]
    playerActions: AnimationAction[]
    playerClips: AnimationClip[]
    ballMixer: AnimationMixer
    ballAction: AnimationAction
    ballClip: AnimationClip
}

interface KeyframeData {
    duration: number
    positionValues: number[]
    positionTimes: number[]
    rotationValues: number[]
    rotationTimes: number[]
}

export const BALL_NAME = "ball"
export const CAR_SUFFIX = "-car"

/**
 * Class is responsible for all position and rotation-based updating of models that occur inside
 * the three.js scene. Builds animation mixers that are used to display animations but do not
 * directly interact with the models themselves outside of the required naming conventions that
 * keyframe tracks provide.
 */
export class ThreeHelper {
    public animator: Animator
    private readonly replayData: ReplayDataResponse

    constructor(replayData: ReplayDataResponse) {
        this.replayData = replayData
        this.animator = {
            playerActions: [],
            playerClips: [],
            playerMixers: []
        } as any

        this.createAnimationClips()
    }

    public playAnimationClips() {
        // Play the player actions
        for (let player = 0; player < this.animator.playerClips.length; player++) {
            const clip = this.animator.playerClips[player]
            const mixer = this.animator.playerMixers[player]
            const action = mixer.clipAction(clip)
            this.animator.playerActions[player] = action
            action.play()
        }
        // Play the ball action
        const ballAction = this.animator.ballMixer.clipAction(this.animator.ballClip)
        this.animator.ballAction = ballAction
        ballAction.play()
    }

    public updateAnimationClips(delta: number) {
        // Update player transformations
        for (let player = 0; player < this.animator.playerClips.length; player++) {
            this.animator.playerMixers[player].update(delta)
        }
        // Update ball transformation
        this.animator.ballMixer.update(delta)
    }

    public addPlayerMixer(player: any) {
        this.animator.playerMixers.push(new AnimationMixer(player))
    }

    public addBallMixer(ball: any) {
        this.animator.ballMixer = new AnimationMixer(ball)
    }

    private createAnimationClips() {
        /**
         * Replay data is of this form:
         * [posX, posZ, posY, rotX, rotZ, royY]
         *
         * Three is RH as opposed to Unreal/Unity's LH axes and uses y as the up axis. All angles
         * are in the range -PI to PI.
         *
         * For parsed data information, see:
         * https://github.com/SaltieRL/carball/blob/master/carball/json_parser/actor_parsing.py#L107
         *
         */
        const dataToVector = (data: any[]) => {
            const x = data[0]
            const y = data[2]
            const z = data[1]
            return new Vector3(x, y, z)
        }
        const dataToQuaternion = (data: any[]) => {
            const q = new Quaternion()
            const x = -data[3]
            const y = -data[5]
            const z = -data[4]
            q.setFromEuler(new Euler(y, z, x, "YZX"))
            return q
        }
        const generateKeyframeData = (posRotData: any[]): KeyframeData => {
            const positions: number[] = []
            const rotations: number[] = []
            /**
             * We are calculating vector and quaternion times independently because there are often
             * cases where the data of a frame might coincide with the data of the next frame. The
             * replays may not contain data for every frame, so carball inserts the previous frame
             * data into the following frame as to avoid any missing frames. Here, we assume the
             * entire duration of that missing frame must be animated.
             *
             * For example, if a car's position at 1.1 seconds reads (45, 100, 500), at 1.2 seconds
             * reads (45, 100, 500), and at 1.3 seconds reads (50, 110, 400), we can assume the
             * middle frame was skipped and so we need to perform animation between 1.1 seconds and
             * 1.3 seconds instead of including the jitter of the car remaining in position from 1.1
             * seconds to 1.2 seconds.
             *
             * We perform the second duration vs. last frame calculation check because we considers
             * kickoffs as a valid reason to not treat the first position traveled to as a valid
             * three second animation. Otherwise, the car will slowly creep forward during kickoff.
             * A kickoff occurs for about three seconds, so 2.9 ensures we break off just before a
             * kickoff occurs.
             */
            let totalDuration = 0
            const positionTimes: number[] = []
            const rotationTimes: number[] = []
            let prevVector = new Vector3(0, 0, 0)
            let prevQuat = new Quaternion(0, 0, 0, 0)
            posRotData.forEach((data, index) => {
                // Apply position frame
                const newVector = dataToVector(data)
                const lastVectorFrame = positionTimes.length
                    ? positionTimes[positionTimes.length - 1]
                    : 0
                if (!newVector.equals(prevVector) || totalDuration - lastVectorFrame > 2.9) {
                    newVector.toArray(positions, positions.length)
                    positionTimes.push(totalDuration)
                    prevVector = newVector
                }
                // Apply rotation frame
                const newQuat = dataToQuaternion(data)
                const lastQuatFrame = rotationTimes.length
                    ? rotationTimes[rotationTimes.length - 1]
                    : 0
                if (!newQuat.equals(prevQuat) || totalDuration - lastQuatFrame > 2.9) {
                    newQuat.toArray(rotations, rotations.length)
                    rotationTimes.push(totalDuration)
                    prevQuat = newQuat
                }
                // Add the delta
                totalDuration += this.replayData.frames[index][0]
            })

            return {
                duration: totalDuration,
                positionTimes,
                positionValues: positions,
                rotationTimes,
                rotationValues: rotations
            }
        }
        // First, generate player clips
        for (let player = 0; player < this.replayData.players.length; player++) {
            const playerData = this.replayData.players[player]
            const playerName = `${this.replayData.names[player]}`
            const playerKeyframeData = generateKeyframeData(playerData)

            // Note that Three.JS requires this .position/.quaternion naming convention, and that
            // the object we wish to modify must have this associated name.
            const playerPosKeyframes = new VectorKeyframeTrack(
                `${playerName}.position`,
                playerKeyframeData.positionTimes,
                playerKeyframeData.positionValues
            )
            const playerRotKeyframes = new QuaternionKeyframeTrack(
                `${playerName}${CAR_SUFFIX}.quaternion`,
                playerKeyframeData.rotationTimes,
                playerKeyframeData.rotationValues
            )

            const playerClip = new AnimationClip(
                `${playerName}Action`,
                playerKeyframeData.duration,
                [playerPosKeyframes, playerRotKeyframes]
            )
            this.animator.playerClips.push(playerClip)
        }
        // Then, generate the ball clip
        const ballData = this.replayData.ball
        const ballKeyframeData = generateKeyframeData(ballData)

        const ballPosKeyframes = new VectorKeyframeTrack(
            `${BALL_NAME}.position`,
            ballKeyframeData.positionTimes,
            ballKeyframeData.positionValues
        )
        const ballRotKeyframes = new QuaternionKeyframeTrack(
            `${BALL_NAME}.quaternion`,
            ballKeyframeData.rotationTimes,
            ballKeyframeData.rotationValues
        )
        this.animator.ballClip = new AnimationClip(
            `${BALL_NAME}Action`,
            ballKeyframeData.duration,
            [ballPosKeyframes, ballRotKeyframes]
        )
    }
}
