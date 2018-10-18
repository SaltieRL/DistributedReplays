// TODO: Move independent service functions to this class. Will do when we have the store fixed
export class PlayerService {
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerService()
        }
        return this.instance
    }

    private static instance: PlayerService

    private constructor() { }

    // Once we move the functions here, the linter will not complain about useless static classes
    public shutTheLinterUp() {
        return true
    }
}
