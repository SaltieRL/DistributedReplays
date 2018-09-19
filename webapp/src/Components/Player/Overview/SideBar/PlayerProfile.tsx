import * as React from "react"

import {Card, CardContent, CardMedia, createStyles, Typography, WithStyles, withStyles} from "@material-ui/core"
import {PlayerNameDropdown} from "./PlayerNameDropdown"

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
                    <div className={classes.nameWrapper}>
                    <Typography variant="headline" noWrap>
                        {player.name}
                    </Typography>
                    {player.pastNames.length > 0 && <PlayerNameDropdown pastNames={player.pastNames}/>}
                    </div>
                    <Typography variant="subheading">
                        {player.platform}
                    </Typography>
                    <Typography style={{textDecoration: "none"}}>
                        <a href={player.profileLink}> View profile </a>
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

const styles = createStyles({
    card: {
        display: "flex"
    },
    avatar: {
        height: 128,
        width: 128
    },
    content: {
        flex: "1 0 auto",
        width: "100%"
    },
    nameWrapper: {
        whiteSpace: "nowrap",
        display: "flex"
    }
})

export const PlayerProfile = (withStyles(styles)(PlayerProfileComponent))
