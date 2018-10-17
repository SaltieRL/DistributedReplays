// TODO: Move independent service functions to this class. Will do when we have the store fixed
export class PlayerService {
    private static instance: PlayerService
    private constructor() {}

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerService()
        }
        return this.instance
    }

    public shutTheLinterUp() {
        return true
    }
}
