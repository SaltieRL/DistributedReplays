import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    List,
    ListItem, Typography
} from "@material-ui/core"
import * as React from "react"
import {BasePage} from "./BasePage"

export class AboutPage extends React.PureComponent {
    public render() {
        // TODO: Complete about page
        return (
            <BasePage>
                <Grid container spacing={16} justify="center">
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="About" subheader="calculated.gg"/>
                            <CardContent>
                                <Typography>Core Developers:
                                    <List>
                                        <ListItem>
                                            <a href="https://steamcommunity.com/id/Sciguymjm">Sciguymjm</a> - backend
                                            and
                                            replay parsing
                                        </ListItem>
                                        <ListItem>
                                            <a href="https://steamcommunity.com/id/dtracers">dtracers</a> - frontend and
                                            replay parsing
                                        </ListItem>
                                        <ListItem>
                                            <a href="https://steamcommunity.com/id/twobackfromtheend">twobackfromtheend</a> -
                                            frontend and replay parsing
                                        </ListItem>
                                    </List>

                                    Special thanks to:
                                    <List>
                                        <ListItem>
                                            <a href="https://steamcommunity.com/id/theblocks_">Redox</a> - AutoReplays
                                            uploader
                                        </ListItem>
                                        <ListItem>
                                            <a href="https://steamcommunity.com/id/jb44">jb</a> - initial design and
                                            prototyping
                                        </ListItem>
                                    </List>

                                    Source code:
                                    <List>
                                        <ListItem>
                                            <a href="https://github.com/SaltieRL/DistributedReplays">DistributedReplays</a> -
                                            powers the entire site
                                        </ListItem>
                                        <ListItem>
                                            <a href="https://github.com/SaltieRL/carball">carball</a> - replay parsing
                                            and analysis library used to parse replays
                                        </ListItem>
                                    </List>
                                    Built with: React, Flask, gunicorn, postgreSQL, celery</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} container>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Friends" subheader="of calculated.gg"/>
                                <CardContent>
                                    <Typography>
                                        <List>
                                            <ListItem>
                                                <a href="http://www.rlbot.org/">RLBot</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="http://bakkesmod.com/">BakkesMod</a>
                                            </ListItem>
                                            <ListItem>
                                                <a href="https://www.gifyourgame.com/">GifYourGame</a>
                                            </ListItem>
                                        </List>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="About us" subheader="Saltie"/>
                                <CardContent>
                                    <Typography>
                                        The Saltie group was founded in 2017 as a deep reinforcement research group for
                                        Rocket
                                        League. It was created by <a
                                        href="https://steamcommunity.com/id/Sciguymjm">Sciguymjm</a> and <a
                                        href="https://steamcommunity.com/id/dtracers">dtracers</a>.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
