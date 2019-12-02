import {
    ButtonBase,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import {BasePage} from "./BasePage"

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
        message:
            "A framework for building and creating AIs for Rocket League. They are a wonderful community and " +
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
        message: "The best source for Rocket League Esports coverage of news, events, teams, players, and more!"
    }
]

const replayParsing: ListItemInfo[] = [
    {
        name: "Druthyn",
        link: "",
        message: "Detecting if a player is on M/KB or a controller"
    },
    {
        name: "Destiphy",
        link: "",
        message: "Helped fix countless bugs and created situations to test against"
    }
]

const uploading: ListItemInfo[] = [
    {
        name: "Skoocda",
        link: "",
        message: "Tracking state of uploads and testing"
    },
    {
        name: "Kcolton & Bakkes",
        link: "",
        message: "BakkesMod Auto uploader plugin"
    },
    {
        name: "Redox",
        link: "",
        message: "A custom Auto Uploader"
    }
]

/*
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
*/

const designer: ListItemInfo[] = [
    {
        name: "Gander",
        link: "",
        message: "Created all traces seen on the site"
    },
    {
        name: "IBeam ",
        link: "",
        message: "Backgrounds and prototypes"
    }
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
        message: "Helper of support staff, welcomer"
    }
]

export class AboutPage extends React.PureComponent {
    public render() {
        const aboutSaltie = (
            <Card>
                <CardHeader title="About us" subheader="Saltie" />
                <Divider />
                <CardContent>
                    <Typography>
                        The Saltie group was founded in 2017 as a deep reinforcement research group for Rocket League.
                        It was created by{" "}
                        <ExternalLink name={"Sciguymjm"} link={"https://steamcommunity.com/id/Sciguymjm"} />
                        {" and "}
                        <ExternalLink name={"dtracers"} link={"https://steamcommunity.com/id/dtracers"} />.
                    </Typography>
                </CardContent>
            </Card>
        )

        const aboutCalculated = (
            <Card>
                <CardHeader title="About" subheader="calculated.gg" />
                <Divider />
                <List>
                    <ListSubheader>Core Developers</ListSubheader>
                    {coreDevelopers.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}

                    <Divider />

                    <ListSubheader>Special thanks to</ListSubheader>
                    {specialThanks.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}

                    <Divider />

                    <ListSubheader>Source code</ListSubheader>
                    {sourceCode.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}
                </List>
            </Card>
        )

        const friendsCard = (
            <Card>
                <CardHeader title="Friends" subheader="of calculated.gg" />
                <Divider />
                <CardContent>
                    <List>
                        {friends.map((listItemInfo) => (
                            <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                        ))}
                    </List>
                </CardContent>
            </Card>
        )

        const contributors = (
            <Card>
                <CardHeader title="Contributors" subheader="to calculated.gg" />
                <Divider />
                <List>
                    <ListSubheader>Replay Parsing</ListSubheader>

                    {replayParsing.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}
                    <Divider />
                    <ListSubheader>Uploading</ListSubheader>

                    {uploading.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}

                    {/*
                <CardHeader subheader="Replay Viewer"/>
                <CardContent>
                    <List>
                        {replayViewer.map((listItemInfo) => (
                            <PersonListItem {...listItemInfo} key={listItemInfo.name}/>
                        ))}
                    </List>
                </CardContent>
            */}
                    <Divider />
                    <ListSubheader>Designers</ListSubheader>

                    {designer.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}
                    <Divider />
                    <ListSubheader>Support Staff</ListSubheader>

                    {supportStaff.map((listItemInfo) => (
                        <PersonListItem {...listItemInfo} key={listItemInfo.name} />
                    ))}
                </List>
            </Card>
        )

        return (
            <BasePage useSplash>
                <Grid container justify="center">
                    <Grid item xs={12} lg={10} xl={8}>
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12}>
                                {aboutSaltie}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {aboutCalculated}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {friendsCard}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {contributors}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}

const personListItemStyles = createStyles({
    secondary: {
        fontWeight: 400
    }
})

type PersonListItemComponentProps = ListItemInfo & WithStyles<typeof personListItemStyles>

const PersonListItemComponent: React.FunctionComponent<PersonListItemComponentProps> = (props) => (
    <ListItem>
        <ListItemText
            primary={<ExternalLink name={props.name} link={props.link} />}
            secondary={props.message}
            classes={props.classes}
        />
    </ListItem>
)

const PersonListItem = withStyles(personListItemStyles)(PersonListItemComponent)

type ExternalLinkProps = Pick<ListItemInfo, "link" | "name">

const ExternalLink: React.FunctionComponent<ExternalLinkProps> = (props) => (
    <a
        href={props.link}
        target="_blank"
        rel="noreferrer noopener"
        style={{textDecoration: "none", display: "inline-flex"}}
    >
        <ButtonBase>
            <Typography>{props.name}</Typography>
        </ButtonBase>
    </a>
)
