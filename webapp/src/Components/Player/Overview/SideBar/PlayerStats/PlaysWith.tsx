import {
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Typography
} from "@material-ui/core"
import People from "@material-ui/icons/People"
import Person from "@material-ui/icons/Person"
import VideogameAsset from "@material-ui/icons/VideogameAsset"

import * as React from "react"
import {Link} from "react-router-dom"
import {PLAYER_PAGE_LINK} from "../../../../../Globals"

interface Props {
    playersInCommon: PlayerInCommonStat[]
    player: Player
}

export class PlaysWith extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Grid container alignItems="center" justify="space-around" spacing={1}>
                    <Grid item xs={3}>
                        <Typography>
                            <People />
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="subtitle1">plays with</Typography>
                    </Grid>
                </Grid>

                <Grid container alignItems="center" justify="space-around" spacing={1}>
                    <Grid item xs={12}>
                        <List component="nav">
                            {this.props.playersInCommon.map((person) => (
                                <Link to={PLAYER_PAGE_LINK(person.id)} style={{textDecoration: "none"}} key={person.id}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            {person.avatar ? (
                                                <img alt={`${person.name}'s avatar`} height={30} src={person.avatar} />
                                            ) : (
                                                <Person />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={person.name} />
                                        <ListItemSecondaryAction>
                                            <Tooltip title={"Search games played together"}>
                                                <Link
                                                    style={{textDecoration: "none", marginLeft: "auto"}}
                                                    to={
                                                        `/search/replays?player_ids=${person.id}` +
                                                        `&player_ids=${this.props.player.id}`
                                                    }
                                                >
                                                    <IconButton>
                                                        <VideogameAsset />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </>
        )
    }
}
