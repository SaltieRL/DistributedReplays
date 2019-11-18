import {Card, CardContent, CardHeader, Divider} from "@material-ui/core"
import * as React from "react"
import {getStats} from "../../../../../Requests/Player/getStats"
import {LoadableWrapper} from "../../../../Shared/LoadableWrapper"
import {FavouriteCar} from "./FavouriteCar"
import {LoadoutDialogWrapper} from "./LoadoutDialogWrapper"
import {PlaysWith} from "./PlaysWith"

interface Props {
    player: Player
}

interface State {
    playerStats?: PlayerStats
    reloadSignal: boolean
    loadoutOpen: boolean
}

export class PlayerStatsCard extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false, loadoutOpen: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.player.id !== this.props.player.id) {
            this.triggerReload()
        }
    }

    public render() {
        return (
            <Card>
                <CardHeader title="Stats" />
                <Divider />
                <CardContent>
                    <LoadableWrapper load={this.getPlayerProfileStats} reloadSignal={this.state.reloadSignal}>
                        {this.state.playerStats && (
                            <>
                                <FavouriteCar carStat={this.state.playerStats.car} />
                                <LoadoutDialogWrapper
                                    playerStats={this.state.playerStats}
                                    handleShowLoadout={this.handleShowLoadout}
                                    handleCloseLoadout={this.handleCloseLoadout}
                                    loadoutOpen={this.state.loadoutOpen}
                                />

                                <PlaysWith
                                    playersInCommon={this.state.playerStats.playersInCommon}
                                    player={this.props.player}
                                />
                            </>
                        )}
                    </LoadableWrapper>
                </CardContent>
            </Card>
        )
    }

    private readonly getPlayerProfileStats = (): Promise<void> => {
        return getStats(this.props.player.id).then((playerStats) => this.setState({playerStats}))
    }

    private readonly triggerReload = () => {
        this.setState({reloadSignal: !this.state.reloadSignal})
    }

    private readonly handleShowLoadout = () => {
        this.setState({loadoutOpen: true})
    }
    private readonly handleCloseLoadout = () => {
        this.setState({loadoutOpen: false})
    }
}
