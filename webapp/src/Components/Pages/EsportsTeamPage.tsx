import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { PLAYER_PAGE_LINK } from "../../Globals"
import { BasePage } from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>
    & WithStyles<typeof styles>

interface State {
    reloadSignal: boolean
}

interface Team {
    name: string
    link: string
    players: Player[]
}

interface Player {
    name: string
    id: string
    sub: number

}

// const teamNames = ["1NE Glory Stone", "Allegiance", "Bread", "Chiefs Esports", "Cloud9", "compLexity Gaming",
//     "Evil Geniuses", "exceL Esports", "FlipSid3 Tactics", "FlyQuest", "Fnatic", "G2 Esports", "Ghost Gaming",
// "Method",
//     "mousesports", "Nordavind", "NRG Esports", "PSG eSports", "Savage!", "Sol Esports", "Splyce", "Tainted Minds",
//     "Team Dignitas", "Team Secret", "Team Vitality", "Team WLF", "The Clappers", "The Magicians",
//     "Triple Trouble", "We Dem Girlz"]

const teams: Team[] = [
    {
        name: "1NE eSports",
        link: "",
        players: [
            {
                name: "GonFreecs",
                id: "",
                sub: 0
            },
            {
                name: "Misty",
                id: "",
                sub: 0
            },
            {
                name: "Raqua",
                id: "",
                sub: 1
            }
        ]
    },
    {
        name: "1NE Glory Stone",
        link: "",
        players: [
            {
                name: "Kanra",
                id: "",
                sub: 0
            },
            {
                name: "Nemoto",
                id: "",
                sub: 0
            },
            {
                name: "Shaolon",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Allegiance",
        link: "",
        players: [
            {
                name: "Allushin",
                id: "",
                sub: 0
            },
            {
                name: "Sea-Bass",
                id: "",
                sub: 0
            },
            {
                name: "TyNotTyler",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Applesauce",
        link: "",
        players: [
            {
                name: "EPICJonny",
                id: "",
                sub: 0
            },
            {
                name: "Hato",
                id: "",
                sub: 0
            },
            {
                name: "zol",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Avant Gaming",
        link: "",
        players: [
            {
                name: "Bango",
                id: "",
                sub: 0
            },
            {
                name: "SnarfSnarf",
                id: "",
                sub: 0
            },
            {
                name: "Vive",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Bread",
        link: "",
        players: [
            {
                name: "AxB",
                id: "",
                sub: 0
            },
            {
                name: "Satthew",
                id: "",
                sub: 0
            },
            {
                name: "Sypical",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Chiefs Esports",
        link: "",
        players: [
            {
                name: "Drippay",
                id: "",
                sub: 0
            },
            {
                name: "Kamii",
                id: "",
                sub: 0
            },
            {
                name: "Torsos",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Chimpwits",
        link: "",
        players: [
            {
                name: "Decka",
                id: "",
                sub: 0
            },
            {
                name: "Delusion",
                id: "",
                sub: 0
            },
            {
                name: "Requiem",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Cloud9",
        link: "",
        players: [
            {
                name: "Gimmick",
                id: "",
                sub: 0
            },
            {
                name: "SquishyMuffinz",
                id: "",
                sub: 0
            },
            {
                name: "Torment",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Compadres",
        link: "",
        players: [
            {
                name: "Aeon",
                id: "",
                sub: 0
            },
            {
                name: "Astroh",
                id: "",
                sub: 0
            },
            {
                name: "Moses",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "compLexity Gaming",
        link: "",
        players: [
            {
                name: "al0t",
                id: "",
                sub: 0
            },
            {
                name: "gReazy",
                id: "76561198168950593",
                sub: 0
            },
            {
                name: "Mognus",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Epsilon eSports",
        link: "",
        players: [
            {
                name: "FaykoW",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Evil Geniuses",
        link: "",
        players: [
            {
                name: "Chicago",
                id: "",
                sub: 0
            },
            {
                name: "CorruptedG",
                id: "",
                sub: 0
            },
            {
                name: "Klassux",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "exceL Esports",
        link: "",
        players: [
            {
                name: "Markydooda",
                id: "",
                sub: 0
            },
            {
                name: "Nielskoek",
                id: "",
                sub: 0
            },
            {
                name: "Pwndx",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "FlipSid3 Tactics",
        link: "",
        players: [
            {
                name: "kuxir97",
                id: "",
                sub: 0
            },
            {
                name: "miztik",
                id: "",
                sub: 0
            },
            {
                name: "Yukeo",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "FlyQuest",
        link: "",
        players: [
            {
                name: "AyyJayy",
                id: "",
                sub: 0
            },
            {
                name: "PrimeThunder",
                id: "",
                sub: 0
            },
            {
                name: "Wonder",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Fnatic",
        link: "",
        players: [
            {
                name: "Maestro",
                id: "76561198030080604",
                sub: 0
            },
            {
                name: "MummiSnow",
                id: "",
                sub: 0
            },
            {
                name: "Snaski",
                id: "76561198024807207",
                sub: 0
            }
        ]
    },
    {
        name: "G2 Esports",
        link: "",
        players: [
            {
                name: "JKnaps",
                id: "",
                sub: 0
            },
            {
                name: "Kronovi",
                id: "",
                sub: 0
            },
            {
                name: "Mijo",
                id: "",
                sub: 1
            },
            {
                name: "Rizzo",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Ghost Gaming",
        link: "",
        players: [
            {
                name: "Lethamyr",
                id: "",
                sub: 0
            },
            {
                name: "Memory",
                id: "",
                sub: 0
            },
            {
                name: "Zanejackey",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Ground Zero Gaming",
        link: "",
        players: [
            {
                name: "Lim",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Justice Esports",
        link: "",
        players: [
            {
                name: "SSteve",
                id: "",
                sub: 0
            },
            {
                name: "yeatzy",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Legacy Esports",
        link: "",
        players: [
            {
                name: "cyrix",
                id: "",
                sub: 0
            },
            {
                name: "Daze",
                id: "",
                sub: 0
            },
            {
                name: "Siki",
                id: "76561198267316777",
                sub: 0
            }
        ]
    },
    {
        name: "Manhattan",
        link: "",
        players: [
            {
                name: "ayjacks",
                id: "",
                sub: 0
            },
            {
                name: "Malakiss",
                id: "",
                sub: 0
            },
            {
                name: "Tmon",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Method",
        link: "",
        players: [
            {
                name: "Borito B",
                id: "",
                sub: 0
            },
            {
                name: "Kassio",
                id: "",
                sub: 0
            },
            {
                name: "Rix Ronday",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Mock-It eSports Asia",
        link: "",
        players: [
            {
                name: "Juxta",
                id: "",
                sub: 0
            },
            {
                name: "Kerwin",
                id: "",
                sub: 0
            },
            {
                name: "Rothie",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "mousesports",
        link: "",
        players: [
            {
                name: "Alex161",
                id: "",
                sub: 0
            },
            {
                name: "Skyline",
                id: "",
                sub: 0
            },
            {
                name: "Tigreee",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Nordavind",
        link: "",
        players: [
            {
                name: "Al Dente",
                id: "",
                sub: 0
            },
            {
                name: "Data",
                id: "",
                sub: 0
            },
            {
                name: "Godsmilla",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "NRG Esports",
        link: "",
        players: [
            {
                name: "Fireburner",
                id: "",
                sub: 0
            },
            {
                name: "GarrettG",
                id: "",
                sub: 0
            },
            {
                name: "JSTN",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "ORDER",
        link: "",
        players: [
            {
                name: "Dumbo",
                id: "",
                sub: 0
            },
            {
                name: "Julz",
                id: "",
                sub: 0
            },
            {
                name: "ZeN",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Paradox Gaming",
        link: "",
        players: [
            {
                name: "dore52x",
                id: "",
                sub: 0
            },
            {
                name: "gucchi",
                id: "",
                sub: 0
            },
            {
                name: "Mikan",
                id: "",
                sub: 1
            },
            {
                name: "Nunki",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "PSG eSports",
        link: "",
        players: [
            {
                name: "Chausette45",
                id: "",
                sub: 0
            },
            {
                name: "Ferra",
                id: "",
                sub: 0
            },
            {
                name: "fruity",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Red Reserve",
        link: "",
        players: [
            {
                name: "Ronaky",
                id: "",
                sub: 0
            },
            {
                name: "Speed",
                id: "76561198028829938",
                sub: 0
            },
            {
                name: "Tadpole",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Rogue",
        link: "",
        players: [
            {
                name: "Jacob",
                id: "",
                sub: 0
            },
            {
                name: "Jorolelin",
                id: "",
                sub: 0
            },
            {
                name: "Matt",
                id: "",
                sub: 1
            },
            {
                name: "Sizz",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Savage!",
        link: "",
        players: [
            {
                name: "Alpha54",
                id: "",
                sub: 0
            },
            {
                name: "Bluey",
                id: "",
                sub: 0
            },
            {
                name: "Deevo",
                id: "76561198271971450",
                sub: 0
            }
        ]
    },
    {
        name: "Senix Esports",
        link: "",
        players: [
            {
                name: "Broski",
                id: "",
                sub: 0
            },
            {
                name: "Lumi",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Splyce",
        link: "",
        players: [
            {
                name: "Dappur",
                id: "",
                sub: 1
            },
            {
                name: "DudeWithTheNose",
                id: "",
                sub: 0
            },
            {
                name: "JWismont",
                id: "",
                sub: 0
            },
            {
                name: "Karma",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Tainted Minds",
        link: "",
        players: [
            {
                name: "CJCJ",
                id: "",
                sub: 0
            },
            {
                name: "Express",
                id: "",
                sub: 0
            },
            {
                name: "shadey",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Team Dignitas",
        link: "",
        players: [
            {
                name: "Kaydop",
                id: "76561198067659334",
                sub: 0
            },
            {
                name: "Turbopolsa",
                id: "76561198194977850",
                sub: 0
            },
            {
                name: "ViolentPanda",
                id: "76561198066822605",
                sub: 0
            }
        ]
    },
    {
        name: "Team Secret",
        link: "",
        players: [
            {
                name: "FlamE",
                id: "76561198353125160",
                sub: 0
            },
            {
                name: "FreaKii",
                id: "",
                sub: 0
            },
            {
                name: "Tylacto",
                id: "76561198090703317",
                sub: 0
            }
        ]
    },
    {
        name: "Team Vitality",
        link: "",
        players: [
            {
                name: "Fairy Peak",
                id: "",
                sub: 0
            },
            {
                name: "Paschy90",
                id: "",
                sub: 0
            },
            {
                name: "Scrub Killa",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "The Bricks",
        link: "",
        players: [
            {
                name: "Didris",
                id: "",
                sub: 0
            },
            {
                name: "Friis",
                id: "",
                sub: 0
            },
            {
                name: "Shakahron",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "The Clappers",
        link: "",
        players: [
            {
                name: "Calix",
                id: "",
                sub: 0
            },
            {
                name: "Oscillon",
                id: "",
                sub: 0
            },
            {
                name: "PetricK",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "The Hosses",
        link: "",
        players: [
            {
                name: "Chrome",
                id: "",
                sub: 0
            },
            {
                name: "Insolences",
                id: "",
                sub: 0
            },
            {
                name: "Timi",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "The Magicians",
        link: "",
        players: [
            {
                name: "Halcyon",
                id: "",
                sub: 0
            },
            {
                name: "Rapid",
                id: "",
                sub: 0
            },
            {
                name: "Vince",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "The Peeps",
        link: "",
        players: [
            {
                name: "Arsenal",
                id: "",
                sub: 0
            },
            {
                name: "Gyro",
                id: "",
                sub: 0
            },
            {
                name: "Pirates",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Vapour Esports",
        link: "",
        players: [
            {
                name: "EPIIC",
                id: "",
                sub: 0
            },
            {
                name: "JarelNaden",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "Vapour Quantum",
        link: "",
        players: [
            {
                name: "Ayro14",
                id: "",
                sub: 0
            },
            {
                name: "ZiNX",
                id: "",
                sub: 0
            }
        ]
    },
    {
        name: "We Dem Girlz",
        link: "",
        players: [
            {
                name: "EyeIgnite",
                id: "76561198137996936",
                sub: 0
            },
            {
                name: "Metsanauris",
                id: "76561198080528613",
                sub: 0
            },
            {
                name: "remkoe",
                id: "76561198011715777",
                sub: 0
            }
        ]
    }
]

export class EsportsTeamPageComponent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {reloadSignal: false}
    }

    public componentDidUpdate(prevProps: Readonly<Props>) {
    }

    public render() {
        // const matchUrl = this.props.match.url
        const teamId = this.props.match.params.id
        const team = teams.filter((t) => t.name === teamId)[0]
        const {classes} = this.props
        return (
            <BasePage>
                <Grid container spacing={24} justify="center">
                    <Grid item xs={4}>
                        <Card>
                            <CardMedia className={classes.avatar} image={`/team-logos/${teamId}.png`}/>

                            <CardContent className={classes.content}>
                                <div className={classes.nameWrapper}>
                                    <Typography variant="headline" noWrap>
                                        {team.name}
                                    </Typography>
                                </div>
                                <List>
                                    <ListItem>
                                        <Typography>Link: <a style={{textDecoration: "none"}}
                                                             href={team.link}> {team.link} </a></Typography>
                                    </ListItem>
                                </List>

                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card>
                            <CardHeader title="Players" subheader=""/>
                            <Divider/>
                            <List>
                                {team.players.map((player) =>
                                    <Link to={PLAYER_PAGE_LINK(player.id)} style={{textDecoration: "none"}}>
                                        <ListItem button key={player.id}>
                                            <Avatar src={`/team-logos/${teamId}.png`}/>
                                            <ListItemText primary={player.name}/>
                                        </ListItem>
                                    </Link>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}

const styles = createStyles({
    card: {
        display: "flex"
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

export const EsportsTeamPage = (withStyles(styles)(EsportsTeamPageComponent))
