import {Card, CardContent, CardHeader, Typography} from "@material-ui/core"
import * as React from "react"
import {IconTooltip} from "../../../Shared/IconTooltip"
import {PlayStyleActions} from "./PlayStyleActions"

interface Props {
    player: Player
    playlist: number
    winLossMode: boolean
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
}

const PlayStyleTitle = () => (
    <Typography variant="h5">
        Playstyle
        <IconTooltip tooltip="Data is presented as standard deviations from the mean, and only includes games from the past 6 months" />
    </Typography>
)

export class PlayerPlayStyleCard extends React.PureComponent<Props> {
    public render() {
        return (
            <Card>
                <CardHeader
                    title={PlayStyleTitle}
                    action={
                        <PlayStyleActions
                            player={this.props.player}
                            playlist={this.props.playlist}
                            winLossMode={this.props.winLossMode}
                            handlePlaylistChange={this.props.handlePlaylistChange}
                            handleWinsLossesChange={this.props.handleWinsLossesChange}
                        />
                    }
                />
                <CardContent>{this.props.children}</CardContent>
            </Card>
        )
    }
}
