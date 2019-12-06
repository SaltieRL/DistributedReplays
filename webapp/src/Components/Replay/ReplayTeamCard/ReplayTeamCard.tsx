import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    List,
    Theme,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import {Replay} from "../../../Models"
import {TeamCardPlayer} from "./TeamCardPlayer"

const styles = (theme: Theme) =>
    createStyles({
        orangeCard: {
            backgroundColor: theme.palette.type === "dark" ? "darkorange" : "bisque"
        },
        blueCard: {
            backgroundColor: theme.palette.type === "dark" ? "royalblue" : "aliceblue"
        }
    })

interface OwnProps {
    replay: Replay
    isOrange: boolean
}

type Props = OwnProps & WithStyles<typeof styles>

class ReplayTeamCardComponent extends React.PureComponent<Props> {
    public render() {
        const {replay, isOrange, classes} = this.props

        const title = isOrange ? "Orange" : "Blue"
        const headerClassName = isOrange ? classes.orangeCard : classes.blueCard

        return (
            <Card square>
                <CardHeader title={title} titleTypographyProps={{align: "center"}} className={headerClassName} />
                <Divider />
                <CardContent>
                    <List>
                        {replay.players
                            .filter((player) => player.isOrange === isOrange)
                            .map((player) => (
                                <TeamCardPlayer player={player} key={player.id} />
                            ))}
                    </List>
                </CardContent>
            </Card>
        )
    }
}

export const ReplayTeamCard = withStyles(styles)(ReplayTeamCardComponent)
