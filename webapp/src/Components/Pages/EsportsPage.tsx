import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core"
import * as React from "react"
import { Link } from "react-router-dom"
import { ESPORTS_TEAM_LINK } from "../../Globals"
import { BasePage } from "./BasePage"

// interface TeamInfo {
//     name: string
//     link: string
//     message: string
// }

const teamNames = ["Applesauce", "Allegiance", "Bread", "Chiefs Esports", "Cloud9", "Compadres", "compLexity Gaming",
    "Copenhagen Flames",
    "Evil Geniuses", "exceL Esports", "FlipSid3 Tactics", "FlyQuest", "Fnatic", "G2 Esports", "Ghost Gaming",
    "Manhattan", "Method",
    "mousesports", "Nordavind", "NRG Esports", "PSG eSports", "Red Reserve", "Rogue", "Savage!", "Splyce",
    "Team Dignitas", "Team Secret", "Team Vitality", "The Clappers", "The Hosses", "The Magicians", "The Peeps",
    "We Dem Girlz"]

export class EsportsPage extends React.PureComponent {
    public render() {
        const header = (
            <Card>
                <CardHeader title="Esports" subheader="calculated.gg <3 RLEsports"/>
                <Divider/>
                <CardContent>
                    <Typography>
                        Take a look below for esports content!
                    </Typography>
                </CardContent>
            </Card>
        )

        const teamList = (
            <Card>
                <CardHeader title="Teams" subheader=""/>
                <Divider/>
                <List>
                    {teamNames.map((name) =>
                        <Link to={ESPORTS_TEAM_LINK(name)} style={{textDecoration: "none"}} key={name}>
                            <ListItem button>
                                <Avatar src={`/team-logos/${name}.png`}/>
                                <ListItemText primary={name}/>
                            </ListItem>
                        </Link>
                    )}
                </List>
            </Card>
        )

        return (
            <BasePage backgroundImage={"/splash.png"}>
                <Grid container justify="center">
                    <Grid item xs={12} lg={10} xl={8}>
                        <Grid container spacing={16} justify="center">
                            <Grid item xs={12}>
                                {header}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {teamList}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </BasePage>
        )
    }
}

// type PersonListItemComponentProps = ListItemInfo & WithStyles<typeof personListItemStyles>
//
// const PersonListItemComponent: React.SFC<PersonListItemComponentProps> = (props) => (
//     <ListItem>
//         <ListItemText
//             primary={
//                 <ExternalLink name={props.name} link={props.link}/>}
//             secondary={props.message}
//             classes={props.classes}
//         />
//     </ListItem>
// )
//
// const personListItemStyles = createStyles({
//     secondary: {
//         fontWeight: 400
//     }
// })
//
// const PersonListItem = withStyles(personListItemStyles)(PersonListItemComponent)
//
// type ExternalLinkProps = Pick<ListItemInfo, "link" | "name">

// const ExternalLink: React.SFC<ExternalLinkProps> = (props) => (
//     <a href={props.link}
//        target="_blank"
//        style={{textDecoration: "none", display: "inline-flex"}}
//     >
//         <ButtonBase>
//             <Typography>
//                 {props.name}
//             </Typography>
//         </ButtonBase>
//     </a>
// )
