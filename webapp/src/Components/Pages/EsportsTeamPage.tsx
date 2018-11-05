import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import * as React from "react"
import { RouteComponentProps } from "react-router-dom"
import { MatchHistoryResponse, Replay, ReplaysSearchQueryParams } from "../../Models"
import { searchReplays } from "../../Requests/Replay"
import { EsportsPlayerListItem } from "../Esports/EsportsPlayerListItem"
import { ReplaysSearchResultDisplay } from "../ReplaysSearch/ReplaysSearchResultDisplay"
import { LoadableWrapper } from "../Shared/LoadableWrapper"
import { BasePage } from "./BasePage"

interface RouteParams {
    id: string
}

type Props = RouteComponentProps<RouteParams>
    & WithStyles<typeof styles>

interface State {
    reloadSignal: boolean
    matchHistory?: MatchHistoryResponse
}

interface EsportsTeam {
    name: string
    link: string
    players: EsportsPlayer[]
}

interface EsportsPlayer {
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

const teams: EsportsTeam[] = [
    {
        name: "1NE eSports",
        link: "http://1neesports.com/",
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
        link: "http://1neesports.com/",
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
        link: "http://www.allegiance.team/",
        players: [
            {
                name: "Allushin",
                id: "76561198341071770",
                sub: 0
            },
            {
                name: "Sea-Bass",
                id: "76561198247356798",
                sub: 0
            },
            {
                name: "TyNotTyler",
                id: "76561198176000659",
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
                id: "76561198318383132",
                sub: 0
            },
            {
                name: "Hato",
                id: "76561198122873203",
                sub: 0
            },
            {
                name: "zol",
                id: "76561198131350065",
                sub: 0
            }
        ]
    },
    {
        name: "Avant Gaming",
        link: "http://www.avantgaming.com.au/",
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
                id: "76561198071944774",
                sub: 0
            },
            {
                name: "Satthew",
                id: "76561198149461762",
                sub: 0
            },
            {
                name: "Sypical",
                id: "76561198323843523",
                sub: 0
            }
        ]
    },
    {
        name: "Chiefs Esports",
        link: "http://chiefsesc.com/",
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
        link: "http://cloud9.gg/",
        players: [
            {
                name: "Gimmick",
                id: "76561198148418720",
                sub: 0
            },
            {
                name: "SquishyMuffinz",
                id: "",
                sub: 0
            },
            {
                name: "Torment",
                id: "76561198097285289",
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
                id: "76561198106926788",
                sub: 0
            },
            {
                name: "Astroh",
                id: "76561198354750319",
                sub: 0
            },
            {
                name: "Moses",
                id: "76561198043788652",
                sub: 0
            }
        ]
    },
    {
        name: "compLexity Gaming",
        link: "http://www.complexitygaming.com/",
        players: [
            {
                name: "al0t",
                id: "76561198129290934",
                sub: 0
            },
            {
                name: "gReazy",
                id: "76561198168950593",
                sub: 0
            },
            {
                name: "Mognus",
                id: "76561198072970081",
                sub: 0
            }
        ]
    },
    {
        name: "Epsilon eSports",
        link: "http://www.epsilon-esports.com/",
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
        link: "http://www.evilgeniuses.gg/",
        players: [
            {
                name: "Chicago",
                id: "76561198293785594",
                sub: 0
            },
            {
                name: "CorruptedG",
                id: "76561197992682099",
                sub: 0
            },
            {
                name: "Klassux",
                id: "76561198128584479",
                sub: 0
            }
        ]
    },
    {
        name: "exceL Esports",
        link: "http://www.excelesports.com/",
        players: [
            {
                name: "Markydooda",
                id: "76561198070673430",
                sub: 0
            },
            {
                name: "Nielskoek",
                id: "76561198068121494",
                sub: 0
            },
            {
                name: "Pwndx",
                id: "76561198000542688",
                sub: 0
            }
        ]
    },
    {
        name: "FlipSid3 Tactics",
        link: "http://www.flipsidetactics.com/",
        players: [
            {
                name: "kuxir97",
                id: "76561198072696308",
                sub: 0
            },
            {
                name: "miztik",
                id: "76561198064630547",
                sub: 0
            },
            {
                name: "Yukeo",
                id: "76561198374703623",
                sub: 0
            }
        ]
    },
    {
        name: "FlyQuest",
        link: "http://www.flyquest.gg/",
        players: [
            {
                name: "AyyJayy",
                id: "76561198105072499",
                sub: 0
            },
            {
                name: "PrimeThunder",
                id: "76561198076486170",
                sub: 0
            },
            {
                name: "Wonder",
                id: "76561198219259227",
                sub: 0
            }
        ]
    },
    {
        name: "Fnatic",
        link: "http://www.fnatic.com/",
        players: [
            {
                name: "Maestro",
                id: "76561198030080604",
                sub: 0
            },
            {
                name: "MummiSnow",
                id: "76561197995699131",
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
        link: "http://www.g2esports.com/",
        players: [
            {
                name: "JKnaps",
                id: "76561198061585314",
                sub: 0
            },
            {
                name: "Kronovi",
                id: "76561198076736523",
                sub: 0
            },
            {
                name: "Mijo",
                id: "",
                sub: 1
            },
            {
                name: "Rizzo",
                id: "76561198044109673",
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
                id: "76561198085868465",
                sub: 0
            },
            {
                name: "Memory",
                id: "76561198073484045",
                sub: 0
            },
            {
                name: "Zanejackey",
                id: "76561198065217357",
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
        link: "https://legacyesports.com.au/",
        players: [
            {
                name: "cyrix",
                id: "",
                sub: 0
            },
            {
                name: "Daze",
                id: "['DazedDreamer3', [70, 108, 174, 206, 14",
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
                id: "76561198412918093",
                sub: 0
            },
            {
                name: "Malakiss",
                id: "76561198163289208",
                sub: 0
            },
            {
                name: "Tmon",
                id: "76561198104680859",
                sub: 0
            }
        ]
    },
    {
        name: "Method",
        link: "https://www.method.gg",
        players: [
            {
                name: "Borito B",
                id: "76561198311129338",
                sub: 0
            },
            {
                name: "Kassio",
                id: "76561198285093463",
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
        link: "http://mockit.gg/",
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
                id: "76561198301423321",
                sub: 0
            },
            {
                name: "Skyline",
                id: "76561198075792637",
                sub: 0
            },
            {
                name: "Tigreee",
                id: "76561198306168245",
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
                id: "76561198018922320",
                sub: 0
            },
            {
                name: "Data",
                id: "76561198012554181",
                sub: 0
            },
            {
                name: "Godsmilla",
                id: "76561198078625479",
                sub: 0
            }
        ]
    },
    {
        name: "NRG Esports",
        link: "http://www.nrg.gg/",
        players: [
            {
                name: "Fireburner",
                id: "76561198070392546",
                sub: 0
            },
            {
                name: "GarrettG",
                id: "76561198136523266",
                sub: 0
            },
            {
                name: "JSTN",
                id: "76561198299709908",
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
                id: "76561198090443035",
                sub: 0
            }
        ]
    },
    {
        name: "Paradox Gaming",
        link: "https://paradoxgaming.com.au/",
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
        link: "http://www.psg-esports.com/home/",
        players: [
            {
                name: "Chausette45",
                id: "76561198183899729",
                sub: 0
            },
            {
                name: "Ferra",
                id: "76561198071457340",
                sub: 0
            },
            {
                name: "fruity",
                id: "76561198010679645",
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
                id: "76561198112703866",
                sub: 0
            },
            {
                name: "Speed",
                id: "76561198028829938",
                sub: 0
            },
            {
                name: "Tadpole",
                id: "76561198348804468",
                sub: 0
            }
        ]
    },
    {
        name: "Rogue",
        link: "http://www.rogue.gg/",
        players: [
            {
                name: "Jacob",
                id: "76561198043445470",
                sub: 0
            },
            {
                name: "Jorolelin",
                id: "",
                sub: 0
            },
            {
                name: "Matt",
                id: "76561198042521842",
                sub: 1
            },
            {
                name: "Sizz",
                id: "76561198011269283",
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
                id: "76561198353133370",
                sub: 0
            },
            {
                name: "Bluey",
                id: "76561198090715652",
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
        link: "http://senixesports.net/",
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
                id: "76561198140386409",
                sub: 0
            },
            {
                name: "Karma",
                id: "76561198015727607",
                sub: 0
            }
        ]
    },
    {
        name: "Tainted Minds",
        link: "http://www.taintedminds.org/",
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
        link: "http://team-dignitas.net/",
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
        link: "http://www.teamsecret.gg",
        players: [
            {
                name: "FlamE",
                id: "76561198353125160",
                sub: 0
            },
            {
                name: "FreaKii",
                id: "76561198080342535",
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
        link: "https://vitality.gg/en/",
        players: [
            {
                name: "Fairy Peak",
                id: "76561198213713880",
                sub: 0
            },
            {
                name: "Paschy90",
                id: "76561198218283141",
                sub: 0
            },
            {
                name: "Scrub Killa",
                id: "76561198089298636",
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
                id: "76561198149588664",
                sub: 0
            },
            {
                name: "Friis",
                id: "76561198062839628",
                sub: 0
            },
            {
                name: "Shakahron",
                id: "76561198064355007",
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
                id: "76561198126554140",
                sub: 0
            },
            {
                name: "Oscillon",
                id: "76561198323139029",
                sub: 0
            },
            {
                name: "PetricK",
                id: "76561198046013638",
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
                id: "76561198032576032",
                sub: 0
            },
            {
                name: "Insolences",
                id: "76561198114648253",
                sub: 0
            },
            {
                name: "Timi",
                id: "76561198356049718",
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
                id: "76561198349786030",
                sub: 0
            },
            {
                name: "Rapid",
                id: "76561198309249467",
                sub: 0
            },
            {
                name: "Vince",
                id: "76561198055313043",
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
                id: "76561198368482029",
                sub: 0
            },
            {
                name: "Gyro",
                id: "76561198153124313",
                sub: 0
            },
            {
                name: "Pirates",
                id: "76561198116539951",
                sub: 0
            }
        ]
    },
    {
        name: "Vapour Esports",
        link: "https://vapouresports.com/",
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
        link: "https://vapouresports.com/",
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

    public render() {
        // const matchUrl = this.props.match.url
        const teamId = this.props.match.params.id
        const team = teams.filter((t) => t.name === teamId)[0]
        const starters = team.players.filter((player) => player.sub === 0)
        const subs = team.players.filter((player) => player.sub === 1)

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
                                <Typography>Starters</Typography>
                                {starters.map((player) =>
                                    <EsportsPlayerListItem player={player} team={teamId} key={player.name}/>
                                )}
                                {subs.length > 0 ? <>
                                        <Divider/>
                                        <Typography>Subs</Typography>
                                        {subs.map((player) =>
                                            <EsportsPlayerListItem player={player} team={teamId} key={player.name}/>
                                        )}
                                    </>
                                    :
                                    ""}
                            </List>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <LoadableWrapper load={this.loadMatchHistory} reloadSignal={this.state.reloadSignal}>
                            {this.state.matchHistory ?
                                <ReplaysSearchResultDisplay page={0} limit={0} handleUpdateTags={this.handleUpdateTags}
                                                            replaySearchResult={this.state.matchHistory}/>
                                :
                                ""}
                        </LoadableWrapper>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }

    private readonly loadMatchHistory = () => {
        const teamId = this.props.match.params.id
        const team = teams.filter((t) => t.name === teamId)[0]
        const starters = team.players.filter((player) => player.sub === 0)
        // const subs = team.players.filter((player) => player.sub === 1)
        const searchParams: ReplaysSearchQueryParams = {
            page: 0,
            limit: 10,
            playerIds: starters.map((player) => player.id)
        }

        return searchReplays(searchParams).then((matchHistory) => this.setState({matchHistory}))
    }


    private readonly handleUpdateTags = (replay: Replay) => (tags: Tag[]) => {
        if (this.state.matchHistory) {
            this.setState({
                matchHistory: {
                    ...this.state.matchHistory,
                    replays: [
                        ...this.state.matchHistory.replays
                            .map((searchResultReplay): Replay => {
                                if (searchResultReplay.id === replay.id) {
                                    return {
                                        ...searchResultReplay,
                                        tags
                                    }
                                }
                                return searchResultReplay
                            })
                    ]
                }
            })
        }
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
