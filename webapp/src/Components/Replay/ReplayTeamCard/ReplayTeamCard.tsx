import { Card, CardContent, CardHeader, createStyles, Divider, List, WithStyles, withStyles } from "@material-ui/core"
import * as React from "react"
import { Replay } from "../../../Models"
import { TeamCardPlayer } from "./TeamCardPlayer"

interface OwnProps {
    replay: Replay
    isOrange: boolean
    predictedRanks: any
}

type Props = OwnProps
    & WithStyles<typeof styles>

class ReplayTeamCardComponent extends React.PureComponent<Props> {
    public render() {
        const {replay, isOrange, classes, predictedRanks} = this.props

        const title = isOrange ? "Orange" : "Blue"
        const headerClassName = isOrange ? classes.orangeCard : classes.blueCard

        return (
            <Card square>
                <CardHeader
                    title={title}
                    titleTypographyProps={{align: "center"}}
                    className={headerClassName}/>
                <Divider/>
                <CardContent>
                    <List>
                        {replay.players
                            .filter((player) => player.isOrange === isOrange)
                            .map((player) => <TeamCardPlayer player={player} predictedRank={predictedRanks[player.id]}
                                                             key={player.id}/>)
                        }
                    </List>
                </CardContent>
            </Card>
        )
    }
}

const styles = createStyles({
    orangeCard: {
        backgroundColor: "bisque"
    },
    blueCard: {
        backgroundColor: "aliceblue"
    }
})

export const ReplayTeamCard = withStyles(styles)(ReplayTeamCardComponent)
