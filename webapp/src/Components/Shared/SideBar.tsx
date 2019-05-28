import { faGithub, faPatreon } from "@fortawesome/free-brands-svg-icons"
import { faGlobeAmericas } from "@fortawesome/free-solid-svg-icons"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@material-ui/core"
import CloudUpload from "@material-ui/icons/CloudUpload"
import CompareArrows from "@material-ui/icons/CompareArrows"
import Help from "@material-ui/icons/Help"
import Info from "@material-ui/icons/Info"
import Search from "@material-ui/icons/Search"
import ShowChart from "@material-ui/icons/ShowChart"
import * as React from "react"
import { Link } from "react-router-dom"
import {
    ABOUT_LINK,
    EXPLANATIONS_LINK,
    GITHUB_LINK,
    GLOBAL_STATS_LINK,
    PATREON_LINK,
    PLAYER_COMPARE_PAGE_LINK,
    PLAYER_SEARCH_PAGE_LINK,
    REPLAYS_SEARCH_PAGE_LINK,
    UPLOAD_LINK
} from "../../Globals"
import { ThemeContext } from "../../Theme"

interface Props {
    open: boolean
    onClose: () => void
}

export class SideBar extends React.PureComponent<Props> {
    public render() {
        return (
            <Drawer open={this.props.open} onClose={this.props.onClose}>
                <div style={{width: 230}}>
                    <List>
                        <ListSubheader>Replay</ListSubheader>
                        <ListItem button component={this.createLink(REPLAYS_SEARCH_PAGE_LINK())}>
                            <ListItemIcon><Search/></ListItemIcon>
                            <ListItemText>Search</ListItemText>
                        </ListItem>

                        <Divider component={"li" as any}/>

                        <ListSubheader>Player</ListSubheader>
                        <ListItem button component={this.createLink(PLAYER_SEARCH_PAGE_LINK)} disabled>
                            <ListItemIcon><Search/></ListItemIcon>
                            <ListItemText secondary="Coming soon">Search</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink(PLAYER_COMPARE_PAGE_LINK)}>
                            <ListItemIcon><CompareArrows/></ListItemIcon>
                            <ListItemText>Compare</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink(PLAYER_COMPARE_PAGE_LINK)}>
                            <ListItemIcon><ShowChart/></ListItemIcon>
                            <ListItemText>Progression</ListItemText>
                        </ListItem>

                        <Divider component={"li" as any}/>

                        <ListItem button component={this.createLink(GLOBAL_STATS_LINK)}>
                            <ListItemIcon><FontAwesomeIcon icon={faGlobeAmericas} size="lg"/></ListItemIcon>
                            <ListItemText>Global Stats</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink(EXPLANATIONS_LINK)}>
                            <ListItemIcon><Help/></ListItemIcon>
                            <ListItemText>Explanations</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink(UPLOAD_LINK)}>
                            <ListItemIcon><CloudUpload/></ListItemIcon>
                            <ListItemText>Upload</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink(ABOUT_LINK)}>
                            <ListItemIcon><Info/></ListItemIcon>
                            <ListItemText>About Us</ListItemText>
                        </ListItem>

                        <Divider component={"li" as any}/>

                        <ListItem
                            button
                            component="a"
                            href={PATREON_LINK}
                            target="_blank" rel="noreferrer noopener"
                            style={{textDecoration: "none"}}
                        >
                            <ListItemIcon style={{width: 24}}>
                                <FontAwesomeIcon icon={faPatreon} size="lg" fixedWidth/>
                            </ListItemIcon>
                            <ListItemText>Support Us</ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            component="a"
                            href={GITHUB_LINK}
                            target="_blank" rel="noreferrer noopener"
                            style={{textDecoration: "none"}}
                        >
                            <ListItemIcon style={{width: 24}}>
                                <FontAwesomeIcon icon={faGithub} size="lg" fixedWidth/>
                            </ListItemIcon>
                            <ListItemText>Contribute</ListItemText>
                        </ListItem>

                        <Divider component={"li" as any}/>
                        <ThemeContext.Consumer>
                            {(themeValue) => (
                                <ListItem
                                    button
                                    onClick={themeValue.toggleTheme}
                                >
                                    <ListItemIcon style={{width: 24}}>
                                        <FontAwesomeIcon icon={faLightbulb} size="lg" fixedWidth/>
                                    </ListItemIcon>
                                    <ListItemText>Toggle theme</ListItemText>
                                </ListItem>
                            )}
                        </ThemeContext.Consumer>
                    </List>
                </div>
            </Drawer>
        )
    }

    private readonly createLink = (to: string) => (props: {}) => <Link to={to} {...props}/>

}
