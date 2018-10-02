import {
    ButtonBase,
    Card,
    CardContent,
    CardHeader, Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Typography
} from "@material-ui/core"
import * as React from "react"
import {BasePage} from "./BasePage"
import {StoreState} from "../../Redux"

interface ListItemInfo {
    name: string
    link: string
    message: string
}

const coreDevelopers: ListItemInfo[] = [
    {
        name: "Sciguymjm",
        link: "https://steamcommunity.com/id/Sciguymjm",
        message: "Backend and replay parsing"
    },
    {
        name: "dtracers",
        link: "https://steamcommunity.com/id/dtracers",
        message: "Frontend and replay parsing"
    },
    {
        name: "twobackfromtheend",
        link: "https://steamcommunity.com/id/twobackfromtheend",
        message: "Frontend and replay parsing"
    }
]

const specialThanks: ListItemInfo[] = [
    {
        name: "Redox",
        link: "https://steamcommunity.com/id/theblocks_",
        message: "AutoReplays uploader"
    },
    {
        name: "jb",
        link: "https://steamcommunity.com/id/jb44",
        message: "Initial design and prototyping"
    }
]

const sourceCode: ListItemInfo[] = [
    {
        name: "DistributedReplays",
        link: "https://github.com/SaltieRL/DistributedReplays",
        message: "Powers the entire site - Built with React, TypeScript, Material UI, Flask, Gunicorn, PostgreSQL"
    },
    {
        name: "carball",
        link: "https://github.com/SaltieRL/carball",
        message: "Replay parsing and analysis library - Built in Python with Rattletrap, pandas, protobuf"
    }
]

const friends: ListItemInfo[] = [
    {
        name: "RLBot",
        link: "https://www.rlbot.org/",
        message: "A framework for building and creating AIs for Rocket League. They are a wonderful community and " +
            "there is support for many languages - from Python to .NET, to Scratch, to Microsoft Excel!"
    },
    {
        name: "BakkesMod",
        link: "http://bakkesmod.com/",
        message: "A full-featured mod for Rocket League with plenty of plugins and features."
    },
    {
        name: "GIF Your Game",
        link: "https://www.gifyourgame.com/",
        message: "An addon that enables you to create gifs of your gameplay at the push of a button!"
    },
    {
        name: "Octane.gg",
        link: "https://octane.gg/",
        message: "An addon that enables you to create gifs of your gameplay at the push of a button!"
    }
]

const replayParsing: ListItemInfo[] = [
    {
        name: "Druthyn",
        link: "",
        message: "Worked on figuring out how to detect if a player is on a M/KB or a controller"
    },
    {
        name: "Destiphy",
        link: "",
        message: "Has helped fix tons of bugs and created situations for us to test against."
    },
]

const uploading: ListItemInfo[] = [
    {
        name: "Skoocda",
        link: "",
        message: "Worked on tracking state of uploads and is helping with testing"
    },
    {
        name: "Kcolton & Bakkes",
        link: "",
        message: "Bakkes Auto uploader plugin"
    },
    {
        name: "Redox ",
        link: "",
        message: "A custom Auto Uploader"
    },
]

const replayViewer: ListItemInfo[] = [
    {
        name: "Xander",
        link: "",
        message: "Worked on the initial replay viewer"
    },
    {
        name: "DarkAce65",
        link: "",
        message: "Worked on server side implementation for the replay viewer"
    },
    {
        name: "enzanki_ars",
        link: "",
        message: "Has a great design for live stats during the viewer"
    },
]

const designer: ListItemInfo[] = [
    {
        name: "Gander",
        link: "",
        message: "Created all traces seen on the site"
    },
    {
        name: "IBeam ",
        link: "",
        message: "Worked on backgrounds and a lot of prototypes"
    },
]


const supportStaff: ListItemInfo[] = [
    {
        name: "Khalcin",
        link: "",
        message: "Leader of support staff"
    },
    {
        name: "ThatGuyDed, IamEld3st",
        link: "",
        message: "Helper of support staff, Welcomer"
    },
]


export class AboutPage extends React.PureComponent {
    public render() {
        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container justify="center">
                    <Grid item xs={12} md={8} lg={7} xl={6}>
                        <Grid container spacing={16} justify="center">
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title="About us" subheader="Saltie"/>
                                    <Divider/>
                                    <CardContent>
                                        <Typography>
                                            The Saltie group was founded in 2017 as a deep reinforcement research group
                                            for
                                            Rocket League. It was created by
                                            {" "}
                                            <ExternalLink name={"Sciguymjm"}
                                                          link={"https://steamcommunity.com/id/Sciguymjm"}/>
                                            {" and "}
                                            <ExternalLink name={"dtracers"}
                                                          link={"https://steamcommunity.com/id/dtracers"}/>
                                            .
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title="About" subheader="calculated.gg"/>
                                    <Divider/>
                                    <List>
                                        <ListSubheader>Core Developers</ListSubheader>
                                        {coreDevelopers.map((listItemInfo) => (
                                            <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                        ))}

                                        <Divider/>

                                        <ListSubheader>Special thanks to</ListSubheader>
                                        {specialThanks.map((listItemInfo) => (
                                            <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                        ))}

                                        <Divider/>

                                        <ListSubheader>Source code</ListSubheader>
                                        {sourceCode.map((listItemInfo) => (
                                            <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                        ))}
                                    </List>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title="Friends" subheader="of calculated.gg"/>
                                    <Divider/>
                                    <CardContent>
                                        <List>
                                            {friends.map((listItemInfo) => (
                                                <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title="contributors"/>
                                    <Divider/>
                                    <CardHeader subheader="Replay Parsing"/>
                                    <CardContent>
                                        <List>
                                            {replayParsing.map((listItemInfo) => (
                                                <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                            ))}
                                        </List>
                                    </CardContent>
                                    <CardHeader subheader="Uploading"/>
                                    <CardContent>
                                        <List>
                                            {uploading.map((listItemInfo) => (
                                                <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                            ))}
                                        </List>
                                    </CardContent>
                                        <CardHeader subheader="Replay Viewer"/>
                                        <CardContent>
                                            <List>
                                                {replayViewer.map((listItemInfo) => (
                                                    <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                                ))}
                                            </List>
                                        </CardContent>
                                    <CardHeader subheader="Designers"/>
                                    <CardContent>
                                        <List>
                                            {designer.map((listItemInfo) => (
                                                <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                            ))}
                                        </List>
                                    </CardContent>
                                    <CardHeader subheader="Support Staff"/>
                                    <CardContent>
                                        <List>
                                            {supportStaff.map((listItemInfo) => (
                                                <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}
const PersonListItem: React.SFC<ListItemInfo> = (props) => (
    <ListItem>
        <ListItemText
            primary={
                <ExternalLink name={props.name} link={props.link}/>
            }
            secondary={props.message}
        />
    </ListItem>
)

type ExternalLinkProps = Pick<ListItemInfo, "link" | "name">

const ExternalLink: React.SFC<ExternalLinkProps> = (props) => (
    <a href={props.link}
       target="_blank"
       style={{textDecoration: "none", display: "inline-flex"}}
    >
        <ButtonBase>
            <Typography>
                {props.name}
            </Typography>
        </ButtonBase>
    </a>
)

