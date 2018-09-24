import {faFileArchive} from "@fortawesome/free-solid-svg-icons"
import {Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import OpenInNew from "@material-ui/icons/OpenInNew"
import * as React from "react"
import {BAKKES_MOD_PLUGIN_LINK} from "../../Globals"
import {LinkButton} from "../Shared/LinkButton"
import {BasePage} from "./BasePage"

export class PluginsPage extends React.PureComponent {
    public render() {
        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container justify="center" spacing={16}>
                    <Grid item xs={12} sm={6} md={5} lg={4} xl={3}>
                        <Card>
                            <CardHeader title="BakkesMod"/>
                            <CardContent>
                                <Typography paragraph>
                                    BakkesMod allows you to automatically save replays (among many other features).
                                    The plugin linked below allows you to automatically upload these replays so you get
                                    these amazing stats without any extra work!
                                </Typography>
                                <Typography paragraph>
                                    The zip is a sneak peek of a feature that will be included with the mod after
                                    Monday's Rocket League update - for now, simply download it and extract it over your
                                    current installation.
                                </Typography>
                                <Typography>
                                    The autoupload feature can be enabled/disabled in-game by going to F2 -> Plugins ->
                                    Auto upload and checking/unchecking "Automatically upload replays to calculated.gg".
                                </Typography>
                            </CardContent>
                            <CardActions style={{justifyContent: "space-between"}}>
                                <LinkButton icon={OpenInNew} iconType="mui" to="http://bakkesmod.com/" isExternalLink>
                                    BakkesMod
                                </LinkButton>
                                <LinkButton icon={faFileArchive} iconType="fontawesome" to={BAKKES_MOD_PLUGIN_LINK}
                                            isExternalLink
                                >
                                    Replay Uploader
                                </LinkButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={5} lg={4} xl={3}>
                        <Card>
                            <CardHeader title="More to come..."/>
                            <CardContent>
                                <Typography>
                                    Watch this space!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
