import {Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@material-ui/core"
import OpenInNew from "@material-ui/icons/OpenInNew"
import * as React from "react"
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
                                <Typography>
                                    The autoupload feature can be enabled/disabled in-game under
                                    [F2] → [Plugins] → [Auto upload]
                                    and checking/unchecking "Automatically upload replays to calculated.gg".
                                </Typography>
                            </CardContent>
                            <CardActions style={{justifyContent: "flex-end"}}>
                                <LinkButton icon={OpenInNew} iconType="mui" to="http://bakkesmod.com/" isExternalLink>
                                    BakkesMod
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
