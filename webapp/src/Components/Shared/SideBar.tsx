import {faGithub, faPatreon} from "@fortawesome/free-brands-svg-icons"
import {faChartBar, faGlobeAmericas, faLightbulb} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@material-ui/core"
import CloudUpload from "@material-ui/icons/CloudUpload"
import CompareArrows from "@material-ui/icons/CompareArrows"
import Help from "@material-ui/icons/Help"
import Info from "@material-ui/icons/Info"
import Search from "@material-ui/icons/Search"
import ShowChart from "@material-ui/icons/ShowChart"
import TableChart from "@material-ui/icons/TableChart"
import * as React from "react"
import {Link, LinkProps} from "react-router-dom"
import {ThemeContext} from "../../Contexts/ThemeContext"
import {
    ABOUT_LINK,
    EXPLANATIONS_LINK,
    GITHUB_LINK,
    GLOBAL_STATS_LINK,
    LEADERBOARDS_LINK,
    PATREON_LINK,
    PLAYER_COMPARE_PAGE_LINK,
    REPLAYS_GROUP_PAGE_LINK,
    REPLAYS_SEARCH_PAGE_LINK,
    UPLOAD_LINK
} from "../../Globals"

interface Props {
    open: boolean
    onClose: () => void
}

export class SideBar extends React.PureComponent<Props> {
    private readonly createLink =
        // TODO: Remove forwardRef with react-router-dom 6; https://github.com/ReactTraining/react-router/issues/6056
        React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link innerRef={ref} {...props} />)

    public render() {
        return (
            <Drawer open={this.props.open} onClose={this.props.onClose}>
                <div style={{width: 230}}>
                    <List>
                        <ListSubheader>Replay</ListSubheader>
                        <ListItem button component={this.createLink} to={REPLAYS_SEARCH_PAGE_LINK()}>
                            <ListItemIcon>
                                <Search />
                            </ListItemIcon>
                            <ListItemText>Search</ListItemText>
                        </ListItem>

                        <ListItem button component={this.createLink} to={REPLAYS_GROUP_PAGE_LINK}>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faChartBar} size="lg" style={{width: 24}} />
                            </ListItemIcon>
                            <ListItemText>Groups</ListItemText>
                        </ListItem>

                        <Divider component="li" />

                        <ListSubheader>Player</ListSubheader>
                        <ListItem button component={this.createLink} to={LEADERBOARDS_LINK}>
                            <ListItemIcon>
                                <TableChart />
                            </ListItemIcon>
                            <ListItemText>Leaderboards</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink} to={PLAYER_COMPARE_PAGE_LINK}>
                            <ListItemIcon>
                                <CompareArrows />
                            </ListItemIcon>
                            <ListItemText>Compare</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink} to={PLAYER_COMPARE_PAGE_LINK}>
                            <ListItemIcon>
                                <ShowChart />
                            </ListItemIcon>
                            <ListItemText>Progression</ListItemText>
                        </ListItem>

                        <Divider component="li" />

                        <ListItem button component={this.createLink} to={GLOBAL_STATS_LINK}>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faGlobeAmericas} size="lg" />
                            </ListItemIcon>
                            <ListItemText>Global Stats</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink} to={EXPLANATIONS_LINK}>
                            <ListItemIcon>
                                <Help />
                            </ListItemIcon>
                            <ListItemText>Explanations</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink} to={UPLOAD_LINK}>
                            <ListItemIcon>
                                <CloudUpload />
                            </ListItemIcon>
                            <ListItemText>Upload</ListItemText>
                        </ListItem>
                        <ListItem button component={this.createLink} to={ABOUT_LINK}>
                            <ListItemIcon>
                                <Info />
                            </ListItemIcon>
                            <ListItemText>About Us</ListItemText>
                        </ListItem>

                        <Divider component="li" />

                        <ListItem
                            button
                            component="a"
                            href={PATREON_LINK}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{textDecoration: "none"}}
                        >
                            <ListItemIcon style={{width: 24}}>
                                <FontAwesomeIcon icon={faPatreon} size="lg" style={{width: 24}} />
                            </ListItemIcon>
                            <ListItemText>Support Us</ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            component="a"
                            href={GITHUB_LINK}
                            target="_blank"
                            rel="noreferrer noopener"
                            style={{textDecoration: "none"}}
                        >
                            <ListItemIcon style={{width: 24}}>
                                <FontAwesomeIcon icon={faGithub} size="lg" style={{width: 24}} />
                            </ListItemIcon>
                            <ListItemText>Contribute</ListItemText>
                        </ListItem>

                        <Divider component="li" />
                        <ThemeContext.Consumer>
                            {(themeValue) => (
                                <ListItem button onClick={themeValue.toggleTheme}>
                                    <ListItemIcon style={{width: 24}}>
                                        <FontAwesomeIcon icon={faLightbulb} size="lg" style={{width: 24}} />
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
}
