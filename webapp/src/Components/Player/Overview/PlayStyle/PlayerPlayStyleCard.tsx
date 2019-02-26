import { Card, CardContent, CardHeader, Typography } from "@material-ui/core"
import * as React from "react"
import { IconTooltip } from "../../../Shared/IconTooltip"
import { PlayStyleActions } from "./PlayStyleActions"

interface Props {
    player: Player
    playlist: number
    winLossMode: boolean
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
}

export class PlayerPlayStyleCard extends React.PureComponent<Props> {
    public render() {
        /* tslint:disable */
        const playStyleTitle =
            <Typography variant="headline">
                Playstyle
                <IconTooltip
                    tooltip="Data is presented as standard deviations from the mean, and only includes games from the past 6 months"/>
            </Typography>
        /* tslint:enable */

        return (
            <Card>
                <CardHeader title={playStyleTitle}
                            action={
                                <PlayStyleActions
                                    player={this.props.player}
                                    playlist={this.props.playlist}
                                    winLossMode={this.props.winLossMode}
                                    handlePlaylistChange={this.props.handlePlaylistChange}
                                    handleWinsLossesChange={this.props.handleWinsLossesChange}
                                />
                            }/>
                <CardContent>
                    {this.props.children}
                </CardContent>
            </Card>
        )
    }
}
