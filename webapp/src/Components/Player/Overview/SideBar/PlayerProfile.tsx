import * as React from "react"

import {
    Button,
    Card,
    CardContent,
    CardMedia,
    createStyles, Grid,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import { PlayerNameDropdown } from "./PlayerNameDropdown"

const styles = createStyles({
    card: {
        display: "flex",
        minHeight: 128
    },
    avatar: {
        flex: "0 0 128px"
    },
    content: {
        width: "calc(100% - 128px)"
    },
    nameWrapper: {
        whiteSpace: "nowrap",
        display: "flex"
    }
})

interface OwnProps {
    player: Player
}

type Props = OwnProps
    & WithStyles<typeof styles>

class PlayerProfileComponent extends React.PureComponent<Props> {
    public render() {
        const {player, classes} = this.props
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.avatar} image={player.avatarLink}/>
                <CardContent className={classes.content}>
                    <Grid container alignContent="space-around" style={{height: "100%"}}>
                        <Grid item xs={12}>
                            <div className={classes.nameWrapper}>
                                <Typography variant="h5" noWrap>
                                    {player.name}
                                </Typography>
                                {player.pastNames.length > 0 && <PlayerNameDropdown pastNames={player.pastNames}/>}
                            </div>
                        </Grid>
                        <Grid item xs={12} container justify="flex-end">
                            <a
                                href={player.profileLink}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{textDecoration: "none"}}
                            >
                                <Button variant="text" size="small">
                                    <Typography variant="subtitle1">
                                        {player.platform}
                                    </Typography>
                                </Button>
                            </a>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

export const PlayerProfile = (withStyles(styles)(PlayerProfileComponent))
