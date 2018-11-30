import { Card, CardContent, CardHeader, Typography } from "@material-ui/core"
import * as React from "react"
import { IconTooltip } from "../../../Shared/IconTooltip"
import { PlayStyleActions } from "./PlayStyleActions"

interface Props {
    player: Player
    handlePlaylistChange?: (playlist: number) => void
    handleWinsLossesChange?: (winLossMode: boolean) => void
    handleChartChange: () => void
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
                                    handlePlaylistChange={this.props.handlePlaylistChange}
                                    handleWinsLossesChange={this.props.handleWinsLossesChange}
                                    handleChartChange={this.props.handleChartChange}
                                />
                            }/>
                <CardContent>
                    {this.props.children}
                </CardContent>
            </Card>
        )
    }
}
